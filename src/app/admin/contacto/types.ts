/**
 * Tipos del admin de contacto/horarios (CMS Fase 2, ADR 0015).
 * Filas tal cual en Supabase (snake_case).
 */

export type ContactRow = {
  id: string;
  phone: string;
  whatsapp: string;
  email: string;
  street_address: string;
  address_locality: string;
  address_region: string;
  address_country: string;
  instagram_url: string | null;
  maps_url: string | null;
};

export type HourRow = {
  weekday: number; // 0=Dom … 6=Sáb
  closed: boolean;
  open_min: number | null;
  close_min: number | null;
};

export type ContactPatch = {
  phone: string;
  whatsapp: string;
  email: string;
  street_address: string;
  address_locality: string;
  address_region: string;
  address_country: string;
  instagram_url: string;
  maps_url: string;
};

export type ActionResult = { ok: boolean; error?: string };

/** "07:00" → 420. Devuelve null si vacío/ inválido. */
export function timeToMin(value: string): number | null {
  const m = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** 420 → "07:00" (para <input type="time">). */
export function minToTime(min: number | null): string {
  if (min == null) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
