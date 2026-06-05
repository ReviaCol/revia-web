import type { BookingCategory } from "./booking";

/**
 * booking-store.ts — wrappers tipados sobre la tabla `bookings` (Supabase del
 * cliente) vía la REST de PostgREST con `SUPABASE_SERVICE_ROLE_KEY`.
 *
 * ADR: 03-decisions/0010-booking-pago-bold-recordatorios.md (adenda 2026-06-02)
 * Schema: supabase/migrations/0003_bookings.sql
 *
 * Mismo patrón que `notify.ts` / `/api/contact` (sin SDK, sin npm install).
 * SERVICE_ROLE bypassa RLS; este módulo es server-only — NO importarlo desde
 * componentes cliente.
 *
 * Fuente de verdad del estado = HeySetter. `status_mirror` se sincroniza vía
 * polling (cron + client-poll). Las transiciones a `paid` / `cancelled` usan
 * UPDATE condicional (`WHERE status_mirror = 'pending_payment'`) para resolver
 * races entre el cron y el client-poll sin transacciones.
 */

import type { BookingEmailKind } from "./booking-email-kinds";
export type { BookingEmailKind } from "./booking-email-kinds";

export type BookingStatusMirror = "pending_payment" | "paid" | "cancelled";

export type Booking = {
  id: string;
  token: string;
  heysetter_booking_id: string | null;
  idempotency_key: string;
  external_ref: string;
  category: BookingCategory;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  date: string;              // YYYY-MM-DD (zona Bogotá)
  time: string;              // HH:MM
  status_mirror: BookingStatusMirror;
  calendar_event_id: string | null;
  payment_link: string | null;
  amount_cop: number;
  email_states_sent: BookingEmailKind[];
  created_at: string;
  expires_at: string;
  paid_at: string | null;
  cancelled_at: string | null;
  last_polled_at: string | null;
};

export type CreateBookingInput = {
  token: string;
  idempotency_key: string;
  external_ref: string;
  category: BookingCategory;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  date: string;
  time: string;
  amount_cop: number;
  expires_at: string;        // ISO timestamptz
};

// ─── Cliente PostgREST ──────────────────────────────────────────────────────

type SupaCfg = { url: string; serviceKey: string };

function loadCfg(): SupaCfg | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return { url, serviceKey };
}

function mustCfg(): SupaCfg {
  const c = loadCfg();
  if (!c) {
    throw new Error(
      "Supabase no configurado (faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY).",
    );
  }
  return c;
}

function baseHeaders(c: SupaCfg, prefer?: string): Record<string, string> {
  const h: Record<string, string> = {
    apikey: c.serviceKey,
    Authorization: `Bearer ${c.serviceKey}`,
    "Content-Type": "application/json",
  };
  if (prefer) h.Prefer = prefer;
  return h;
}

async function expectOk(res: Response, op: string): Promise<void> {
  if (res.ok) return;
  const detail = await res.text().catch(() => "");
  throw new Error(`${op} falló (${res.status}): ${detail}`);
}

/** ¿Supabase del cliente está configurado? Útil para fail-soft en handlers. */
export function isBookingStoreConfigured(): boolean {
  return loadCfg() !== null;
}

// ─── CREATE ─────────────────────────────────────────────────────────────────

/**
 * Inserta un booking nuevo. Devuelve la fila persistida (incluye `id` UUID).
 *
 * Errores propagados:
 *  - 409 si `token`, `idempotency_key` o `heysetter_booking_id` colisionan
 *    (UNIQUE constraint). El caller decide si reintenta con un key nuevo.
 */
export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const c = mustCfg();
  const res = await fetch(`${c.url}/rest/v1/bookings`, {
    method: "POST",
    headers: baseHeaders(c, "return=representation"),
    body: JSON.stringify(input),
    cache: "no-store",
  });
  await expectOk(res, "createBooking");
  const rows = (await res.json()) as Booking[];
  if (rows.length === 0) {
    throw new Error("createBooking: Supabase no devolvió la fila insertada.");
  }
  return rows[0];
}

// ─── READ ───────────────────────────────────────────────────────────────────

async function selectOne(c: SupaCfg, filter: string, op: string): Promise<Booking | null> {
  const res = await fetch(`${c.url}/rest/v1/bookings?${filter}&limit=1`, {
    method: "GET",
    headers: baseHeaders(c),
    cache: "no-store",
  });
  await expectOk(res, op);
  const rows = (await res.json()) as Booking[];
  return rows[0] ?? null;
}

export async function getBookingByToken(token: string): Promise<Booking | null> {
  return selectOne(mustCfg(), `token=eq.${encodeURIComponent(token)}`, "getBookingByToken");
}

export async function getBookingByHeySetterId(id: string): Promise<Booking | null> {
  return selectOne(
    mustCfg(),
    `heysetter_booking_id=eq.${encodeURIComponent(id)}`,
    "getBookingByHeySetterId",
  );
}

// ─── UPDATE (no condicional) ────────────────────────────────────────────────

async function patchById(
  c: SupaCfg,
  id: string,
  body: Record<string, unknown>,
  op: string,
): Promise<void> {
  const res = await fetch(
    `${c.url}/rest/v1/bookings?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: baseHeaders(c, "return=minimal"),
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  await expectOk(res, op);
}

/** Persiste los punteros que devuelve HeySetter tras el POST. */
export async function setHeySetterRefs(
  id: string,
  heysetter_booking_id: string,
  payment_link: string,
): Promise<void> {
  await patchById(
    mustCfg(),
    id,
    { heysetter_booking_id, payment_link },
    "setHeySetterRefs",
  );
}

/** Guarda el id del evento de Google Calendar tras crearlo. */
export async function setCalendarEventId(
  id: string,
  calendar_event_id: string,
): Promise<void> {
  await patchById(mustCfg(), id, { calendar_event_id }, "setCalendarEventId");
}

/** Marca `last_polled_at` ahora (usado por el cron en cada iteración). */
export async function markPolledNow(id: string): Promise<void> {
  await patchById(
    mustCfg(),
    id,
    { last_polled_at: new Date().toISOString() },
    "markPolledNow",
  );
}

// ─── UPDATE condicional (resuelve races) ────────────────────────────────────

/**
 * Transición condicional `pending_payment → paid` o `pending_payment → cancelled`.
 *
 * UPDATE filtrado por `status_mirror = 'pending_payment'`: solo aplica si el
 * registro sigue en pending. Devuelve `true` si la fila transicionó, `false`
 * si ya estaba en otro estado (no-op idempotente). Esto cubre la race entre
 * el cron y el client-poll: el primero que llega gana, el segundo es no-op.
 */
export async function transitionBookingStatus(
  id: string,
  to: "paid" | "cancelled",
  atIso: string,
): Promise<boolean> {
  const c = mustCfg();
  const filter =
    `id=eq.${encodeURIComponent(id)}` +
    `&status_mirror=eq.pending_payment`;
  const body: Record<string, string> =
    to === "paid"
      ? { status_mirror: "paid", paid_at: atIso }
      : { status_mirror: "cancelled", cancelled_at: atIso };

  const res = await fetch(`${c.url}/rest/v1/bookings?${filter}`, {
    method: "PATCH",
    headers: baseHeaders(c, "return=representation"),
    body: JSON.stringify(body),
    cache: "no-store",
  });
  await expectOk(res, "transitionBookingStatus");
  const rows = (await res.json()) as Booking[];
  return rows.length > 0;
}

/**
 * Registra que se envió el email de un `kind` para este booking. Idempotente
 * vía RPC `append_booking_email` (solo agrega si no estaba). Llamar SIEMPRE
 * después de un `send*` exitoso para evitar duplicados en reentradas.
 */
export async function recordEmailSent(
  id: string,
  kind: BookingEmailKind,
): Promise<void> {
  const c = mustCfg();
  const res = await fetch(`${c.url}/rest/v1/rpc/append_booking_email`, {
    method: "POST",
    headers: baseHeaders(c),
    body: JSON.stringify({ p_id: id, p_kind: kind }),
    cache: "no-store",
  });
  await expectOk(res, "recordEmailSent");
}

// ─── LIST (cron) ────────────────────────────────────────────────────────────

/**
 * Lista bookings `pending_payment` que necesitan polling.
 * Filtros:
 *  - status_mirror = 'pending_payment'
 *  - last_polled_at IS NULL  OR  last_polled_at < now - staleMs
 * Orden: last_polled_at ASC (los más viejos primero), nulls primero.
 */
export async function listPendingForPoll(opts: {
  limit?: number;
  staleMs?: number;
} = {}): Promise<Booking[]> {
  const c = mustCfg();
  const limit = opts.limit ?? 50;
  const staleMs = opts.staleMs ?? 5 * 60_000;
  const staleCutoff = new Date(Date.now() - staleMs).toISOString();

  // PostgREST: `or=(cond1,cond2)` para alternativas; el resto AND implícito.
  const filter =
    `status_mirror=eq.pending_payment` +
    `&or=(last_polled_at.is.null,last_polled_at.lt.${encodeURIComponent(staleCutoff)})` +
    `&order=last_polled_at.asc.nullsfirst` +
    `&limit=${limit}`;

  const res = await fetch(`${c.url}/rest/v1/bookings?${filter}`, {
    method: "GET",
    headers: baseHeaders(c),
    cache: "no-store",
  });
  await expectOk(res, "listPendingForPoll");
  return (await res.json()) as Booking[];
}

/**
 * Borra una reserva por id. Usado por el route handler de /api/booking para
 * rollback cuando un paso posterior falla (Google event, HeySetter, etc.).
 */
export async function deleteBookingById(id: string): Promise<void> {
  const c = mustCfg();
  const res = await fetch(
    `${c.url}/rest/v1/bookings?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: baseHeaders(c, "return=minimal"),
      cache: "no-store",
    },
  );
  await expectOk(res, "deleteBookingById");
}
