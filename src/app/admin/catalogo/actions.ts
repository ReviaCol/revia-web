"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, Palette, ProtocolStep, Technology, QAInput } from "./types";

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

/* ── Normalizadores de contenido rico (Fase 4, ADR 0018) ─────────────────── */

function cleanProtocol(p?: ProtocolStep[] | null): ProtocolStep[] | null {
  const r = (p ?? [])
    .map((s) => ({ title: (s.title ?? "").trim(), body: (s.body ?? "").trim() }))
    .filter((s) => s.title || s.body);
  return r.length ? r : null;
}

function cleanCandidate(c?: string[] | null): string[] | null {
  const r = (c ?? []).map((s) => (s ?? "").trim()).filter(Boolean);
  return r.length ? r : null;
}

function cleanTechnology(t?: Technology | null): Technology | null {
  if (!t) return null;
  const lead = (t.lead ?? "").trim();
  const items = (t.items ?? []).map((s) => (s ?? "").trim()).filter(Boolean);
  return lead || items.length ? { lead, items } : null;
}

/**
 * Reemplaza TODAS las FAQ del scope (delete + insert) con la lista dada. La FAQ
 * por tratamiento vive en public.faqs con scope = <treatment id> (reuso Fase 2).
 * Deduplica por pregunta (unique(scope,question)). Revalida "site-content".
 */
export async function saveTreatmentFaqs(
  scope: string,
  items: QAInput[],
): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  if (!scope) return { ok: false, error: "Falta el tratamiento." };

  const { error: delErr } = await supabase.from("faqs").delete().eq("scope", scope);
  if (delErr) return { ok: false, error: delErr.message };

  const seen = new Set<string>();
  const rows = items
    .map((i, idx) => ({
      scope,
      question: (i.question ?? "").trim(),
      answer: (i.answer ?? "").trim(),
      sort_order: idx,
      visible: true,
    }))
    .filter((r) => {
      if (!r.question || !r.answer || seen.has(r.question)) return false;
      seen.add(r.question);
      return true;
    })
    .map((r, idx) => ({ ...r, sort_order: idx }));

  if (rows.length) {
    const { error } = await supabase.from("faqs").insert(rows);
    if (error) return { ok: false, error: error.message };
  }
  updateTag("site-content");
  return { ok: true };
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
  protocol?: ProtocolStep[] | null;
  candidate?: string[] | null;
  technology?: Technology | null;
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
    protocol: cleanProtocol(input.protocol),
    candidate: cleanCandidate(input.candidate),
    technology: cleanTechnology(input.technology),
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
    protocol?: ProtocolStep[] | null;
    candidate?: string[] | null;
    technology?: Technology | null;
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
      protocol: cleanProtocol(patch.protocol),
      candidate: cleanCandidate(patch.candidate),
      technology: cleanTechnology(patch.technology),
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
