"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Server actions del home editable (CMS Fase 2, ADR 0016).
 * updateTag("site-content") tras guardar → home público se regenera al instante.
 */

export type HomePatch = {
  hero_line1: string;
  hero_line2: string;
  hero_subtitle: string;
  manifesto_eyebrow: string;
  manifesto_line1: string;
  manifesto_line2: string;
};

export type ActionResult = { ok: boolean; error?: string };

export async function updateHomeContent(patch: HomePatch): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };

  const req = (v: string) => v.trim();
  if (!req(patch.hero_line1) || !req(patch.hero_line2)) {
    return { ok: false, error: "El titular del hero es obligatorio." };
  }
  if (!req(patch.hero_subtitle)) return { ok: false, error: "El subtítulo es obligatorio." };
  if (!req(patch.manifesto_line1) || !req(patch.manifesto_line2)) {
    return { ok: false, error: "El manifiesto es obligatorio." };
  }

  const { error } = await supabase
    .from("home_content")
    .update({
      hero_line1: req(patch.hero_line1),
      hero_line2: req(patch.hero_line2),
      hero_subtitle: req(patch.hero_subtitle),
      manifesto_eyebrow: req(patch.manifesto_eyebrow) || "Manifiesto",
      manifesto_line1: req(patch.manifesto_line1),
      manifesto_line2: req(patch.manifesto_line2),
    })
    .eq("id", "default");

  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true };
}
