# Figuras (video / imagen) de la web Reviá

Deja aquí los archivos de figura y actívalos en `src/data/figures.ts`.

## Cómo activar un slot
1. Copia el archivo a esta carpeta, p. ej. `hero-home.mp4` (o `.jpg`).
2. En `05-src/src/data/figures.ts`, pon la ruta en el slot correspondiente:
   ```ts
   heroHome: { src: "/figures/hero-home.mp4", poster: "/figures/hero-home.jpg" },
   ```
3. Guarda. El slot mostrará el video/imagen; si lo dejas en `undefined`, sigue el placeholder.

## Recomendaciones (alineadas al brandbook)
- **Formato vertical ~3:4** (los slots son verticales).
- **Video**: muted, loop, 6–12 s, sin audio, < 4–6 MB (comprimido H.264/.mp4 o .webm). Siempre con `poster` (1er frame) para proteger el LCP.
- **Paleta**: tonos cálidos (cream/terracota-marrón/arena) para slots warm; cielo/agua/menta para el slot cool (Longevidad). Nada de naranjas saturados fuera del brandbook.
- **Contenido**: figura contemplativa / piel / agua / luz — estilo editorial del brochure, no clínico.

## Slots actuales
- `heroHome` — hero de la home (warm).
- `filosofiaNaturalidad` — /filosofia, "Naturalidad como guía" (warm).
- `longevidadTeaser` — home, teaser Longevidad (cool).
