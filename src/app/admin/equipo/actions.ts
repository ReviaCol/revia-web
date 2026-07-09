"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "./types";

/**
 * Server actions de equipo (CMS Fase 2, ADR 0016).
 * `specialties` = visible en /nosotros#equipo. `team_members` = CMS oculto (Fase 3).
 * updateTag("site-content") tras cada mutación.
 */

type Supa = Awaited<ReturnType<typeof createClient>>;

async function authed(): Promise<Supa | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

function slugify(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "item"
  );
}

async function nextOrder(supabase: Supa, table: "specialties" | "team_members"): Promise<number> {
  const { data } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ sort_order: number }>();
  return (data?.sort_order ?? -1) + 1;
}

/* ── Especialidades ───────────────────────────────────────────────────── */

export async function createSpecialty(name: string): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const n = name.trim();
  if (!n) return { ok: false, error: "El nombre es obligatorio." };
  const sort_order = await nextOrder(supabase, "specialties");
  const { error } = await supabase.from("specialties").insert({ name: n, sort_order });
  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true };
}

export async function updateSpecialty(id: string, name: string): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const n = name.trim();
  if (!n) return { ok: false, error: "El nombre es obligatorio." };
  const { error } = await supabase.from("specialties").update({ name: n }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true };
}

export async function setSpecialtyVisible(id: string, visible: boolean): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const { error } = await supabase.from("specialties").update({ visible }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true };
}

export async function deleteSpecialty(id: string): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const { error } = await supabase.from("specialties").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true };
}

export async function setSpecialtyOrder(orderedIds: string[]): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase.from("specialties").update({ sort_order: i }).eq("id", orderedIds[i]);
    if (error) return { ok: false, error: error.message };
  }
  updateTag("site-content");
  return { ok: true };
}

/* ── Médicos ──────────────────────────────────────────────────────────── */

export async function createMember(input: {
  name: string;
  specialty: string;
  credentials: string[];
  quote: string;
  photoUrl: string;
}): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const name = input.name.trim();
  if (!name) return { ok: false, error: "El nombre es obligatorio." };

  let id = slugify(name);
  for (let i = 2; i < 50; i++) {
    const { data } = await supabase.from("team_members").select("id").eq("id", id).maybeSingle();
    if (!data) break;
    id = `${slugify(name)}-${i}`;
  }
  const sort_order = await nextOrder(supabase, "team_members");
  const { error } = await supabase.from("team_members").insert({
    id,
    name,
    specialty: input.specialty.trim(),
    credentials: input.credentials,
    quote: input.quote.trim() || null,
    photo_url: input.photoUrl.trim() || null,
    sort_order,
  });
  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true, id };
}

export async function updateMember(
  id: string,
  patch: { name: string; specialty: string; credentials: string[]; quote: string; photoUrl: string },
): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const name = patch.name.trim();
  if (!name) return { ok: false, error: "El nombre es obligatorio." };
  const { error } = await supabase
    .from("team_members")
    .update({
      name,
      specialty: patch.specialty.trim(),
      credentials: patch.credentials,
      quote: patch.quote.trim() || null,
      photo_url: patch.photoUrl.trim() || null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true };
}

export async function setMemberVisible(id: string, visible: boolean): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const { error } = await supabase.from("team_members").update({ visible }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true };
}

export async function deleteMember(id: string): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true };
}
