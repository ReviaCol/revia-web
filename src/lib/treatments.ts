import data from "@/data/treatments.json";

/**
 * treatments.ts — acceso tipado a la fuente única de tratamientos
 * (src/data/treatments.json). Las páginas de tratamientos, subcategorías y
 * fichas individuales leen de aquí. Sincronizar 04-content/treatments.json y
 * 05-src/src/data/treatments.json al cambiar el catálogo (ver debt.md).
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
};

export const CATEGORY_ID_TO_SLUG: Record<string, string> = {
  "no-invasivos-corporal": "corporal",
  "no-invasivos-facial": "facial",
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
