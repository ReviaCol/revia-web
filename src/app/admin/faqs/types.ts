/** Tipos del admin de FAQs (CMS Fase 2, ADR 0016). */

export type FaqRow = {
  id: string;
  scope: string;
  question: string;
  answer: string;
  sort_order: number;
  visible: boolean;
};

export type ActionResult = { ok: boolean; error?: string; id?: string };

/** Metadata de scopes conocidos: etiqueta legible + si la página ya lee de la DB. */
export const SCOPE_META: Record<string, { label: string; live: boolean; note?: string }> = {
  longevidad: { label: "Longevidad", live: true },
  "implante-capilar": {
    label: "Implante capilar",
    live: false,
    note: "Editable aquí, pero la página aún no lee de la DB (archivo con corrupción de lectura en el entorno de Claude; se cablea aparte).",
  },
};

export function scopeLabel(scope: string): string {
  return SCOPE_META[scope]?.label ?? scope;
}
