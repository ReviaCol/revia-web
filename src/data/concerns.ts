/**
 * concerns.ts — eje de navegación "por preocupación" para /tratamientos.
 *
 * Segunda vía de entrada al catálogo (ADR 0019): en vez de navegar por
 * categoría clínica (Corporal/Facial/…), el usuario navega por lo que busca
 * ("Firmeza y flacidez", "Cabello", …). Es el patrón dominante en clínicas
 * premium: se venden soluciones, no nomenclatura interna.
 *
 * IMPORTANTE — no es fuente de tratamientos. El catálogo real vive en
 * getCatalog() (Supabase con fallback a treatments.json). Aquí solo mapeamos
 * IDs de tratamiento existentes a preocupaciones. Un id que no exista o que
 * esté oculto (visible=false) simplemente no aparece: el explorer filtra el
 * mapeo contra los tratamientos realmente cargados. Muchos-a-muchos: un
 * tratamiento puede vivir en varias preocupaciones.
 *
 * PENDIENTE: taxonomía y asignaciones son un primer trazo — requiere
 * validación médica/marketing igual que el resto del copy placeholder.
 */

export type Concern = {
  id: string;
  /** Etiqueta de chip, en lenguaje del paciente. */
  label: string;
  /** Frase corta, tono manifiesto, para el encabezado del grupo. */
  blurb: string;
  /** IDs de tratamiento del catálogo que responden a esta preocupación. */
  treatmentIds: string[];
};

export const CONCERNS: Concern[] = [
  {
    id: "firmeza",
    label: "Firmeza y flacidez",
    blurb: "Reafirmar lo que la gravedad afloja.",
    treatmentIds: [
      "radiofrecuencia-fraccionada",
      "bioestimuladores",
      "rejuvenecimiento-360",
      "blefaroplastia-no-invasiva",
      "bioenzimas",
    ],
  },
  {
    id: "arrugas",
    label: "Arrugas y expresión",
    blurb: "Suavizar el tiempo sin borrar tu gesto.",
    treatmentIds: [
      "toxina-botulinica",
      "acido-hialuronico",
      "bioestimuladores",
      "rejuvenecimiento-360",
      "prp",
    ],
  },
  {
    id: "contorno",
    label: "Contorno corporal",
    blurb: "Moldear la silueta que ya es tuya.",
    treatmentIds: ["moldeado-corporal", "anti-celulitis"],
  },
  {
    id: "cabello",
    label: "Cabello",
    blurb: "Devolverle vida a cada folículo.",
    treatmentIds: [
      "nutri-fol",
      "prp-capilar",
      "foli-activ",
      "plasma-boost",
      "regen-ex",
      "dhi-zafiro",
      "microinjerto-fue",
      "densificacion-non-shaven",
      "restauracion-barba",
      "restauracion-cejas",
    ],
  },
  {
    id: "luminosidad",
    label: "Luminosidad y piel sana",
    blurb: "Piel que respira y refleja luz.",
    treatmentIds: [
      "limpieza-facial",
      "terapia-biologica",
      "prp",
      "rejuvenecimiento-360",
      "vitamina-c",
      "exosomas",
    ],
  },
  {
    id: "vitalidad",
    label: "Energía, descanso y longevidad",
    blurb: "Cuidar tu edad biológica, no solo el espejo.",
    treatmentIds: [
      "nad",
      "celulas-madre",
      "exosomas",
      "vitamina-c",
      "exomind",
      "fuego-y-hielo",
      "flotacion",
      "exilis",
      "caminadoras-subacuaticas",
      "sobrepeso",
      "sueno",
      "vascular",
      "toxina-anti-sudoracion",
    ],
  },
];
