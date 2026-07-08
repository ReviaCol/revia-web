/**
 * constellation-zones.ts — Datos de la "Carta celeste" de /tratamientos.
 *
 * Combina la GEOMETRÍA de la constelación (posiciones x/y en viewBox 1440×900,
 * líneas, numerales, ritmo de titilar) con las ZONAS y TRATAMIENTOS REALES.
 *
 * - Las zonas espejan `components/body-explorer/body-zones.ts` (6 faciales de
 *   FACE_ZONES; 6 corporales consolidando las 9 de BODY_BLOCK_ZONES).
 * - Los NOMBRES de tratamiento se resuelven desde `data/treatments.json` (fuente
 *   única) por id — no se duplican nombres aquí.
 *
 * Regla dura: todo es no invasivo. Cero términos invasivos en labels/copy.
 * Ver ADR 03-decisions/0007-tratamientos-constelacion.md.
 */

import treatmentsData from "@/data/treatments.json";

export type ConstellationMode = "rostro" | "cuerpo";

/** Una fila de tratamiento en la tarjeta (nombre resuelto desde treatments.json). */
export type ConstellationTreatment = {
  num: string;
  id: string;
  name: string;
};

/** Definición de zona ANTES de resolver nombres (geometría + display + ids). */
type ZoneDef = {
  id: string;
  /** Coordenadas en el viewBox 1440×900. */
  x: number;
  y: number;
  /** Lado de la etiqueta respecto a la estrella. */
  anchor: "start" | "end";
  /** Ritmo de titilar 1–6 (clases .const-tw-N en globals.css). */
  tw: 1 | 2 | 3 | 4 | 5 | 6;
  /** Palabra evocadora única para la etiqueta SVG grande. */
  starLabel: string;
  /** Tamaño de la etiqueta en px del viewBox. */
  labelSize: number;
  /** Numeral romano + subtítulo (overline editorial junto a la estrella). */
  num: string;
  /** Anotación anatómica decorativa. */
  anatomy: string;
  /** Overline de la tarjeta. */
  eyebrow: string;
  /** Coordenadas decorativas de la tarjeta. */
  coord: string;
  /** Título de la tarjeta en dos partes (la 2ª se resalta en itálica). */
  title: [string, string];
  /** Descripción en voz de marca (sin términos prohibidos). */
  sub: string;
  /** IDs de tratamiento en treatments.json. */
  treatmentIds: string[];
};

export type ConstellationZone = Omit<ZoneDef, "treatmentIds"> & {
  treatments: ConstellationTreatment[];
};

type HeadlineSegment = { t: string; em?: boolean; br?: boolean };

type MapDef = {
  mode: ConstellationMode;
  eyebrow: string;
  headline: HeadlineSegment[];
  headSub: string;
  coords: string;
  metaCoord: string;
  zones: ZoneDef[];
  /** Líneas de constelación por índice de zona; tercer valor "dash" = punteada. */
  lines: ReadonlyArray<readonly [number, number] | readonly [number, number, "dash"]>;
};

export type ConstellationMap = Omit<MapDef, "zones"> & {
  zones: ConstellationZone[];
  /** Conteo de zonas (decorativo). */
  zoneCount: number;
  /** Tratamientos distintos del modo (decorativo). */
  treatmentCount: number;
};

/* ── Resolución de nombres desde treatments.json ─────────────────────── */

type RawTreatment = { id: string; name: string };
type RawCategory = { treatments: RawTreatment[] };

const NAME_BY_ID: Record<string, string> = {};
for (const cat of (treatmentsData as { categories: RawCategory[] }).categories) {
  for (const t of cat.treatments) NAME_BY_ID[t.id] = t.name;
}

function resolveTreatments(ids: string[]): ConstellationTreatment[] {
  return ids.map((id, i) => {
    const name = NAME_BY_ID[id];
    if (!name) {
      // Falla ruidosa en dev: un id sin nombre es un error de datos.
      throw new Error(`constellation-zones: id de tratamiento desconocido "${id}"`);
    }
    return { num: String(i + 1).padStart(2, "0"), id, name };
  });
}

/* ── Definición de las dos cartas ────────────────────────────────────── */

const ROSTRO: MapDef = {
  mode: "rostro",
  eyebrow: "III · Carta facial",
  headline: [
    { t: "Tu belleza ya existe.", br: true },
    { t: "Espera ser revelada.", em: true },
  ],
  headSub:
    "Seis estrellas, seis territorios del rostro. Pasea por la constelación y revela lo que cada zona puede recuperar.",
  coords: "Reviá Institutum · Vol. I · MMXXVI · Carta facial",
  metaCoord: "23°00′N · 102°00′W",
  zones: [
    {
      id: "cuero-cabelludo",
      x: 220, y: 260, anchor: "start", tw: 1,
      starLabel: "Cabello", labelSize: 34, num: "I · CAPILAR",
      anatomy: "·folículo  ·densidad  ·línea capilar",
      eyebrow: "Zona I · Cuero cabelludo", coord: "23°N · 14°E",
      title: ["Cuero", "cabelludo"],
      sub: "Donde el cabello vuelve a su densidad. Restauramos sin marcas, a tu ritmo.",
      treatmentIds: ["regen-ex", "plasma-boost", "dhi-zafiro"],
    },
    {
      id: "frente-rostro",
      x: 470, y: 290, anchor: "start", tw: 2,
      starLabel: "Frente", labelSize: 32, num: "II · ENTRECEJO",
      anatomy: "·entrecejo  ·temporal  ·expresión",
      eyebrow: "Zona II · Frente", coord: "20°N · 14°E",
      title: ["Frente", "y entrecejo"],
      sub: "Donde la expresión se sedimenta. Modulamos sin congelar el gesto.",
      treatmentIds: ["toxina-botulinica"],
    },
    {
      id: "tercio-medio",
      x: 800, y: 420, anchor: "start", tw: 3,
      starLabel: "Pómulos", labelSize: 40, num: "III · MALAR",
      anatomy: "·pómulo  ·malar  ·surco nasogeniano",
      eyebrow: "Zona III · Pómulos y mejillas", coord: "15°N · 12°E",
      title: ["Pómulos", "y mejillas"],
      sub: "La arquitectura del rostro vuelve a su sitio. Volumen estructural, nunca saturación.",
      treatmentIds: ["acido-hialuronico", "rejuvenecimiento-360", "bioestimuladores"],
    },
    {
      id: "tercio-inferior",
      x: 1080, y: 530, anchor: "start", tw: 4,
      starLabel: "Labios", labelSize: 34, num: "IV · PERIORAL",
      anatomy: "·labios  ·contorno  ·perioral",
      eyebrow: "Zona IV · Labios y contorno", coord: "10°N · 13°E",
      title: ["Labios", "y contorno"],
      sub: "Hidratación profunda y definición sutil. Tu boca, más viva — nunca otra boca.",
      treatmentIds: ["acido-hialuronico", "prp"],
    },
    {
      id: "papada",
      x: 1180, y: 740, anchor: "end", tw: 5,
      starLabel: "Mentón", labelSize: 32, num: "V · SUBMENTÓN",
      anatomy: "·papada  ·submentón  ·mandíbula",
      eyebrow: "Zona V · Papada y mentón", coord: "04°N · 14°E",
      title: ["Papada", "y mentón"],
      sub: "Reafirmamos la línea mandibular y disolvemos la papada con armonía facial.",
      treatmentIds: ["bioenzimas", "radiofrecuencia-fraccionada"],
    },
    {
      id: "cuello-frente",
      x: 540, y: 720, anchor: "end", tw: 6,
      starLabel: "Cuello", labelSize: 34, num: "VI · ESCOTE",
      anatomy: "·platisma  ·escote  ·firmeza",
      eyebrow: "Zona VI · Cuello", coord: "−10°S · 16°E",
      title: ["Cuello", "y escote"],
      sub: "La extensión del rostro — donde la edad se ve primero y donde menos se atiende.",
      treatmentIds: ["radiofrecuencia-fraccionada", "bioestimuladores"],
    },
  ],
  lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 4, "dash"]],
};

const CUERPO: MapDef = {
  mode: "cuerpo",
  eyebrow: "IV · Carta corporal",
  headline: [
    { t: "Tu cuerpo tiene " },
    { t: "memoria.", em: true, br: true },
    { t: "La devolvemos a casa." },
  ],
  headSub:
    "Seis estrellas, seis territorios del cuerpo. Cada zona, un protocolo regenerativo no invasivo.",
  coords: "Reviá Institutum · Vol. II · MMXXVI · Carta corporal",
  metaCoord: "04°00′S · 102°00′W",
  zones: [
    {
      id: "torso-frente",
      x: 620, y: 200, anchor: "start", tw: 1,
      starLabel: "Torso", labelSize: 36, num: "I · ESCOTE",
      anatomy: "·pecho  ·escote  ·firmeza",
      eyebrow: "Zona I · Torso y pecho", coord: "15°N · 8°W",
      title: ["Torso", "y pecho"],
      sub: "Firmeza y luminosidad para la zona más expuesta. Reafirmamos sin tensar el gesto.",
      treatmentIds: ["radiofrecuencia-fraccionada", "bioestimuladores"],
    },
    {
      id: "abdomen",
      x: 820, y: 430, anchor: "end", tw: 3,
      starLabel: "Abdomen", labelSize: 40, num: "II · CINTURA",
      anatomy: "·flanco  ·cintura  ·línea alba",
      eyebrow: "Zona II · Abdomen y cintura", coord: "00° · 14°W",
      title: ["Abdomen", "y cintura"],
      sub: "Moldeado corporal de precisión: reducción focal y piel más firme, a la vez.",
      treatmentIds: ["moldeado-corporal", "anti-celulitis"],
    },
    {
      id: "espalda",
      x: 320, y: 270, anchor: "start", tw: 2,
      starLabel: "Espalda", labelSize: 32, num: "III · DORSAL",
      anatomy: "·dorsal  ·lumbar  ·omóplato",
      eyebrow: "Zona III · Espalda", coord: "18°N · 22°W",
      title: ["Espalda", "alta y baja"],
      sub: "Devolvemos firmeza al dorso y a la zona lumbar, donde el contorno también se dibuja.",
      treatmentIds: ["moldeado-corporal", "radiofrecuencia-fraccionada", "anti-celulitis"],
    },
    {
      id: "gluteos",
      x: 1180, y: 380, anchor: "end", tw: 4,
      starLabel: "Glúteos", labelSize: 34, num: "IV · LIFT",
      anatomy: "·proyección  ·tonificación  ·firmeza",
      eyebrow: "Zona IV · Glúteos", coord: "−05°S · 6°W",
      title: ["Glúteos", "proyección"],
      sub: "Tonificación y proyección activando tu propia musculatura — sin implantes.",
      treatmentIds: ["anti-celulitis", "moldeado-corporal", "radiofrecuencia-fraccionada"],
    },
    {
      id: "muslos",
      x: 520, y: 620, anchor: "end", tw: 5,
      starLabel: "Muslos", labelSize: 30, num: "V · CELULITIS",
      anatomy: "·trocánter  ·muslo  ·posterior",
      eyebrow: "Zona V · Muslos y celulitis", coord: "−12°S · 18°W",
      title: ["Muslos", "y celulitis"],
      sub: "Tratamos la celulitis en su origen y reafirmamos el muslo. La constancia es el secreto.",
      treatmentIds: ["anti-celulitis", "moldeado-corporal"],
    },
    {
      id: "piernas",
      x: 1100, y: 740, anchor: "end", tw: 6,
      starLabel: "Piernas", labelSize: 34, num: "VI · VASCULAR",
      anatomy: "·gemelo  ·circulación  ·tobillo",
      eyebrow: "Zona VI · Piernas", coord: "−20°S · 12°W",
      title: ["Piernas", "circulación"],
      sub: "Circulación, drenaje y bienestar vascular, evaluados por especialista en angiología.",
      treatmentIds: ["vascular"],
    },
  ],
  lines: [[2, 0], [0, 1], [1, 3], [1, 4], [4, 5], [3, 5], [2, 4, "dash"]],
};

/* ── Build (resuelve nombres + conteos) ──────────────────────────────── */

function buildMap(def: MapDef): ConstellationMap {
  const zones: ConstellationZone[] = def.zones.map((z) => {
    const { treatmentIds, ...rest } = z;
    return { ...rest, treatments: resolveTreatments(treatmentIds) };
  });
  const distinct = new Set<string>();
  for (const z of def.zones) for (const id of z.treatmentIds) distinct.add(id);
  return {
    ...def,
    zones,
    zoneCount: zones.length,
    treatmentCount: distinct.size,
  };
}

export const CONSTELLATION_MAPS: Record<ConstellationMode, ConstellationMap> = {
  rostro: buildMap(ROSTRO),
  cuerpo: buildMap(CUERPO),
};

const ROMAN: ReadonlyArray<[number, string]> = [
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

/** Romano para los numerales decorativos (1–39 cubre de sobra). */
export function toRoman(n: number): string {
  let out = "";
  let rest = n;
  for (const [value, sym] of ROMAN) {
    while (rest >= value) {
      out += sym;
      rest -= value;
    }
  }
  return out || "·";
}
