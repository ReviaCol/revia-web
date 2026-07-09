import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { QA } from "@/components/page/FAQ";

/**
 * faqs.ts — read-layer de FAQs por `scope` (CMS Fase 2).
 * ADR: 03-decisions/0016-cms-fase2-hero-faqs-equipo.md
 * Tag "site-content". Fallback estático por scope si la DB falla/está vacía.
 */

const TAG = "site-content";

export type { QA };

type Row = { scope: string; question: string; answer: string };

/** Fallback = arrays hardcodeados que hoy viven en cada página. */
const FALLBACK: Record<string, QA[]> = {
  longevidad: [
    { q: "¿Necesito preparación previa?", a: "Muy poca. Te damos indicaciones simples al agendar para que aproveches la sesión al máximo." },
    { q: "¿Con qué frecuencia se recomienda?", a: "Depende de tu objetivo. Lo definimos en tu evaluación de longevidad, con un plan realista y sostenible." },
    { q: "¿Es para mí?", a: "Si buscas recuperar energía, claridad y equilibrio sin procedimientos invasivos, es muy probable que sí. Te lo confirmamos con honestidad." },
  ],
  "implante-capilar": [
    { q: "¿Es un proceso doloroso?", a: "Aplicamos anestesia local para que la experiencia sea cómoda. La mayoría de las personas describe molestias mínimas durante y después del tratamiento." },
    { q: "¿Cuándo veré resultados?", a: "El cabello implantado suele caer en las primeras semanas (es esperado) y comienza a crecer de forma estable a partir del tercer o cuarto mes. El resultado pleno se aprecia entre los 9 y 12 meses." },
    { q: "¿Necesito rasurarme la cabeza?", a: "No necesariamente. Ofrecemos técnica sin rasurado (non-shaven) cuando tu caso lo permite, para que puedas retomar tu vida con discreción." },
    { q: "¿El cabello implantado se vuelve a caer?", a: "Los folículos implantados se toman de zonas resistentes a la caída, por lo que tienden a permanecer. Te explicamos con honestidad cómo cuidar el resto de tu cabello." },
    { q: "¿Cuánto tiempo toma el tratamiento?", a: "Distribuimos el proceso en dos días para tu comodidad, según la cantidad de folículos a implantar. Lo definimos contigo en la valoración." },
  ],
};

function publicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

async function fetchFromDb(scope: string): Promise<QA[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const { data, error } = await publicClient()
    .from("faqs")
    .select("scope,question,answer")
    .eq("scope", scope)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return null;
  return (data as Row[]).map((r) => ({ q: r.question, a: r.answer }));
}

const getCached = unstable_cache(
  async (scope: string): Promise<QA[]> => {
    const fromDb = await fetchFromDb(scope);
    if (!fromDb) throw new Error(`faqs: DB read failed or empty for scope ${scope}`);
    return fromDb;
  },
  ["revia-faqs"],
  { tags: [TAG] },
);

/** FAQs visibles de un scope, ordenadas. Nunca lanza: cae al fallback. */
export async function getFaqs(scope: string): Promise<QA[]> {
  try {
    return await getCached(scope);
  } catch {
    return FALLBACK[scope] ?? [];
  }
}
