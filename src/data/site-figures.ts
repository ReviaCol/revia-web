/**
 * Mapping de slot id → ruta WebP (extraído del mockup Claude Design 2026-06-04).
 * Cada slot tiene además metadata de object-position (s = scale, x/y = offset %).
 * Usado por <ImageSlot slot="hero-main" .../>.
 */
export type FigureMeta = {
  src: string;
  s: number;
  x: number;
  y: number;
  /** Si existe, ImageSlot renderiza <video> con `src` como poster. */
  video?: string;
};

export const FIGURES: Record<string, FigureMeta> = {
  "hero-main": {
    "src": "/figures/hero-main-v2.webp",
    "s": 1,
    "x": 20,
    "y": 0
  },
  "filosofia-img": {
    "src": "/figures/filosofia-img-v2.webp",
    "s": 1,
    "x": 0,
    "y": 5,
    "video": "/figures/filosofia-video.mp4"
  },
  "trat-corporal": {
    "src": "/figures/trat-corporal-v2.webp",
    "s": 1,
    "x": 0,
    "y": 5
  },
  "trat-facial": {
    "src": "/figures/trat-facial-v2.webp",
    "s": 1,
    "x": 0,
    "y": 15
  },
  "trat-implante": {
    "src": "/figures/trat-implante-v2.webp",
    "s": 1,
    "x": 0,
    "y": 10
  },
  "trat-anti": {
    "src": "/figures/trat-anti.webp",
    "s": 1,
    "x": 0,
    "y": 0
  },
  "longevidad-img": {
    "src": "/figures/longevidad-img-v2.webp",
    "s": 1,
    "x": 10,
    "y": 0
  },
  "filo-naturalidad": {
    "src": "/figures/filo-naturalidad.webp",
    "s": 1,
    "x": 0,
    "y": 0
  },
  "cat-corporal": {
    "src": "/figures/cat-corporal-v2.webp",
    "s": 1,
    "x": 0,
    "y": 5
  },
  "cat-facial": {
    "src": "/figures/cat-facial-v2.webp",
    "s": 1,
    "x": 0,
    "y": 15
  },
  "cat-capilar": {
    "src": "/figures/cat-capilar-v2.webp",
    "s": 1,
    "x": 0,
    "y": 10
  },
  "cat-antiedad": {
    "src": "/figures/cat-antiedad.webp",
    "s": 1,
    "x": 0,
    "y": 5
  },
  "cat-longevidad": {
    "src": "/figures/cat-longevidad-v2.webp",
    "s": 1,
    "x": 10,
    "y": 0
  },
  "cat-complementarios": {
    "src": "/figures/cat-complementarios.webp",
    "s": 1,
    "x": 0,
    "y": 0
  },
  "exp-exomind": {
    "src": "/figures/exp-exomind.webp",
    "s": 1,
    "x": 0,
    "y": 0
  },
  "exp-fuego": {
    "src": "/figures/exp-fuego.webp",
    "s": 1,
    "x": 0,
    "y": 0
  },
  "exp-flotacion": {
    "src": "/figures/exp-flotacion.webp",
    "s": 1,
    "x": 0,
    "y": 0
  },
  "exp-exilis": {
    "src": "/figures/exp-exilis.webp",
    "s": 1,
    "x": 25,
    "y": 0
  },
  "exp-camina": {
    "src": "/figures/exp-camina.webp",
    "s": 1,
    "x": 30,
    "y": 0
  },
  "team-01": {
    "src": "/figures/team-01.webp",
    "s": 1,
    "x": 0,
    "y": 0
  },
  "team-02": {
    "src": "/figures/team-02.webp",
    "s": 1,
    "x": 0,
    "y": 0
  },
  "team-03": {
    "src": "/figures/team-03.webp",
    "s": 1,
    "x": 0,
    "y": 0
  },
  "team-04": {
    "src": "/figures/team-04.webp",
    "s": 1,
    "x": 0,
    "y": 0
  },
  "equipo-infra": {
    "src": "/figures/equipo-infra-v2.webp",
    "s": 1,
    "x": 20,
    "y": 0
  }
};

export type FigureSlotId = keyof typeof FIGURES;
