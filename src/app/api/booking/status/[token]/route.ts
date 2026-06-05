import { NextResponse } from "next/server";
import {
  getBookingByToken,
  transitionBookingStatus,
  markPolledNow,
  recordEmailSent,
  type Booking,
} from "@/lib/booking-store";
import { getHeySetterBooking } from "@/lib/heysetter";
import { deleteEvent, updateEventSummary } from "@/lib/google-calendar";
import { categoryLabel, humanizeSlot, TZ_OFFSET } from "@/lib/booking";
import {
  sendBookingPaidFinal,
  sendBookingExpired,
} from "@/lib/booking-email";
import { SITE_URL } from "@/lib/seo";

/**
 * GET /api/booking/status/[token]
 *
 * Devuelve el snapshot actual del estado de la reserva. Si el booking está
 * en `pending_payment`, hace un best-effort GET contra HeySetter para detectar
 * transiciones (paid / cancelled). Cuando detecta una transición:
 *   1. UPDATE Supabase condicional (WHERE status_mirror='pending_payment').
 *      Resuelve la race con el cron — solo uno gana.
 *   2. Si ganó: side effects (update título Google + email Reviá).
 *   3. Marca email_states_sent jsonb (idempotente vía RPC).
 *
 * Si HeySetter responde error, devuelve el snapshot cacheado en Supabase
 * (fail-soft — la próxima llamada o el cron capturarán la transición).
 *
 * ADR: 03-decisions/0010-booking-pago-bold-recordatorios.md (adenda 2026-06-02)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StatusSnapshot = {
  token: string;
  status: "pending_payment" | "paid" | "cancelled";
  category: string;
  categoryLabel: string;
  name: string;
  whenLabel: string;
  paymentLink: string | null;
  expiresAt: string;
  paidAt: string | null;
  cancelledAt: string | null;
  agendarLink: string;
};

function snapshot(b: Booking): StatusSnapshot {
  return {
    token: b.token,
    status: b.status_mirror,
    category: b.category,
    categoryLabel: categoryLabel(b.category),
    name: b.name,
    whenLabel: humanizeSlot(b.date, b.time),
    paymentLink: b.payment_link,
    expiresAt: b.expires_at,
    paidAt: b.paid_at,
    cancelledAt: b.cancelled_at,
    agendarLink: `${SITE_URL}/contacto?categoria=${b.category}`,
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
): Promise<Response> {
  const { token } = await params;
  if (!token) {
    return NextResponse.json({ error: "Token requerido." }, { status: 400 });
  }

  let booking: Booking | null;
  try {
    booking = await getBookingByToken(token);
  } catch (err) {
    console.error("[status] getBookingByToken falló:", err);
    return NextResponse.json(
      { error: "No se pudo consultar la reserva." },
      { status: 502 },
    );
  }

  if (!booking) {
    return NextResponse.json({ error: "Reserva no encontrada." }, { status: 404 });
  }

  // Estados terminales: snapshot directo, no consulta a HeySetter.
  if (booking.status_mirror !== "pending_payment") {
    return NextResponse.json(snapshot(booking));
  }

  // Pending: refresh best-effort contra HeySetter.
  if (booking.heysetter_booking_id) {
    const hs = await getHeySetterBooking(booking.heysetter_booking_id);
    if (hs.ok) {
      if (hs.status === "paid") {
        await applyTransitionToPaid(booking);
      } else if (hs.status === "cancelled") {
        await applyTransitionToCancelled(booking);
      } else {
        // Sigue pending: solo marca último poll.
        markPolledNow(booking.id).catch((e) =>
          console.error("[status] markPolledNow falló:", e),
        );
      }
    } else {
      // HeySetter no responde bien — degradamos al snapshot cacheado.
      console.warn(
        "[status] HeySetter GET error:",
        hs.code,
        hs.message,
        hs.traceId ? `trace=${hs.traceId}` : "",
      );
      markPolledNow(booking.id).catch(() => {});
    }
    // Re-lee para reflejar la transición si la hubo.
    try {
      const fresh = await getBookingByToken(token);
      if (fresh) booking = fresh;
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json(snapshot(booking));
}

// ─── Transiciones (idempotentes vía UPDATE condicional + jsonb append) ──────

async function applyTransitionToPaid(b: Booking): Promise<void> {
  const now = new Date().toISOString();
  let won = false;
  try {
    won = await transitionBookingStatus(b.id, "paid", now);
  } catch (err) {
    console.error("[status] transitionBookingStatus(paid) falló:", err);
    return;
  }
  if (!won) return; // alguien más (cron) ya transicionó

  const catLabel = categoryLabel(b.category);

  // 1) Cambiar título del evento (quitar "Pendiente de pago").
  if (b.calendar_event_id) {
    try {
      await updateEventSummary({
        category: b.category,
        eventId: b.calendar_event_id,
        summary: `Valoración ${catLabel} — ${b.name}`,
      });
    } catch (err) {
      console.error("[status] updateEventSummary falló:", err);
    }
  }

  // 2) Email "pago confirmado" — solo si no se mandó.
  if (!b.email_states_sent.includes("paid")) {
    try {
      const sent = await sendBookingPaidFinal({
        name: b.name,
        email: b.email,
        serviceName: `Valoración ${catLabel}`,
        whenLabel: humanizeSlot(b.date, b.time),
        notes: b.notes ?? undefined,
        slotStartIso: `${b.date}T${b.time}:00${TZ_OFFSET}`,
      });
      if (sent) {
        await recordEmailSent(b.id, "paid");
      }
    } catch (err) {
      console.error("[status] sendBookingPaidFinal falló:", err);
    }
  }
}

async function applyTransitionToCancelled(b: Booking): Promise<void> {
  const now = new Date().toISOString();
  let won = false;
  try {
    won = await transitionBookingStatus(b.id, "cancelled", now);
  } catch (err) {
    console.error("[status] transitionBookingStatus(cancelled) falló:", err);
    return;
  }
  if (!won) return;

  // 1) Borrar evento Google.
  if (b.calendar_event_id) {
    try {
      await deleteEvent({
        category: b.category,
        eventId: b.calendar_event_id,
      });
    } catch (err) {
      console.error("[status] deleteEvent falló:", err);
    }
  }

  // 2) Email "reserva expirada" — solo si no se mandó.
  if (!b.email_states_sent.includes("cancelled")) {
    const catLabel = categoryLabel(b.category);
    try {
      const sent = await sendBookingExpired({
        name: b.name,
        email: b.email,
        serviceName: `Valoración ${catLabel}`,
        whenLabel: humanizeSlot(b.date, b.time),
        agendarLink: `${SITE_URL}/contacto?categoria=${b.category}`,
        slotStartIso: `${b.date}T${b.time}:00${TZ_OFFSET}`,
      });
      if (sent) {
        await recordEmailSent(b.id, "cancelled");
      }
    } catch (err) {
      console.error("[status] sendBookingExpired falló:", err);
    }
  }
}
