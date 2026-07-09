/** Tipos del admin de equipo (CMS Fase 2, ADR 0016). */

export type SpecialtyRow = {
  id: string;
  name: string;
  sort_order: number;
  visible: boolean;
};

export type MemberRow = {
  id: string;
  name: string;
  specialty: string;
  credentials: string[];
  quote: string | null;
  photo_url: string | null;
  sort_order: number;
  visible: boolean;
};

export type ActionResult = { ok: boolean; error?: string; id?: string };

/** "UNAL, Soc. X" → ["UNAL","Soc. X"]. */
export function parseCredentials(input: string): string[] {
  return input
    .split(/[\n,]/)
    .map((c) => c.trim())
    .filter(Boolean);
}
