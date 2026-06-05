/**
 * booking.ts — lógica pura del booking de Reviá (ADR 0009).
 *
 * Sin red ni dependencias: genera slots de un día hábil, los filtra contra los
 * intervalos ocupados de un calendario y valida fechas. Zona horaria
 * America/Bogotá = UTC−05:00 FIJO (Colombia no tiene horario de verano), por
 * eso no hace falta librería de timezones.
 *
 * Categoría de booking (user-facing) → calendario:
 *   rostro  → GOOGLE_CALENDAR_ID_BIBIANA  (Dra. Bibiana — facial + corporal)
 *   cuerpo  → GOOGLE_CALENDAR_ID_BIBIANA
 *   capilar → GOOGLE_CALENDAR_ID_CAPILAR  (calendario capilar)
 */

import type { BusyInterval } from "./google-calendar";

export const TIME_ZONE = "America/Bogota";
export const TZ_OFFSET = "-05:00";
/** Duración de cita en minutos. Slots en hora en punto (07:00, 08:00, …). */
export const SLOT_MINUTES = 60;
/** Horas mínimas de anticipación para reservar. */
export const LEAD_HOURS = 4;
/** Ventana máxima de reserva hacia adelante (días). */
export const MAX_DAYS_AHEAD = 30;

/** Horario de atención por día de semana (0=Dom … 6=Sáb). null = cerrado. */
export const BUSINESS_HOURS: Record<number, { start: number; end: number } | null> = {
  0: null, // Domingo
  1: { start: 7, end: 19 },
  2: { start: 7, end: 19 },
  3: { start: 7, end: 19 },
  4: { start: 7, end: 19 },
  5: { start: 7, end: 19 },
  6: { start: 7, end: 14 }, // Sábado
};

// ─── Categorías de booking ──────────────────────────────────────────────────

/** Categorías visibles en el widget. Determinan qué calendario se consulta. */
export type BookingCategory = "rostro" | "cuerpo" | "capilar";

export function isBookingCategory(v: unknown): v is BookingCategory {
  return v === "rostro" || v === "cuerpo" || v === "capilar";
}

/** Mapa categoría → nombre de la variable de entorno con el calendarId. */
const CATEGORY_ENV: Record<BookingCategory, string> = {
  rostro: "GOOGLE_CALENDAR_ID_BIBIANA",
  cuerpo: "GOOGLE_CALENDAR_ID_BIBIANA",
  capilar: "GOOGLE_CALENDAR_ID_CAPILAR",
};

/** Devuelve el calendarId configurado para esa categoría (o undefined). */
export function calendarIdFor(category: BookingCategory): string | undefined {
  const v = process.env[CATEGORY_ENV[category]];
  return v && v.length > 0 ? v : undefined;
}

/** Etiqueta humana de la categoría (para resúmenes/emails). */
export function categoryLabel(category: BookingCategory): string {
  if (category === "rostro") return "Rostro";
  if (category === "cuerpo") return "Cuerpo";
  return "Capilar";
}

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type Slot = { time: string; startISO: string; endISO: string };
export type BookableDay = {
  dateISO: string;
  weekdayShort: string;
  weekdayLong: string;
  dayNum: number;
  monthShort: string;
};

const WEEKDAY_LONG = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",
];
const WEEKDAY_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_SHORT = [
  "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic",
];

const pad2 = (n: number) => String(n).padStart(2, "0");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Día de la semana (0–6) de una fecha YYYY-MM-DD. */
export function weekdayOf(dateISO: string): number {
  return new Date(`${dateISO}T12:00:00Z`).getUTCDay();
}

/** Fecha de "hoy" en Bogotá (YYYY-MM-DD) dado el instante actual en ms. */
export function todayBogota(nowMs: number = Date.now()): string {
  const d = new Date(nowMs - 5 * 3600 * 1000);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

/** Suma `n` días a una fecha YYYY-MM-DD (devuelve YYYY-MM-DD). */
export function addDays(dateISO: string, n: number): string {
  const d = new Date(Date.parse(`${dateISO}T12:00:00Z`) + n * 86400000);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

function isoAt(dateISO: string, minutesFromMidnight: number): string {
  const h = Math.floor(minutesFromMidnight / 60);
  const m = minutesFromMidnight % 60;
  return `${dateISO}T${pad2(h)}:${pad2(m)}:00${TZ_OFFSET}`;
}

function describe(dateISO: string): BookableDay {
  const wd = weekdayOf(dateISO);
  const dayNum = Number(dateISO.slice(8, 10));
  const monthIdx = Number(dateISO.slice(5, 7)) - 1;
  return {
    dateISO,
    weekdayShort: WEEKDAY_SHORT[wd],
    weekdayLong: WEEKDAY_LONG[wd],
    dayNum,
    monthShort: MONTH_SHORT[monthIdx],
  };
}

/** ¿La fecha es un día de atención (no domingo/cerrado)? */
export function isBusinessDay(dateISO: string): boolean {
  return BUSINESS_HOURS[weekdayOf(dateISO)] != null;
}

/** Próximos `count` días hábiles desde hoy (para el selector de fecha). */
export function bookableDays(count = 14, nowMs: number = Date.now()): BookableDay[] {
  const start = todayBogota(nowMs);
  const out: BookableDay[] = [];
  for (let i = 0; i <= MAX_DAYS_AHEAD && out.length < count; i++) {
    const dateISO = addDays(start, i);
    if (isBusinessDay(dateISO)) out.push(describe(dateISO));
  }
  return out;
}

/** ¿La fecha es válida para reservar (formato, ventana y día hábil)? */
export function isValidBookingDate(dateISO: string, nowMs: number = Date.now()): boolean {
  if (!DATE_RE.test(dateISO)) return false;
  const today = todayBogota(nowMs);
  if (dateISO < today) return false;
  if (dateISO > addDays(today, MAX_DAYS_AHEAD)) return false;
  return isBusinessDay(dateISO);
}

/** Todos los slots del horario de atención de un día (sin filtrar ocupación). */
export function generateDaySlots(dateISO: string): Slot[] {
  const hours = BUSINESS_HOURS[weekdayOf(dateISO)];
  if (!hours) return [];
  const slots: Slot[] = [];
  const endMin = hours.end * 60;
  for (let m = hours.start * 60; m + SLOT_MINUTES <= endMin; m += SLOT_MINUTES) {
    slots.push({
      time: `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`,
      startISO: isoAt(dateISO, m),
      endISO: isoAt(dateISO, m + SLOT_MINUTES),
    });
  }
  return slots;
}

/**
 * Filtra los slots libres: descarta los que solapan algún intervalo ocupado y
 * los que empiezan antes de ahora + LEAD_HOURS.
 */
export function filterFreeSlots(
  slots: Slot[],
  busy: BusyInterval[],
  nowMs: number = Date.now(),
): Slot[] {
  const minStart = nowMs + LEAD_HOURS * 3600 * 1000;
  const busyMs = busy.map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));
  return slots.filter((s) => {
    const start = Date.parse(s.startISO);
    const end = Date.parse(s.endISO);
    if (start < minStart) return false;
    return !busyMs.some((b) => start < b.end && end > b.start);
  });
}

/** Día y hora legibles para emails/UI (es-CO). Ej.: "Lunes 26 de mayo, 9:00 a.m." */
export function humanizeSlot(dateISO: string, time: string): string {
  const d = describe(dateISO);
  const [hStr, mStr] = time.split(":");
  let h = Number(hStr);
  const ampm = h >= 12 ? "p.m." : "a.m.";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  const MONTH_LONG = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const monthIdx = Number(dateISO.slice(5, 7)) - 1;
  return `${d.weekdayLong} ${d.dayNum} de ${MONTH_LONG[monthIdx]}, ${h}:${mStr} ${ampm}`;
}
