import { NextResponse } from "next/server";
import {
  listPendingForPoll,
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
 * POST /api/cron/booking-tick
 *
 * Cron de Vercel cada 10 min. Lista todos los bookings en `pending_payment`
 * que llevan ≥5 min sin pollearse, consulta el estado en HeySetter, y aplica
 * transiciones (paid / cancelled) con sus side effects (calendar + email).
 *
 * Idempotente — usa el mismo patrón UPDATE-condicional + jsonb append que el
 * status API, así que las dos rutas (cron + client-poll) coexisten sin
 * duplicar emails ni updates de calendario.
 *
 * Auth: header `Authorization: Bearer ${CRON_SECRET}` (Vercel Cron lo manda
 * automáticamente cuando la var está seteada en el proyecto). Si no matchea
 * o no está configurado, 401.
 *
 * ADR: 03-decisions/0010-booking-pago-bold-recordatorios.md (adenda 2026-06-02)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BATCH_SIZE = 50;
const STALE_MS = 5 * 60_000;

type Counts = {
  processed: number;
  transitionedToPaid: number;
  transitionedToCancelled: number;
  stillPending: number;
  heysetterErrors: number;
  bookingsWithoutHeySetterId: number;
};

function unauthorized(): Response {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

export async function POST(request: Request): Promise<Response> {
  if (!isAuthorized(request)) return unauthorized();

  let pending: Booking[];
  try {
    pending = await listPendingForPoll({ limit: BATCH_SIZE, staleMs: STALE_MS });
  } catch (err) {
    console.error("[cron] listPendingForPoll falló:", err);
    return NextResponse.json(
      { error: "No se pudo listar bookings pendientes." },
      { status: 502 },
    );
  }

  const counts: Counts = {
    processed: 0,
    transitionedToPaid: 0,
    transitionedToCancelled: 0,
    stillPending: 0,
    heysetterErrors: 0,
    bookingsWithoutHeySetterId: 0,
  };

  // Procesamos secuencialmente para evitar saturar HeySetter (rate limit 100/min)
  // y los calendarios Google. El batch es pequeño (≤50) → tiempo total bajo.
  for (const booking of pending) {
    counts.processed += 1;
    try {
      await processOne(booking, counts);
    } catch (err) {
      console.error("[cron] processOne falló:", booking.id, err);
    }
  }

  return NextResponse.json({ ok: true, ...counts });
}

// GET para health-check manual desde el browser (mismo auth).
export async function GET(request: Request): Promise<Response> {
  return POST(request);
}

// ─── Loop por booking ───────────────────────────────────────────────────────

async function processOne(b: Booking, counts: Counts): Promise<void> {
  // Booking huérfano (Reviá guardó pero HeySetter nunca confirmó): saltamos.
  // El siguiente paso debería ser limpiarlo, pero por ahora solo lo logueamos.
  if (!b.heysetter_booking_id) {
    counts.bookingsWithoutHeySetterId += 1;
    console.warn("[cron] booking sin heysetter_booking_id:", b.id, b.token);
    await markPolledNow(b.id).catch(() => {});
    return;
  }

  const hs = await getHeySetterBooking(b.heysetter_booking_id);
  if (!hs.ok) {
    counts.heysetterErrors += 1;
    console.warn(
      "[cron] HeySetter GET error:",
      b.id,
      hs.code,
      hs.message,
      hs.traceId ? `trace=${hs.traceId}` : "",
    );
    await markPolledNow(b.id).catch(() => {});
    return;
  }

  if (hs.status === "paid") {
    const won = await safeTransition(b, "paid");
    if (won) {
      counts.transitionedToPaid += 1;
      await applyPaidSideEffects(b);
    }
  } else if (hs.status === "cancelled") {
    const won = await safeTransition(b, "cancelled");
    if (won) {
      counts.transitionedToCancelled += 1;
      await applyCancelledSideEffects(b);
    }
  } else {
    counts.stillPending += 1;
    await markPolledNow(b.id).catch(() => {});
  }
}

async function safeTransition(
  b: Booking,
  to: "paid" | "cancelled",
): Promise<boolean> {
  const now = new Date().toISOString();
  try {
    return await transitionBookingStatus(b.id, to, now);
  } catch (err) {
    console.error(`[cron] transition(${to}) falló:`, b.id, err);
    return false;
  }
}

async function applyPaidSideEffects(b: Booking): Promise<void> {
  const catLabel = categoryLabel(b.category);

  if (b.calendar_event_id) {
    try {
      await updateEventSummary({
        category: b.category,
        eventId: b.calendar_event_id,
        summary: `Valoración ${catLabel} — ${b.name}`,
      });
    } catch (err) {
      console.error("[cron] updateEventSummary falló:", b.id, err);
    }
  }

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
      if (sent) await recordEmailSent(b.id, "paid");
    } catch (err) {
      console.error("[cron] sendBookingPaidFinal falló:", b.id, err);
    }
  }
}

async function applyCancelledSideEffects(b: Booking): Promise<void> {
  if (b.calendar_event_id) {
    try {
      await deleteEvent({
        category: b.category,
        eventId: b.calendar_event_id,
      });
    } catch (err) {
      console.error("[cron] deleteEvent falló:", b.id, err);
    }
  }

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
      if (sent) await recordEmailSent(b.id, "cancelled");
    } catch (err) {
      console.error("[cron] sendBookingExpired falló:", b.id, err);
    }
  }
}
