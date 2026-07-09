import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import fallbackData from "@/data/treatments.json";
import {
  type Category,
  type Treatment,
  CATEGORY_SLUG_TO_ID,
  CATEGORY_ID_TO_SLUG,
} from "@/lib/treatments";

/**
 * catalog.ts — read-layer del catálogo para las superficies públicas (CMS Fase 1).
 * ADR: 03-decisions/0014-cms-admin-catalogo-supabase.md
 *
 * getCatalog() lee categories + treatments de Supabase con la ANON key, dentro de
 * unstable_cache con tag "catalog". Al guardar en /admin/catalogo se llama
 * revalidateTag("catalog") → update instantáneo sin redeploy, manteniendo render
 * estático (respeta los presupuestos de Core Web Vitals del proyecto).
 *
 * Fallback seguro: si la consulta falla o viene vacía (tablas aún sin migrar, DB
 * caída, env sin configurar) cae al import empaquetado de src/data/treatments.json.
 * Así el sitio NO se rompe entre el deploy del código y la ejecución de 0004/0005.
 *
 * API espejo de lib/treatments.ts (misma firma, pero async) para que el rewire de
 * las páginas sea drop-in. lib/treatments.ts se conserva como la fuente sync del
 * fallback y para consumidores que no pueden ser async (leads.ts, seo.ts, sitemap).
 */

export type { Category, Treatment };
export { CATEGORY_SLUG_TO_ID, CATEGORY_ID_TO_SLUG };

const FALLBACK_CATEGORIES = fallbackData.categories as unknown as Category[];

/** Filas tal cual vienen de Supabase (snake_case). */
type CategoryRow = {
  id: string;
  name: string;
  palette: "warm" | "cool";
  headline: string | null;
  sort_order: number;
};

type TreatmentRow = {
  id: string;
  category_id: string;
  name: string;
  summary: string;
  outcome: string | null;
  body_zones: string[] | null;
  visible: boolean;
  sort_order: number;
};

/**
 * Cliente Supabase "público" (anon, sin sesión ni cookies). Se usa dentro de
 * unstable_cache, que NO permite leer cookies/headers — por eso no reutilizamos
 * el cliente cookie-based de lib/supabase/server.ts. RLS: anon solo ve
 * treatments con visible=true; categories se leen siempre.
 */
function publicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/**
 * Lee el catálogo de la DB y lo mapea a la forma Category[] (igual que el JSON).
 * Devuelve null si no hay env, si la consulta falla o si no hay categorías —
 * para que el caller caiga al fallback SIN cachear el fallback.
 */
async function fetchCatalogFromDb(): Promise<Category[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = publicClient();
  const [{ data: cats, error: catErr }, { data: treats, error: trErr }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id,name,palette,headline,sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("treatments")
        .select("id,category_id,name,summary,outcome,body_zones,visible,sort_order")
        .order("sort_order", { ascending: true }),
    ]);

  if (catErr || trErr) return null;
  if (!cats || cats.length === 0) return null;

  const byCat = new Map<string, Treatment[]>();
  for (const t of (treats ?? []) as TreatmentRow[]) {
    // Defensa en profundidad: RLS anon ya filtra, pero re-filtramos por si el
    // caller usara un cliente con más permisos en el futuro.
    if (t.visible === false) continue;
    const list = byCat.get(t.category_id) ?? [];
    list.push({
      id: t.id,
      name: t.name,
      summary: t.summary,
      outcome: t.outcome ?? undefined,
      bodyZones: t.body_zones ?? [],
    });
    byCat.set(t.category_id, list);
  }

  return (cats as CategoryRow[]).map((c) => ({
    id: c.id,
    name: c.name,
    palette: c.palette,
    headline: c.headline ?? undefined,
    treatments: byCat.get(c.id) ?? [],
  }));
}

/**
 * Versión cacheada. Si la DB falla/está vacía, LANZA para no cachear el fallback:
 * unstable_cache no guarda el resultado si la función lanza, así que la próxima
 * request reintenta la DB. El fallback lo resuelve getCatalog() fuera de la caché.
 */
const getCachedCatalog = unstable_cache(
  async (): Promise<Category[]> => {
    const fromDb = await fetchCatalogFromDb();
    if (!fromDb) throw new Error("catalog: DB read failed or empty");
    return fromDb;
  },
  ["revia-catalog"],
  { tags: ["catalog"] },
);

/**
 * Punto de entrada. Devuelve el catálogo visible (categorías ordenadas, cada una
 * con sus tratamientos visibles ordenados). Nunca lanza: cae al JSON empaquetado.
 */
export async function getCatalog(): Promise<Category[]> {
  try {
    return await getCachedCatalog();
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

/* ── API espejo de lib/treatments.ts (async) ──────────────────────────── */

export async function getCategoryById(id: string): Promise<Category | undefined> {
  return (await getCatalog()).find((c) => c.id === id);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const id = CATEGORY_SLUG_TO_ID[slug];
  return id ? getCategoryById(id) : undefined;
}

export async function getTreatmentBySlug(
  categorySlug: string,
  treatmentId: string,
): Promise<{ category: Category; treatment: Treatment } | undefined> {
  const category = await getCategoryBySlug(categorySlug);
  const treatment = category?.treatments.find((t) => t.id === treatmentId);
  return category && treatment ? { category, treatment } : undefined;
}

/**
 * Params para generateStaticParams de /tratamientos/[categoria]/[slug].
 * Async desde el catálogo (DB con fallback). Usar con dynamicParams=true para que
 * tratamientos nuevos (creados en /admin) rendericen on-demand sin rebuild.
 */
export async function getTreatmentParams(): Promise<
  { categoria: string; slug: string }[]
> {
  const params: { categoria: string; slug: string }[] = [];
  for (const categoria of Object.keys(CATEGORY_SLUG_TO_ID)) {
    const category = await getCategoryBySlug(categoria);
    category?.treatments.forEach((t) => params.push({ categoria, slug: t.id }));
  }
  return params;
}
