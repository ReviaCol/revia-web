/**
 * Tipos compartidos del admin de catálogo (CMS Fase 1, ADR 0014).
 * Filas tal cual están en Supabase (snake_case). El authenticated (panel) ve
 * TODO, incluidos los tratamientos con visible=false.
 */

export type Palette = "warm" | "cool";

export type CategoryRow = {
  id: string;
  name: string;
  palette: Palette;
  headline: string | null;
  sort_order: number;
};

export type TreatmentRow = {
  id: string;
  category_id: string;
  name: string;
  summary: string;
  outcome: string | null;
  body_zones: string[];
  visible: boolean;
  sort_order: number;
};

export type ActionResult = { ok: boolean; error?: string; id?: string };

export const PALETTES: { value: Palette; label: string }[] = [
  { value: "warm", label: "Cálida (warm)" },
  { value: "cool", label: "Fría (cool)" },
];

/** Convierte "rostro completo, Cuello" en ["rostro-completo","cuello"]. */
export function parseBodyZones(input: string): string[] {
  return input
    .split(",")
    .map((z) =>
      z
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    )
    .filter(Boolean);
}
