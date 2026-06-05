/**
 * Rutas de los slots de figura (video o imagen) de la web.
 *
 * Para ACTIVAR un slot: deja el archivo en `public/figures/` y pon su ruta en
 * `src` (p. ej. "/figures/hero-home.mp4" o "/figures/hero-home.jpg"). Si es
 * video, agrega un `poster` (imagen que se ve mientras carga / cuida el LCP).
 * Déjalo en `undefined` para mostrar el placeholder de marca.
 *
 * El componente FigureSlot detecta video por extensión (.mp4/.webm/.mov).
 */

export type FigureRef = { src?: string; poster?: string };

export const FIGURES: Record<string, FigureRef> = {
  // Hero de la home (monolito desktop). Vertical, ~3:4.
  heroHome: { src: undefined, poster: undefined },
  // /filosofia — sección "Naturalidad como guía". Vertical 3:4.
  filosofiaNaturalidad: { src: undefined, poster: undefined },
  // Home — teaser de Longevidad (universo cool). Vertical 3:4.
  longevidadTeaser: { src: undefined, poster: undefined },
};
