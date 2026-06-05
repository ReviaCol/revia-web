import { NextResponse } from "next/server";

import {
  isBookingCategory,
  categoryLabel,
  isValidBookingDate,
  generateDaySlots,
  filterFreeSlots,
  humanizeSlot,
  TIME_ZONE,
  TZ_OFFSET,
} from "@/lib/booking";
import {
  freeBusy,
  insertEvent,
  deleteEvent,
  isCalendarConfigured,
} from "@/lib/google-calendar";
import {
  createBooking,
  setHeySetterRefs,
  setCalendarEventId,
  deleteBookingById,
  isBookingStoreConfigured,
} from "@/lib/booking-store";
import {
  createHeySetterBooking,
  isHeySetterConfigured,
  type HeySetterErrorCode,
} from "@/lib/heysetter";
import {
  generateBookingToken,
  generateIdempotencyKey,
} from "@/lib/booking-token";
import { sendBookingPendingPayment } from "@/lib/booking-email";
import { normalizeColombianPhone } from "@/lib/phone";
import { SITE_URL } from "@/lib/seo";

/**
 * POST /api/booking — crea una reserva pendiente de pago.
 *
 * ADR: 03-decisions/0010-booking-pago-bold-recordatorios.md (adenda 2026-06-02)
 *
 * Flujo (con rollback en cada fallo):
 *   1) Valida input + helpers de configuración por categoría.
 *   2) Revalida slot vs Google freeBusy del calendario asociado.
 *   3) Genera token + idempotency_key (UUID v4) + monto.
 *   4) INSERT Supabase (status_mirror=pending_payment, expires_at=now+12h).
 *   5) INSERT evento Google "Pendiente de pago — Valoración {Cat} — {nombre}".
 *   6) POST HeySetter (HeySetter genera payment_link Bold + manda WhatsApp + agenda
 *      recordatorios + maneja expiración 12h).
 *   7) UPDATE Supabase con heysetter_booking_id + payment_link.
 *   8) Email Reviá "pendiente con link de pago" (fail-soft).
 *   9) Return { ok, token, paymentLink, trackingLink, expiresAt, whenLabel }.
 *
 * Rollback: cualquier fallo post-INSERT-Supabase elimina lo creado en pasos
 * anteriores (evento Google + fila Supabase) para no dejar estado huérfano.
 * HeySetter en error temprano no se rollbackea (su idempotency_key garantiza
 * que un retry desde Reviá no duplique la reserva).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── Constantes ─────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const DEFAULT_AMOUNT_COP = 50000;
const PAYMENT_HOURS = 12;

// ─── Helpers ────────────────────────────────────────────────────────────────

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Lee `BOOKING_AMOUNT_COP` con default 50.000. */
function getAmountCop(): number {
  const raw = process.env.BOOKING_AMOUNT_COP;
  if (!raw) return DEFAULT_AMOUNT_COP;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_AMOUNT_COP;
}

/** Mapeo HeySetterErrorCode → respuesta editorial al cliente Reviá. */
const HS_ERROR_TO_HTTP: Record<HeySetterErrorCode, { status: number; message: string }> = {
  slot_unavailable: {
    status: 409,
    message: "Ese horario ya no está disponible. Por favor elige otro.",
  },
  invalid_phone: {
    status: 400,
    message: "Tu teléfono no parece válido. Usa el formato +57 318 ...",
  },
  unsupported_currency: {
    status: 500,
    message: "Hay un problema con la configuración de moneda. Estamos al tanto.",
  },
  invalid_due_in_hours: {
    status: 500,
    message: "Hay un problema con la configuración del plazo de pago.",
  },
  idempotency_key_required: {
    status: 500,
    message: "Conflicto interno del sistema. Intenta de nuevo.",
  },
  idempotency_key_conflict: {
    status: 500,
    message: "Conflicto interno del sistema. Intenta de nuevo.",
  },
  key_missing: {
    status: 503,
    message: "El sistema de reservas no está disponible ahora mismo.",
  },
  key_invalid: {
    status: 503,
    message: "El sistema de reservas no está disponible ahora mismo.",
  },
  key_revoked: {
    status: 503,
    message: "El sistema de reservas no está disponible ahora mismo.",
  },
  insufficient_scope: {
    status: 503,
    message: "El sistema de reservas no está disponible ahora mismo.",
  },
  rate_limited: {
    status: 503,
    message: "Estamos recibiendo muchas solicitudes. Intenta en un momento.",
  },
  payment_provider_not_configured: {
    status: 503,
    message: "El sistema de pagos está en mantenimiento.",
  },
  payment_provider_unavailable: {
    status: 502,
    message: "El sistema de pagos está reiniciándose. Intenta en un minuto.",
  },
  internal_error: {
    status: 502,
    message: "No pudimos completar la reserva. Intenta de nuevo o escríbenos por WhatsApp.",
  },
  transport_error: {
    status: 502,
    message: "No pudimos completar la reserva. Intenta de nuevo o escríbenos por WhatsApp.",
  },
  not_configured: {
    status: 503,
    message: "El sistema de reservas no está disponible ahora mismo.",
  },
  unknown: {
    status: 502,
    message: "No pudimos completar la reserva. Intenta de nuevo o escríbenos por WhatsApp.",
  },
};

// ─── Handler ────────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  // ── 1. Parse + validar body ────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const category = str(body.category);
  const name = str(body.name);
  const email = str(body.email);
  const phoneRaw = str(body.phone);
  const date = str(body.date);
  const time = str(body.time);
  const notes = str(body.notes);

  if (!isBookingCategory(category)) {
    return NextResponse.json({ error: "Categoría no válida." }, { status: 400 });
  }
  if (!name || !email || !phoneRaw || !date || !time) {
    return NextResponse.json({ error: "Faltan datos obligatorios." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email no válido." }, { status: 400 });
  }
  if (!TIME_RE.test(time) || !isValidBookingDate(date)) {
    return NextResponse.json({ error: "Fecha u hora no válida." }, { status: 400 });
  }

  // Configuración por capa (fail-soft con mensaje cálido).
  if (!isCalendarConfigured(category)) {
    return NextResponse.json(
      { error: "El sistema de reservas no está disponible ahora mismo." },
      { status: 503 },
    );
  }
  if (!isHeySetterConfigured(category)) {
    return NextResponse.json(
      { error: "El sistema de reservas no está disponible ahora mismo." },
      { status: 503 },
    );
  }
  if (!isBookingStoreConfigured()) {
    console.error("[booking] Supabase no configurado (faltan env).");
    return NextResponse.json(
      { error: "El sistema de reservas no está disponible ahora mismo." },
      { status: 503 },
    );
  }

  // ── 2. Revalidar slot vs Google freeBusy ──────────────────────────────────
  const slot = generateDaySlots(date).find((s) => s.time === time);
  if (!slot) {
    return NextResponse.json({ error: "Horario no válido." }, { status: 400 });
  }

  let busy: { start: string; end: string }[];
  try {
    busy = await freeBusy(
      category,
      `${date}T00:00:00${TZ_OFFSET}`,
      `${date}T23:59:59${TZ_OFFSET}`,
    );
  } catch (err) {
    console.error("[booking] freeBusy falló:", err);
    return NextResponse.json(
      { error: "No pudimos verificar la disponibilidad. Intenta de nuevo." },
      { status: 502 },
    );
  }

  if (filterFreeSlots([slot], busy).length === 0) {
    return NextResponse.json(
      { error: "Ese horario ya no está disponible. Por favor elige otro." },
      { status: 409 },
    );
  }

  // ── 3. Generar IDs + datos derivados ─────────────────────────────────────
  const token = generateBookingToken();
  const idempotencyKey = generateIdempotencyKey();
  const amountCop = getAmountCop();
  const expiresAt = new Date(Date.now() + PAYMENT_HOURS * 3600 * 1000).toISOString();
  const phone = normalizeColombianPhone(phoneRaw);
  const catLabel = categoryLabel(category);
  const whenLabel = humanizeSlot(date, time);
  const trackingLink = `${SITE_URL}/reserva/${token}`;

  // ── 4. INSERT Supabase ───────────────────────────────────────────────────
  let bookingRowId: string;
  try {
    const row = await createBooking({
      token,
      idempotency_key: idempotencyKey,
      external_ref: token,
      category,
      name,
      email,
      phone,
      notes: notes ? notes : null,
      date,
      time,
      amount_cop: amountCop,
      expires_at: expiresAt,
    });
    bookingRowId = row.id;
  } catch (err) {
    console.error("[booking] createBooking falló:", err);
    return NextResponse.json(
      { error: "No pudimos guardar la reserva. Intenta de nuevo." },
      { status: 502 },
    );
  }

  // ── 5. INSERT evento Google ──────────────────────────────────────────────
  const eventDescription =
    `Reserva desde la web de Reviá (PENDIENTE DE PAGO).\n` +
    `Token: ${token}\n` +
    `Paciente: ${name}\nEmail: ${email}\nTeléfono: ${phone}\n` +
    `Categoría: ${catLabel}` +
    (notes ? `\nNotas: ${notes}` : "") +
    `\n\nSeguimiento: ${trackingLink}`;

  let calendarEventId: string;
  try {
    calendarEventId = await insertEvent({
      category,
      summary: `Pendiente de pago — Valoración ${catLabel} — ${name}`,
      description: eventDescription,
      startISO: slot.startISO,
      endISO: slot.endISO,
      timeZone: TIME_ZONE,
    });
  } catch (err) {
    console.error("[booking] insertEvent falló — rollback Supabase:", err);
    await deleteBookingById(bookingRowId).catch((e) =>
      console.error("[booking] rollback Supabase falló:", e),
    );
    return NextResponse.json(
      { error: "No pudimos completar la reserva. Intenta de nuevo." },
      { status: 502 },
    );
  }

  // Best-effort: guardar calendar_event_id (si falla no es crítico — el evento
  // existe; solo perdemos el puntero para el cron de sync).
  try {
    await setCalendarEventId(bookingRowId, calendarEventId);
  } catch (err) {
    console.error("[booking] setCalendarEventId falló (continuo):", err);
  }

  // ── 6. POST HeySetter ────────────────────────────────────────────────────
  const hsResult = await createHeySetterBooking({
    category,
    customer: { name, phone, email },
    slot: { date, time },
    amountCop,
    externalRef: token,
    idempotencyKey,
    notes: notes || undefined,
  });

  if (!hsResult.ok) {
    console.error(
      "[booking] HeySetter falló — rollback Google + Supabase:",
      hsResult.code,
      hsResult.message,
      hsResult.traceId ? `trace=${hsResult.traceId}` : "",
    );
    await Promise.allSettled([
      deleteEvent({ category, eventId: calendarEventId }),
      deleteBookingById(bookingRowId),
    ]);
    const mapped = HS_ERROR_TO_HTTP[hsResult.code];
    const headers: Record<string, string> = {};
    if (hsResult.retryAfterSec) {
      headers["Retry-After"] = String(hsResult.retryAfterSec);
    }
    return NextResponse.json(
      { error: mapped.message },
      { status: mapped.status, headers },
    );
  }

  // ── 7. UPDATE Supabase con refs HeySetter ────────────────────────────────
  try {
    await setHeySetterRefs(bookingRowId, hsResult.id, hsResult.paymentLink);
  } catch (err) {
    console.error(
      "[booking] setHeySetterRefs falló — rollback Google + Supabase (HeySetter queda con idempotency válida):",
      err,
    );
    await Promise.allSettled([
      deleteEvent({ category, eventId: calendarEventId }),
      deleteBookingById(bookingRowId),
    ]);
    return NextResponse.json(
      { error: "No pudimos completar la reserva. Intenta de nuevo." },
      { status: 502 },
    );
  }

  // ── 8. Email Reviá "pendiente con link" (fail-soft, no esperamos) ────────
  void sendBookingPendingPayment({
    name,
    email,
    serviceName: `Valoración ${catLabel}`,
    whenLabel,
    paymentLink: hsResult.paymentLink,
    trackingLink,
    amountCop,
    hoursAvailable: PAYMENT_HOURS,
  }).catch((e) =>
    console.error("[booking] sendBookingPendingPayment falló:", e),
  );

  // ── 9. Devolver al cliente ───────────────────────────────────────────────
  return NextResponse.json({
    ok: true,
    token,
    paymentLink: hsResult.paymentLink,
    trackingLink,
    expiresAt,
    whenLabel,
  });
}
