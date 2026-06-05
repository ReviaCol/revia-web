import { getCategoryById } from "@/lib/treatments";

/**
 * leads.ts — tipos y helpers del CRM interno (tabla `leads`).
 * Schema: supabase/migrations/0001_leads.sql
 */

export const LEAD_ESTADOS = [
  "nuevo",
  "contactado",
  "agendado",
  "descartado",
] as const;

export type LeadEstado = (typeof LEAD_ESTADOS)[number];

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  nombre: string;
  email: string;
  whatsapp: string | null;
  servicio: string | null;
  mensaje: string | null;
  estado: LeadEstado;
  fuente: string;
  notas: string | null;
};

/** Etiqueta legible para cada estado del pipeline. */
export const ESTADO_LABEL: Record<LeadEstado, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  agendado: "Agendado",
  descartado: "Descartado",
};

/**
 * Color de acento por estado (tokens de marca). Warm para el pipeline activo;
 * coffee-500 apagado para "descartado".
 */
export const ESTADO_COLOR: Record<LeadEstado, string> = {
  nuevo: "var(--revia-terracotta-500)",
  contactado: "var(--revia-amber-300)",
  agendado: "var(--revia-sky-500)",
  descartado: "var(--revia-coffee-500)",
};

/** Nombre legible del servicio (id de categoría → nombre), o "—" si no hay. */
export function servicioLabel(servicio: string | null): string {
  if (!servicio) return "—";
  return getCategoryById(servicio)?.name ?? servicio;
}
