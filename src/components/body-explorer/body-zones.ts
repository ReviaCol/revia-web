/**
 * Body zones — datos para el BodyExplorer en sus dos modos.
 *
 * MODO ROSTRO: zonas faciales con coordenadas 2D (% sobre la foto editorial)
 *   y 3D (reservadas para migración futura a GLB).
 *
 * MODO CUERPO: zonas corporales como bloques arquitectónicos.
 *
 * treatmentIds: IDs de tratamientos en src/data/treatments.json.
 */

export type FaceZone = {
  id: string;
  label: string;
  /** Posición 3D sobre el modelo facial. Reservado para futura migración a GLB. */
  position3D: [number, number, number];
  /**
   * Posición 2D (en %) sobre la foto editorial de la portada.
   * Origen 0,0 = top-left. Usado por FaceMode para colocar hotspots.
   */
  position2D: { x: number; y: number };
  treatmentIds: string[];
};

export type BodyBlockZone = {
  id: string;
  label: string;
  side: "front" | "back" | "both";
  number: string;
  treatmentIds: string[];
};

/**
 * Zonas FACIALES — para el modo Rostro (foto editorial con hotspots).
 */
export const FACE_ZONES: ReadonlyArray<FaceZone> = [
  {
    id: "cuero-cabelludo",
    label: "Cuero cabelludo",
    position3D: [0, 1.6, 0],
    position2D: { x: 46, y: 8 },
    treatmentIds: ["dhi-zafiro", "prp"],
  },
  {
    id: "frente-rostro",
    label: "Frente y entrecejo",
    position3D: [0, 1.2, 0.5],
    position2D: { x: 40, y: 30 },
    treatmentIds: ["toxina-botulinica"],
  },
  {
    id: "tercio-medio",
    label: "Pómulos y mejillas",
    position3D: [0, 0.8, 0.55],
    position2D: { x: 30, y: 50 },
    treatmentIds: ["acido-hialuronico", "rejuvenecimiento-360", "bioestimuladores"],
  },
  {
    id: "tercio-inferior",
    label: "Labios y contorno",
    position3D: [0, 0.4, 0.55],
    position2D: { x: 27, y: 66 },
    treatmentIds: ["acido-hialuronico", "prp"],
  },
  {
    id: "papada",
    label: "Papada y submentón",
    position3D: [0, 0.05, 0.45],
    position2D: { x: 30, y: 72 },
    treatmentIds: ["bioenzimas", "radiofrecuencia-fraccionada"],
  },
  {
    id: "cuello-frente",
    label: "Cuello",
    position3D: [0, -0.3, 0.4],
    position2D: { x: 42, y: 78 },
    treatmentIds: ["radiofrecuencia-fraccionada", "bioestimuladores"],
  },
];

/**
 * Zonas CORPORALES — composición de bloques arquitectónicos.
 */
export const BODY_BLOCK_ZONES: ReadonlyArray<BodyBlockZone> = [
  {
    id: "torso-frente",
    label: "Torso y pecho",
    side: "front",
    number: "01",
    treatmentIds: ["radiofrecuencia-fraccionada", "bioestimuladores"],
  },
  {
    id: "espalda-alta",
    label: "Espalda alta y omoplatos",
    side: "back",
    number: "01",
    treatmentIds: ["moldeado-corporal", "radiofrecuencia-fraccionada"],
  },
  {
    id: "abdomen",
    label: "Abdomen",
    side: "front",
    number: "02",
    treatmentIds: ["moldeado-corporal", "anti-celulitis"],
  },
  {
    id: "espalda-baja",
    label: "Espalda baja y lumbar",
    side: "back",
    number: "02",
    treatmentIds: ["moldeado-corporal", "anti-celulitis"],
  },
  {
    id: "flancos",
    label: "Flancos y cintura",
    side: "front",
    number: "03",
    treatmentIds: ["moldeado-corporal"],
  },
  {
    id: "gluteos",
    label: "Glúteos",
    side: "back",
    number: "03",
    treatmentIds: ["anti-celulitis", "moldeado-corporal", "radiofrecuencia-fraccionada"],
  },
  {
    id: "muslos-frente",
    label: "Muslos (frente)",
    side: "front",
    number: "04",
    treatmentIds: ["anti-celulitis", "moldeado-corporal"],
  },
  {
    id: "muslos-espalda",
    label: "Muslos (parte posterior)",
    side: "back",
    number: "04",
    treatmentIds: ["anti-celulitis"],
  },
  {
    id: "piernas",
    label: "Piernas (sistema vascular)",
    side: "both",
    number: "05",
    treatmentIds: ["vascular"],
  },
];

export function bodyBlocksBySide(
  side: "front" | "back",
): readonly BodyBlockZone[] {
  return BODY_BLOCK_ZONES.filter((z) => z.side === side || z.side === "both");
}
