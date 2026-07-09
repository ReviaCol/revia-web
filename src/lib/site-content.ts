import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { CONTACT } from "@/lib/contact";

/**
 * site-content.ts — read-layer de los "singletons" editables (CMS Fase 2).
 * ADR: 03-decisions/0015-cms-fase2-contacto-horarios.md
 *
 * getSiteContact() y getSiteHours() leen de Supabase (site_contact / site_hours)
 * con la ANON key dentro de unstable_cache con tag "site-content". Al guardar en
 * /admin/contacto se llama updateTag("site-content") → update instantáneo sin
 * redeploy, manteniendo render estático.
 *
 * Fallback seguro: si la consulta falla o viene vacía (tablas sin migrar, DB
 * caída, env sin configurar) cae a los valores estáticos de lib/contact.ts y a un
 * horario espejo de BUSINESS_HOURS. El sitio NO se rompe entre deploy y migración.
 *
 * getSiteContact() devuelve la MISMA forma que la const CONTACT (drop-in) más
 * campos de dirección desglosados, para que el rewire de las superficies sea
 * mínimo.
 */

const TAG = "site-content";

/* ── Contacto ─────────────────────────────────────────────────────────── */

export type SiteContact = {
  whatsappNumber: string;
  whatsappUrl: string;
  whatsappDisplay: string;
  telHref: string;
  telDisplay: string;
  email: string;
  address: string;
  streetAddress: string;
  addressLocality: string;
  instagramHandle: string;
  instagramUrl: string;
  mapsUrl: string;
};

type ContactRow = {
  phone: string;
  whatsapp: string;
  email: string;
  street_address: string;
  address_locality: string;
  instagram_url: string | null;
  maps_url: string | null;
};

const digits = (s: string) => s.replace(/\D/g, "");

/** "@handle" a partir del último segmento de la URL de Instagram. */
function instagramHandleFrom(url: string | null | undefined): string {
  if (!url) return CONTACT.instagramHandle;
  const seg = url.replace(/\/+$/, "").split("/").pop() ?? "";
  return seg ? `@${seg}` : CONTACT.instagramHandle;
}

function mapsUrlFrom(row: ContactRow): string {
  if (row.maps_url && row.maps_url.trim()) return row.maps_url.trim();
  const q = encodeURIComponent(`${row.street_address}, ${row.address_locality}, Colombia`);
  return `https://maps.google.com/?q=${q}`;
}

function contactFromRow(row: ContactRow): SiteContact {
  const wa = digits(row.whatsapp);
  return {
    whatsappNumber: wa,
    whatsappUrl: `https://wa.me/${wa}`,
    whatsappDisplay: row.whatsapp,
    telHref: `tel:+${digits(row.phone)}`,
    telDisplay: row.phone,
    email: row.email,
    address: `${row.street_address}, ${row.address_locality}`,
    streetAddress: row.street_address,
    addressLocality: row.address_locality,
    instagramHandle: instagramHandleFrom(row.instagram_url),
    instagramUrl: row.instagram_url ?? CONTACT.instagramUrl,
    mapsUrl: mapsUrlFrom(row),
  };
}

/** Fallback estático desde lib/contact.ts (valores reales de operación). */
const FALLBACK_CONTACT: SiteContact = {
  whatsappNumber: CONTACT.whatsappNumber,
  whatsappUrl: CONTACT.whatsappUrl,
  whatsappDisplay: CONTACT.whatsappDisplay,
  telHref: CONTACT.telHref,
  telDisplay: CONTACT.telDisplay,
  email: CONTACT.email,
  address: CONTACT.address,
  streetAddress: CONTACT.address.split(",")[0].trim(),
  addressLocality: (CONTACT.address.split(",")[1] ?? "Bogotá").trim(),
  instagramHandle: CONTACT.instagramHandle,
  instagramUrl: CONTACT.instagramUrl,
  mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(CONTACT.address + ", Colombia")}`,
};

/* ── Horarios ─────────────────────────────────────────────────────────── */

export type SiteHour = {
  weekday: number; // 0=Dom … 6=Sáb
  closed: boolean;
  openMin: number | null;
  closeMin: number | null;
};

type HourRow = {
  weekday: number;
  closed: boolean;
  open_min: number | null;
  close_min: number | null;
};

/** Fallback espejo de BUSINESS_HOURS (booking.ts): Lun–Vie 7–19, Sáb 7–14. */
const FALLBACK_HOURS: SiteHour[] = [
  { weekday: 0, closed: true, openMin: null, closeMin: null },
  { weekday: 1, closed: false, openMin: 420, closeMin: 1140 },
  { weekday: 2, closed: false, openMin: 420, closeMin: 1140 },
  { weekday: 3, closed: false, openMin: 420, closeMin: 1140 },
  { weekday: 4, closed: false, openMin: 420, closeMin: 1140 },
  { weekday: 5, closed: false, openMin: 420, closeMin: 1140 },
  { weekday: 6, closed: false, openMin: 420, closeMin: 840 },
];

export const WEEKDAY_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"] as const;
export const WEEKDAY_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] as const;

/** 420 → "7:00", 1140 → "19:00". */
export function minToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}:${m.toString().padStart(2, "0")}`;
}

/** "7:00 – 19:00" o "Cerrado". */
export function hourRangeLabel(h: SiteHour): string {
  if (h.closed || h.openMin == null || h.closeMin == null) return "Cerrado";
  return `${minToLabel(h.openMin)} – ${minToLabel(h.closeMin)}`;
}

/**
 * Agrupa días consecutivos con el mismo horario en líneas compactas.
 * P.ej. [{Lun–Vie, "7:00 – 19:00"}, {Sáb, "7:00 – 14:00"}, {Dom, "Cerrado"}].
 * Orden semana-humano: Lunes → Domingo.
 */
export function groupedHours(hours: SiteHour[]): { label: string; value: string }[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const byDay = new Map(hours.map((h) => [h.weekday, h]));
  const seq = order.map((wd) => byDay.get(wd)).filter((h): h is SiteHour => !!h);

  const groups: { label: string; value: string }[] = [];
  let i = 0;
  while (i < seq.length) {
    const value = hourRangeLabel(seq[i]);
    let j = i;
    while (j + 1 < seq.length && hourRangeLabel(seq[j + 1]) === value) j++;
    const first = WEEKDAY_SHORT[seq[i].weekday];
    const last = WEEKDAY_SHORT[seq[j].weekday];
    groups.push({ label: i === j ? first : `${first}–${last}`, value });
    i = j + 1;
  }
  return groups;
}

/* ── Cliente + fetchers ───────────────────────────────────────────────── */

function publicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

async function fetchContactFromDb(): Promise<SiteContact | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = publicClient();
  const { data, error } = await supabase
    .from("site_contact")
    .select("phone,whatsapp,email,street_address,address_locality,instagram_url,maps_url")
    .eq("id", "default")
    .maybeSingle<ContactRow>();

  if (error || !data) return null;
  return contactFromRow(data);
}

async function fetchHoursFromDb(): Promise<SiteHour[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = publicClient();
  const { data, error } = await supabase
    .from("site_hours")
    .select("weekday,closed,open_min,close_min")
    .order("weekday", { ascending: true });

  if (error || !data || data.length === 0) return null;
  return (data as HourRow[]).map((r) => ({
    weekday: r.weekday,
    closed: r.closed,
    openMin: r.open_min,
    closeMin: r.close_min,
  }));
}

/** Cacheados: lanzan si la DB falla/está vacía, para NO cachear el fallback. */
const getCachedContact = unstable_cache(
  async (): Promise<SiteContact> => {
    const fromDb = await fetchContactFromDb();
    if (!fromDb) throw new Error("site-contact: DB read failed or empty");
    return fromDb;
  },
  ["revia-site-contact"],
  { tags: [TAG] },
);

const getCachedHours = unstable_cache(
  async (): Promise<SiteHour[]> => {
    const fromDb = await fetchHoursFromDb();
    if (!fromDb) throw new Error("site-hours: DB read failed or empty");
    return fromDb;
  },
  ["revia-site-hours"],
  { tags: [TAG] },
);

/** Nunca lanzan: caen al fallback estático. */
export async function getSiteContact(): Promise<SiteContact> {
  try {
    return await getCachedContact();
  } catch {
    return FALLBACK_CONTACT;
  }
}

export async function getSiteHours(): Promise<SiteHour[]> {
  try {
    return await getCachedHours();
  } catch {
    return FALLBACK_HOURS;
  }
}

/** wa.me con mensaje pre-relleno (equivalente a whatsappWithText de lib/contact). */
export function whatsappWithText(contact: SiteContact, message: string): string {
  return `${contact.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
