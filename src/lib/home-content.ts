import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * home-content.ts — read-layer del contenido editable del home (CMS Fase 2).
 * ADR: 03-decisions/0016-cms-fase2-hero-faqs-equipo.md
 * Tag "site-content" (compartido con el resto de singletons). Fallback estático
 * a los valores actuales del home si la DB falla/está vacía.
 */

const TAG = "site-content";

export type HomeContent = {
  heroLine1: string;
  heroLine2: string;
  heroSubtitle: string;
  manifestoEyebrow: string;
  manifestoLine1: string;
  manifestoLine2: string;
};

type Row = {
  hero_line1: string;
  hero_line2: string;
  hero_subtitle: string;
  manifesto_eyebrow: string;
  manifesto_line1: string;
  manifesto_line2: string;
};

const FALLBACK: HomeContent = {
  heroLine1: "Tu belleza ya existe.",
  heroLine2: "Espera ser *revelada*.",
  heroSubtitle:
    "Medicina estética y regenerativa no invasiva. Activamos lo que tu biología ya conoce.",
  manifestoEyebrow: "Manifiesto",
  manifestoLine1: "Buscamos tu verdadera esencia",
  manifestoLine2: "para revelarla en tu *mejor expresión*.",
};

function publicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

async function fetchFromDb(): Promise<HomeContent | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const { data, error } = await publicClient()
    .from("home_content")
    .select("hero_line1,hero_line2,hero_subtitle,manifesto_eyebrow,manifesto_line1,manifesto_line2")
    .eq("id", "default")
    .maybeSingle<Row>();

  if (error || !data) return null;
  return {
    heroLine1: data.hero_line1,
    heroLine2: data.hero_line2,
    heroSubtitle: data.hero_subtitle,
    manifestoEyebrow: data.manifesto_eyebrow,
    manifestoLine1: data.manifesto_line1,
    manifestoLine2: data.manifesto_line2,
  };
}

const getCached = unstable_cache(
  async (): Promise<HomeContent> => {
    const fromDb = await fetchFromDb();
    if (!fromDb) throw new Error("home-content: DB read failed or empty");
    return fromDb;
  },
  ["revia-home-content"],
  { tags: [TAG] },
);

export async function getHomeContent(): Promise<HomeContent> {
  try {
    return await getCached();
  } catch {
    return FALLBACK;
  }
}
