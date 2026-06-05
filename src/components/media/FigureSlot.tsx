import Image from "next/image";

/**
 * FigureSlot - slot de figura editorial media-ready.
 *
 * - Si `src` es un video (.mp4/.webm/.mov) -> loop muted autoplay (con `poster`).
 * - Si `src` es una imagen -> next/image con object-cover.
 * - Si NO hay `src` -> placeholder de marca (lineas diagonales + hairline mark).
 *   El caption NO se renderiza visualmente en el placeholder - solo se
 *   expone como `aria-label`. Antes filtraba textos tipo "[ figura ... brochure
 *   pag. X ]" a produccion.
 *
 * Llena a su contenedor (absolute inset-0): el padre debe ser `position`
 * (relative/absolute) y `overflow-hidden`. Las rutas viven en `@/data/figures`.
 */

type Tone = "warm" | "cool";

export type FigureSlotProps = {
  src?: string;
  poster?: string;
  caption: string;
  tone?: Tone;
};

const VIDEO_RE = /\.(mp4|webm|mov|m4v)$/i;

export function FigureSlot({ src, poster, caption, tone = "warm" }: FigureSlotProps) {
  if (src) {
    if (VIDEO_RE.test(src)) {
      return (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={caption}
        >
          <source src={src} />
        </video>
      );
    }
    return (
      <Image
        src={src}
        alt={caption}
        fill
        className="object-cover"
        sizes="(max-width: 900px) 100vw, 50vw"
      />
    );
  }

  const bg = tone === "cool" ? "var(--revia-sky-200)" : "var(--revia-peach-200)";
  return (
    <div
      role="img"
      aria-label={caption}
      className="absolute inset-0"
      style={{
        background: `repeating-linear-gradient(135deg, rgba(89, 65, 60, 0.10) 0, rgba(89, 65, 60, 0.10) 1px, transparent 1px, transparent 9px), ${bg}`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute block"
        style={{
          bottom: "20px",
          left: "20px",
          width: "28px",
          height: "1px",
          background: "var(--revia-coffee-900)",
          opacity: 0.25,
        }}
      />
    </div>
  );
}
