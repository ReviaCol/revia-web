import type { BookingCategory } from "./booking";

/**
 * heysetter.ts — cliente HTTP para la API v1 de HeySetter.
 *
 * ADR: 03-decisions/0010-booking-pago-bold-recordatorios.md (adenda 2026-06-02)
 *
 * HeySetter (proyecto separado, propiedad de Andres) orquesta el pago Bold y
 * los mensajes WhatsApp (Meta-approved templates) para Reviá. Reviá solo
 * dispara el POST inicial y pollea el GET; HeySetter se encarga de:
 *   - generar el `payment_link` (Bold sandbox/live según mode de la API key)
 *   - mandar el WhatsApp inicial "pendiente de pago"
 *   - agendar y mandar los 3 recordatorios automáticos (4h/2h/30min antes
 *     del `payment_due_at`)
 *   - confirmar el pago (cuando Bold avisa) → marcar `status='paid'`
 *   - cancelar y notificar (cuando expira 12h sin pago) → `status='cancelled'`
 *
 * Auth: `Authorization: Bearer ${HEYSETTER_API_KEY}` + `Idempotency-Key`
 * header obligatorio en POST (UUID v4 generado por Reviá, persistido en la
 * tabla `bookings` para sobrevivir crashes).
 *
 * Server-only. La key NUNCA llega al cliente.
 */

const PATH_CREATE = "/api/v1/bookings";
const PATH_GET = (id: string) => `/api/v1/bookings/${encodeURIComponent(id)}`;
const SOURCE = "revia_web";
const PAYMENT_PROVIDER = "bold" as const;
const PAYMENT_CURRENCY = "COP" as const;
const PAYMENT_DUE_HOURS = 12;
const AGENT_ID_ENV = "HEYSETTER_AGENT_ID";
const BASE_ENV = "HEYSETTER_API_BASE";
const KEY_ENV = "HEYSETTER_API_KEY";
const APPT_ESTETICA_ENV = "HEYSETTER_APPT_TYPE_ESTETICA";
const APPT_CAPILAR_ENV = "HEYSETTER_APPT_TYPE_CAPILAR";

// ─── Tipos de error ────────────────────────────────────────────────────────

/**
 * Códigos canónicos que devolvemos al caller. Los HTTP-specific (400/401/etc.)
 * de HeySetter se normalizan acá. Los códigos `transport_error` y
 * `not_configured` son nuestros, no de HeySetter.
 */
export type HeySetterErrorCode =
  // 400
  | "idempotency_key_required"
  | "invalid_phone"
  | "unsupported_currency"
  | "invalid_due_in_hours"
  // 401 / 403
  | "key_missing"
  | "key_invalid"
  | "key_revoked"
  | "insufficient_scope"
  // 409
  | "slot_unavailable"
  | "idempotency_key_conflict"
  // 422
  | "payment_provider_not_configured"
  // 429
  | "rate_limited"
  // 502
  | "payment_provider_unavailable"
  // 500
  | "internal_error"
  // Nuestros (no de HeySetter)
  | "transport_error"
  | "not_configured"
  | "unknown";

export type HeySetterError = {
  ok: false;
  code: HeySetterErrorCode;
  message: string;
  status: number;              // 0 para transport_error / not_configured
  retryAfterSec?: number;      // cuando code === "rate_limited"
  traceId?: string;            // cuando code === "internal_error"
};

// ─── Tipos de input/output ─────────────────────────────────────────────────

export type CreateHeySetterBookingInput = {
  category: BookingCategory;
  customer: { name: string; phone: string; email: string };
  slot: { date: string; time: string };  // YYYY-MM-DD / HH:mm
  amountCop: number;
  externalRef: string;
  idempotencyKey: string;                // UUID v4 generado por Reviá
  notes?: string;
};

export type CreatedHeySetterBooking = {
  ok: true;
  id: string;
  externalRef: string;
  paymentLink: string;
  paymentDueAt: string;                  // ISO
  status: "pending_payment";
  appointment: {
    date: string;
    time: string;
    appointmentTypeId: string;
  };
  notifications: {
    pendingSent: {
      ok: boolean;
      messageId: string | null;
      mode: "live" | "test" | null;
    };
    scheduled: { kind: string; sendAt: string }[];
  };
  warnings: string[];
};

export type FetchedHeySetterBooking = {
  ok: true;
  id: string;
  externalRef: string;
  status: "pending_payment" | "paid" | "cancelled";
  paymentLink: string | null;
  paymentDueAt: string;
  paymentConfirmedAt: string | null;
  cancelledAt: string | null;
  appointment: {
    date: string;
    time: string;
    appointmentTypeId: string;
  };
};

export type CreateResult = CreatedHeySetterBooking | HeySetterError;
export type GetResult = FetchedHeySetterBooking | HeySetterError;

// ─── Mapeo categoría → appointment_type_id ─────────────────────────────────

/**
 * Devuelve el `appointment_type_id` que HeySetter espera para esta categoría.
 *
 * Mapeo confirmado (ADR 0010 adenda 2026-06-02):
 *   rostro + cuerpo → ESTETICA  (Dra. Bibiana, ambos rostro y corporal)
 *   capilar         → CAPILAR
 *
 * Devuelve null si la env de esa categoría no está configurada (fail-soft:
 * el route handler degrada al fallback de WhatsApp).
 */
export function heySetterApptTypeFor(category: BookingCategory): string | null {
  const envName =
    category === "capilar" ? APPT_CAPILAR_ENV : APPT_ESTETICA_ENV;
  const v = process.env[envName];
  return v && v.length > 0 ? v : null;
}

/** ¿HeySetter está configurado lo suficiente para arrancar una reserva? */
export function isHeySetterConfigured(category: BookingCategory): boolean {
  const hasCreds =
    Boolean(process.env[KEY_ENV]) && Boolean(process.env[AGENT_ID_ENV]);
  const hasApptType = heySetterApptTypeFor(category) !== null;
  return hasCreds && hasApptType;
}

// ─── Helpers internos ──────────────────────────────────────────────────────

function getBase(): string {
  return process.env[BASE_ENV] ?? "https://setterapi-production.up.railway.app";
}

function getKey(): string | null {
  const v = process.env[KEY_ENV];
  return v && v.length > 0 ? v : null;
}

function getAgentId(): string | null {
  const v = process.env[AGENT_ID_ENV];
  return v && v.length > 0 ? v : null;
}

function notConfigured(reason: string): HeySetterError {
  return {
    ok: false,
    code: "not_configured",
    message: `HeySetter no configurado: ${reason}.`,
    status: 0,
  };
}

function transportError(err: unknown): HeySetterError {
  const detail = err instanceof Error ? err.message : String(err);
  return {
    ok: false,
    code: "transport_error",
    message: `No se pudo contactar a HeySetter: ${detail}.`,
    status: 0,
  };
}

/**
 * Mapea HTTP status + body → HeySetterError canónico.
 * Acepta los códigos que HeySetter documenta; los desconocidos caen en
 * "unknown" pero con `status` y `message` preservados.
 */
function mapHttpError(
  status: number,
  body: Record<string, unknown> | null,
  retryAfterHeader: string | null,
  traceIdHeader: string | null,
): HeySetterError {
  // Shape real observado en smoke test: { error: "internal", code: "<machine>", field: "..." }.
  // El campo `code` es el machine-readable; `error` es la categoría HTTP. Preferimos `code`.
  const rawCode =
    body && typeof body.code === "string"
      ? body.code
      : body && typeof body.error === "string"
        ? body.error
        : "unknown";

  const known: Record<string, HeySetterErrorCode> = {
    idempotency_key_required: "idempotency_key_required",
    invalid_phone: "invalid_phone",
    unsupported_currency: "unsupported_currency",
    invalid_due_in_hours: "invalid_due_in_hours",
    key_missing: "key_missing",
    key_invalid: "key_invalid",
    key_revoked: "key_revoked",
    insufficient_scope: "insufficient_scope",
    slot_unavailable: "slot_unavailable",
    idempotency_key_conflict: "idempotency_key_conflict",
    payment_provider_not_configured: "payment_provider_not_configured",
    rate_limited: "rate_limited",
    payment_provider_unavailable: "payment_provider_unavailable",
    internal_error: "internal_error",
    // Observado en sandbox: failure interno generando la conversacion mock de WhatsApp.
    synthetic_conversation_failed: "internal_error",
  };
  const code: HeySetterErrorCode = known[rawCode] ?? "unknown";

  // HeySetter manda el trace en el header X-Trace-Id (smoke 2026-06-02). Fallback al body.
  const traceId =
    traceIdHeader && traceIdHeader.length > 0
      ? traceIdHeader
      : body && typeof body.trace_id === "string"
        ? body.trace_id
        : undefined;
  const retryAfterSec =
    retryAfterHeader && !Number.isNaN(Number(retryAfterHeader))
      ? Number(retryAfterHeader)
      : undefined;

  const message =
    body && typeof body.message === "string" && body.message.length > 0
      ? body.message
      : `HeySetter respondió ${status} (${rawCode}).`;

  return { ok: false, code, message, status, retryAfterSec, traceId };
}

async function safeJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function pickStr(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function pickObj(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

function pickArr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

/** Parser defensivo del shape de `booking` documentado por HeySetter. */
function parseAppointment(v: unknown): { date: string; time: string; appointmentTypeId: string } | null {
  const o = pickObj(v);
  if (!o) return null;
  const date = pickStr(o.date);
  const time = pickStr(o.time);
  const appointmentTypeId = pickStr(o.appointment_type_id);
  if (!date || !time || !appointmentTypeId) return null;
  return { date, time, appointmentTypeId };
}

// ─── POST /api/v1/bookings ─────────────────────────────────────────────────

export async function createHeySetterBooking(
  input: CreateHeySetterBookingInput,
): Promise<CreateResult> {
  const key = getKey();
  const agentId = getAgentId();
  if (!key) return notConfigured("falta HEYSETTER_API_KEY");
  if (!agentId) return notConfigured("falta HEYSETTER_AGENT_ID");
  const apptTypeId = heySetterApptTypeFor(input.category);
  if (!apptTypeId) {
    return notConfigured(
      `falta appointment_type para categoría "${input.category}"`,
    );
  }

  const body = {
    agent_id: agentId,
    appointment_type_id: apptTypeId,
    customer: input.customer,
    slot: input.slot,
    payment: {
      required: true,
      // COP no tiene centavos: la unidad mínima es el peso entero.
      // Stripe, Bold y HeySetter esperan el monto en pesos enteros para
      // currency=COP, no en "centavos". Para USD/EUR sí habría que × 100.
      amount_cents: Math.round(input.amountCop),
      currency: PAYMENT_CURRENCY,
      due_in_hours: PAYMENT_DUE_HOURS,
      provider: PAYMENT_PROVIDER,
    },
    source: SOURCE,
    external_ref: input.externalRef,
    ...(input.notes ? { notes: input.notes } : {}),
  };

  let res: Response;
  try {
    res = await fetch(`${getBase()}${PATH_CREATE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Idempotency-Key": input.idempotencyKey,
        "Content-Type": "application/json",
        // Skip del slot-check interno de HeySetter (su mirror de external_blocks
        // pollea Google cada ≤5min; nuestro freeBusy es más fresco). Confirmado
        // con HeySetter 2026-06-03: universal, audit trail en integration_logs
        // como `api_slot_check_bypassed`.
        "X-Bypass-Slot-Check": "true",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch (err) {
    return transportError(err);
  }

  const payload = await safeJson(res);

  if (!res.ok) {
    return mapHttpError(res.status, payload, res.headers.get("Retry-After"), res.headers.get("X-Trace-Id"));
  }
  if (!payload) {
    return {
      ok: false,
      code: "unknown",
      status: res.status,
      message: "HeySetter respondió 2xx sin body parseable.",
    };
  }

  // Shape documentado:
  // { ok:true, booking:{...}, notifications:{ pending_sent:{...}, scheduled:[...] }, warnings:[] }
  const booking = pickObj(payload.booking);
  if (!booking) {
    return {
      ok: false,
      code: "unknown",
      status: res.status,
      message: "HeySetter respondió sin `booking` en el body.",
    };
  }

  const id = pickStr(booking.id);
  const externalRef = pickStr(booking.external_ref);
  const paymentLink = pickStr(booking.payment_link);
  const paymentDueAt = pickStr(booking.payment_due_at);
  const status = pickStr(booking.status);
  const appointment = parseAppointment(booking.appointment);

  if (!id || !externalRef || !paymentLink || !paymentDueAt || status !== "pending_payment" || !appointment) {
    return {
      ok: false,
      code: "unknown",
      status: res.status,
      message: "HeySetter devolvió un shape de `booking` inesperado.",
    };
  }

  const notif = pickObj(payload.notifications) ?? {};
  const pendingSentRaw = pickObj(notif.pending_sent) ?? {};
  const modeRaw = pendingSentRaw.mode;
  const mode: "live" | "test" | null =
    modeRaw === "live" || modeRaw === "test" ? modeRaw : null;
  const pendingSent = {
    ok: pendingSentRaw.ok === true,
    messageId: pickStr(pendingSentRaw.message_id),
    mode,
  };

  const scheduled = pickArr(notif.scheduled)
    .map((it) => {
      const o = pickObj(it);
      if (!o) return null;
      const kind = pickStr(o.kind);
      const sendAt = pickStr(o.send_at);
      return kind && sendAt ? { kind, sendAt } : null;
    })
    .filter((x): x is { kind: string; sendAt: string } => x !== null);

  const warnings = pickArr(payload.warnings)
    .map((w) => pickStr(w))
    .filter((w): w is string => w !== null);

  return {
    ok: true,
    id,
    externalRef,
    paymentLink,
    paymentDueAt,
    status: "pending_payment",
    appointment,
    notifications: { pendingSent, scheduled },
    warnings,
  };
}

// ─── GET /api/v1/bookings/<id> ─────────────────────────────────────────────

export async function getHeySetterBooking(id: string): Promise<GetResult> {
  const key = getKey();
  if (!key) return notConfigured("falta HEYSETTER_API_KEY");

  let res: Response;
  try {
    res = await fetch(`${getBase()}${PATH_GET(id)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
  } catch (err) {
    return transportError(err);
  }

  const payload = await safeJson(res);

  if (!res.ok) {
    return mapHttpError(res.status, payload, res.headers.get("Retry-After"), res.headers.get("X-Trace-Id"));
  }
  if (!payload) {
    return {
      ok: false,
      code: "unknown",
      status: res.status,
      message: "HeySetter respondió 2xx sin body parseable.",
    };
  }

  const booking = pickObj(payload.booking);
  if (!booking) {
    return {
      ok: false,
      code: "unknown",
      status: res.status,
      message: "HeySetter GET respondió sin `booking`.",
    };
  }

  const bid = pickStr(booking.id);
  const externalRef = pickStr(booking.external_ref);
  const rawStatus = pickStr(booking.status);
  const status =
    rawStatus === "pending_payment" || rawStatus === "paid" || rawStatus === "cancelled"
      ? rawStatus
      : null;
  const paymentDueAt = pickStr(booking.payment_due_at);
  const appointment = parseAppointment(booking.appointment);

  if (!bid || !externalRef || !status || !paymentDueAt || !appointment) {
    return {
      ok: false,
      code: "unknown",
      status: res.status,
      message: "HeySetter GET devolvió un shape de `booking` inesperado.",
    };
  }

  return {
    ok: true,
    id: bid,
    externalRef,
    status,
    paymentLink: pickStr(booking.payment_link),
    paymentDueAt,
    paymentConfirmedAt: pickStr(booking.payment_confirmed_at),
    cancelledAt: pickStr(booking.cancelled_at),
    appointment,
  };
}
