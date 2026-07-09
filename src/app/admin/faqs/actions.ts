"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "./types";

/**
 * Server actions de FAQs (CMS Fase 2, ADR 0016).
 * updateTag("site-content") tras cada mutación → las páginas que leen vía
 * getFaqs(scope) se regeneran al instante.
 */

type Supa = Awaited<ReturnType<typeof createClient>>;

async function authed(): Promise<Supa | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

async function nextSortOrder(supabase: Supa, scope: string): Promise<number> {
  const { data } = await supabase
    .from("faqs")
    .select("sort_order")
    .eq("scope", scope)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ sort_order: number }>();
  return (data?.sort_order ?? -1) + 1;
}

export async function createFaq(input: {
  scope: string;
  question: string;
  answer: string;
}): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const scope = input.scope.trim();
  const question = input.question.trim();
  const answer = input.answer.trim();
  if (!scope) return { ok: false, error: "Falta el grupo (scope)." };
  if (!question) return { ok: false, error: "La pregunta es obligatoria." };
  if (!answer) return { ok: false, error: "La respuesta es obligatoria." };

  const sort_order = await nextSortOrder(supabase, scope);
  const { error } = await supabase.from("faqs").insert({ scope, question, answer, sort_order });
  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true };
}

export async function updateFaq(
  id: string,
  patch: { question: string; answer: string },
): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const question = patch.question.trim();
  const answer = patch.answer.trim();
  if (!question) return { ok: false, error: "La pregunta es obligatoria." };
  if (!answer) return { ok: false, error: "La respuesta es obligatoria." };

  const { error } = await supabase.from("faqs").update({ question, answer }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true };
}

export async function setFaqVisible(id: string, visible: boolean): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const { error } = await supabase.from("faqs").update({ visible }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true };
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  updateTag("site-content");
  return { ok: true };
}

export async function setFaqOrder(orderedIds: string[]): Promise<ActionResult> {
  const supabase = await authed();
  if (!supabase) return { ok: false, error: "Sesión expirada. Vuelve a entrar." };
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase.from("faqs").update({ sort_order: i }).eq("id", orderedIds[i]);
    if (error) return { ok: false, error: error.message };
  }
  updateTag("site-content");
  return { ok: true };
}
