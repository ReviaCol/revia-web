"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, ContactPatch, HourRow } from "./types";

/**
 * Server actions de contacto/horarios (CMS Fase 2, ADR 0015).
 *
 * Escriben con el cliente cookie-based (RLS rol authenticated). Cada mutación
 * exitosa llama updateTag("site-content") → las superficies públicas (home,
 * /contacto, footer) que leen vía getSiteContact/getSiteHours dentro de
 * unstable_cache con tag "site-content" se regeneran al instante, sin redeploy.
 */

type Supa = Awaited<ReturnType<typeof createClient>>;

async function authed(): Promise<Supa | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

const clean = (s: string) => s.trim();

export async function updateSiteContact(patch: ContactPatch): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };

  const phone = clean(patch.phone);
  const whatsapp = clean(patch.whatsapp);
  const email = clean(patch.email);
  const street = clean(patch.street_address);
  const locality = clean(patch.address_locality);

  if (!phone) return { ok: false, error: "El teléfono de llamadas es obligatorio." };
  if (!whatsapp) return { ok: false, error: "El WhatsApp es obligatorio." };
  if (!email || !email.includes("@")) return { ok: false, error: "Email inválido." };
  if (!street) return { ok: false, error: "La dirección es obligatoria." };
  if (!locality) return { ok: false, error: "La ciudad es obligatoria." };

  const { error } = await supabase
    .from("site_contact")
    .update({
      phone,
      whatsapp,
      email,
      street_address: street,
      address_locality: locality,
      address_region: clean(patch.address_region) || "Bogotá D.C.",
      address_country: clean(patch.address_country) || "CO",
      instagram_url: clean(patch.instagram_url) || null,
      maps_url: clean(patch.maps_url) || null,
    })
    .eq("id", "default");

  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true };
}

export async function updateSiteHours(rows: HourRow[]): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };

  for (const r of rows) {
    if (r.weekday < 0 || r.weekday > 6) return { ok: false, error: "Día inválido." };
    // Coherencia: el check de la tabla exige open<close cuando no está cerrado.
    if (!r.closed) {
      if (r.open_min == null || r.close_min == null) {
        return { ok: false, error: "Falta hora de apertura o cierre en un día abierto." };
      }
      if (r.open_min >= r.close_min) {
        return { ok: false, error: "La apertura debe ser antes del cierre." };
      }
    }
    const { error } = await supabase
      .from("site_hours")
      .update({
        closed: r.closed,
        open_min: r.closed ? null : r.open_min,
        close_min: r.closed ? null : r.close_min,
      })
      .eq("weekday", r.weekday);
    if (error) return { ok: false, error: error.message };
  }

  updateTag("site-content");
  return { ok: true };
}
