"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, Palette } from "./types";

/**
 * Server actions del catálogo (CMS Fase 1, ADR 0014).
 *
 * Todas escriben con el cliente cookie-based (sesión del usuario) → pasan por RLS
 * (rol authenticated: puede escribir todo). Cada mutación exitosa llama
 * updateTag("catalog") (variante de revalidateTag para Server Actions en Next 16:
 * expiración inmediata + read-your-own-writes) para que las páginas públicas —que
 * leen vía getCatalog dentro de unstable_cache con tag "catalog"— se regeneren al
 * instante, sin redeploy.
 *
 * Defensa en profundidad: además del middleware, cada action verifica la sesión.
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
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Encuentra un id libre a partir de una base (base, base-2, base-3, …). */
async function freeId(
  supabase: Supa,
  table: "categories" | "treatments",
  base: string,
): Promise<string> {
  const root = base || "item";
  let candidate = root;
  let n = 2;
  // Hasta 50 intentos; suficiente para el volumen del catálogo.
  for (let i = 0; i < 50; i++) {
    const { data } = await supabase.from(table).select("id").eq("id", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${root}-${n++}`;
  }
  return `${root}-${Date.now().toString(36).slice(-4)}`;
}

async function nextSortOrder(
  supabase: Supa,
  table: "categories" | "treatments",
  categoryId?: string,
): Promise<number> {
  let query = supabase.from(table).select("sort_order").order("sort_order", { ascending: false }).limit(1);
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data } = await query.maybeSingle<{ sort_order: number }>();
  return (data?.sort_order ?? -1) + 1;
}

/* ── Categorías ───────────────────────────────────────────────────────── */

export async function createCategory(input: {
  name: string;
  palette: Palette;
  headline?: string;
}): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const name = input.name.trim();
  if (!name) return { ok: false, error: "El nombre es obligatorio." };

  const id = await freeId(supabase, "categories", slugify(name));
  const sort_order = await nextSortOrder(supabase, "categories");
  const { error } = await supabase.from("categories").insert({
    id,
    name,
    palette: input.palette,
    headline: input.headline?.trim() || null,
    sort_order,
  });
  if (error) return { ok: false, error: error.message };
  updateTag("catalog");
  return { ok: true, id };
}

export async function updateCategory(
  id: string,
  patch: { name: string; palette: Palette; headline?: string },
): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const name = patch.name.trim();
  if (!name) return { ok: false, error: "El nombre es obligatorio." };

  const { error } = await supabase
    .from("categories")
    .update({ name, palette: patch.palette, headline: patch.headline?.trim() || null })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("catalog");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  // ON DELETE CASCADE elimina los tratamientos de la categoría (schema 0004).
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("catalog");
  return { ok: true };
}

export async function setCategoryOrder(orderedIds: string[]): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase.from("categories").update({ sort_order: i }).eq("id", orderedIds[i]);
    if (error) return { ok: false, error: error.message };
  }
  updateTag("catalog");
  return { ok: true };
}

/* ── Tratamientos ─────────────────────────────────────────────────────── */

export async function createTreatment(input: {
  categoryId: string;
  name: string;
  summary: string;
  outcome?: string;
  bodyZones: string[];
  visible: boolean;
}): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const name = input.name.trim();
  if (!name) return { ok: false, error: "El nombre es obligatorio." };
  if (!input.categoryId) return { ok: false, error: "Falta la categoría." };

  const id = await freeId(supabase, "treatments", slugify(name));
  const sort_order = await nextSortOrder(supabase, "treatments", input.categoryId);
  const { error } = await supabase.from("treatments").insert({
    id,
    category_id: input.categoryId,
    name,
    summary: input.summary.trim(),
    outcome: input.outcome?.trim() || null,
    body_zones: input.bodyZones,
    visible: input.visible,
    sort_order,
  });
  if (error) return { ok: false, error: error.message };
  updateTag("catalog");
  return { ok: true, id };
}

export async function updateTreatment(
  id: string,
  patch: {
    categoryId: string;
    name: string;
    summary: string;
    outcome?: string;
    bodyZones: string[];
    visible: boolean;
  },
): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const name = patch.name.trim();
  if (!name) return { ok: false, error: "El nombre es obligatorio." };

  const { error } = await supabase
    .from("treatments")
    .update({
      category_id: patch.categoryId,
      name,
      summary: patch.summary.trim(),
      outcome: patch.outcome?.trim() || null,
      body_zones: patch.bodyZones,
      visible: patch.visible,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("catalog");
  return { ok: true };
}

export async function setTreatmentVisible(id: string, visible: boolean): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const { error } = await supabase.from("treatments").update({ visible }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("catalog");
  return { ok: true };
}

export async function deleteTreatment(id: string): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const { error } = await supabase.from("treatments").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("catalog");
  return { ok: true };
}

/** Reordena tratamientos dentro de una categoría (sort_order = índice). */
export async function setTreatmentOrder(orderedIds: string[]): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase.from("treatments").update({ sort_order: i }).eq("id", orderedIds[i]);
    if (error) return { ok: false, error: error.message };
  }
  updateTag("catalog");
  return { ok: true };
}
