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

export type ProtocolStep = { title: string; body: string };
export type Technology = { lead: string; items: string[] };

export type TreatmentRow = {
  id: string;
  category_id: string;
  name: string;
  summary: string;
  outcome: string | null;
  body_zones: string[];
  visible: boolean;
  sort_order: number;
  // Fase 4 (ADR 0018): contenido rico. null = ficha usa el template genérico.
  protocol: ProtocolStep[] | null;
  candidate: string[] | null;
  technology: Technology | null;
};

/** Fila de la tabla faqs (Fase 2). En Fase 4, scope = <treatment id>. */
export type FaqRow = {
  id: string;
  scope: string;
  question: string;
  answer: string;
  sort_order: number;
  visible: boolean;
};

/** Q/A tal como la edita el panel (sin id de fila). */
export type QAInput = { question: string; answer: string };

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
