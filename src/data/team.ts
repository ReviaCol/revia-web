/**
 * team.ts — Equipo médico de Reviá.
 *
 * ⚠️ DATOS PLACEHOLDER. Andres reemplaza nombres, fotos y credenciales reales.
 *
 * Reglas duras al reemplazar (ver memory/project_revia_legal_lafont.md y
 * memory/project_revia_no_invasivo.md):
 *  - CERO menciones a "La Font", "Dr. Font", cirugía plástica o procedimientos
 *    quirúrgicos.
 *  - CERO años de experiencia que sumen >20 por persona (la trayectoria máxima
 *    que la marca Reviá puede reclamar es "20 años de rigor médico heredado",
 *    como atributo del centro, no como historia de un individuo).
 *  - Certificaciones genéricas hasta tener las reales (Universidad Nacional,
 *    Sociedad Colombiana de X). Foto editorial, NO bata blanca sonriendo.
 *
 * Para reemplazar: edita el array MEMBERS. La estructura está diseñada para que
 * cambiar la data sea trivial — añade `photo` cuando haya foto editorial real.
 */

export type TeamMember = {
  /** slug estable para keys y posibles anchors */
  id: string;
  /** "Dr. [Nombre]" / "Dra. [Nombre]" — placeholder hasta tener nombres reales */
  name: string;
  /** especialidad principal, p. ej. "Medicina Estética · Regenerativa" */
  specialty: string;
  /** formación / credenciales genéricas hasta tener las reales */
  credentials: string[];
  /** cita personal en tono Reviá (poético-cálido, no clínico frío) */
  quote: string;
  /** ruta a foto editorial real cuando exista. Si es null → placeholder peach */
  photo: string | null;
};

export const MEMBERS: TeamMember[] = [
  {
    id: "miembro-01",
    name: "Dra. [Nombre]",
    specialty: "Medicina Estética · Regenerativa",
    credentials: ["Universidad Nacional de Colombia", "Sociedad Colombiana de Medicina Estética"],
    quote: "No buscamos cambiarte. Buscamos revelar lo que ya eres.",
    photo: null,
  },
  {
    id: "miembro-02",
    name: "Dr. [Nombre]",
    specialty: "Dermatología · Bioestimulación",
    credentials: ["Universidad Nacional de Colombia", "Asociación Colombiana de Dermatología"],
    quote: "La piel cuenta una historia. Mi trabajo es ayudarla a contarla mejor.",
    photo: null,
  },
  {
    id: "miembro-03",
    name: "Dra. [Nombre]",
    specialty: "Nutrición · Longevidad",
    credentials: ["Universidad Nacional de Colombia", "Especialización en Nutrición Clínica"],
    quote: "La vitalidad empieza en la célula. La acompañamos desde dentro.",
    photo: null,
  },
  {
    id: "miembro-04",
    name: "Dr. [Nombre]",
    specialty: "Medicina Regenerativa · Bienestar",
    credentials: ["Universidad Nacional de Colombia", "Formación en Medicina Regenerativa"],
    quote: "Activamos procesos que tu cuerpo ya conoce. Solo le damos la señal.",
    photo: null,
  },
];
