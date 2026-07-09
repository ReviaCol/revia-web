import data from "@/data/treatments.json";

/**
 * treatments.ts — acceso tipado (SYNC) al catálogo empaquetado
 * (src/data/treatments.json).
 *
 * Desde el CMS Fase 1 (ADR 0014) las superficies públicas leen el catálogo EN VIVO
 * vía lib/catalog.ts (Supabase con fallback). Este módulo se conserva como:
 *   1) la FUENTE DEL FALLBACK que usa lib/catalog.ts si la DB falla/está vacía, y
 *   2) el acceso sync para consumidores que no pueden ser async: leads.ts
 *      (servicioLabel), seo.ts y sitemap.ts.
 * src/data/treatments.json es el respaldo; mantenerlo en sync con el seed 0005.
 */

export type Treatment = {
  id: string;
  name: string;
  summary: string;
  outcome?: string;
  bodyZones?: string[];
};

export type Category = {
  id: string;
  name: string;
  palette: "warm" | "cool";
  headline?: string;
  pilares?: string[];
  membresias?: string[];
  treatments: Treatment[];
};

export const CATEGORIES = data.categories as unknown as Category[];

/** Slug público de subcategoría → id en el JSON. */
export const CATEGORY_SLUG_TO_ID: Record<string, string> = {
  corporal: "no-invasivos-corporal",
  facial: "no-invasivos-facial",
  capilar: "implante-capilar",
};

export const CATEGORY_ID_TO_SLUG: Record<string, string> = {
  "no-invasivos-corporal": "corporal",
  "no-invasivos-facial": "facial",
  "implante-capilar": "capilar",
};

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const id = CATEGORY_SLUG_TO_ID[slug];
  return id ? getCategoryById(id) : undefined;
}

export function getTreatmentBySlug(
  categorySlug: string,
  treatmentId: string,
): { category: Category; treatment: Treatment } | undefined {
  const category = getCategoryBySlug(categorySlug);
  const treatment = category?.treatments.find((t) => t.id === treatmentId);
  return category && treatment ? { category, treatment } : undefined;
}
