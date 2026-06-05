import Image from "next/image";
import { FIGURES } from "@/data/site-figures";

/**
 * ImageSlot — port del <image-slot> del mockup Claude Design.
 *
 * Tres modos:
 *   1. Video: si el slot define `video: "ruta.mp4"`, renderiza <video> loop
 *      muted autoplay playsinline. Si hay `src`, ese es el poster.
 *   2. Imagen: next/image con object-position desde s/x/y.
 *   3. Placeholder: líneas diagonales sobre arena/menta/coffee + hairline.
 *
 * Convención s/x/y (image-slot.js): x,y son offsets en % desde el centro
 * del frame. CSS object-position = (50 - x)% (50 - y)%.
 *
 * Es absolute inset-0; el padre debe ser position:relative + overflow:hidden.
 */

type Tone = "warm" | "cool" | "dark";

export function ImageSlot({
  slot,
  alt,
  tone = "warm",
  priority = false,
}: {
  slot?: string;
  alt: string;
  tone?: Tone;
  priority?: boolean;
}) {
  const fig = slot ? FIGURES[slot] : undefined;

  // Modo VIDEO — si el slot define video, prioridad sobre imagen estática
  if (fig && fig.video) {
    const posX = Math.max(0, Math.min(100, 50 - fig.x));
    const posY = Math.max(0, Math.min(100, 50 - fig.y));
    return (
      <video
        className="absolute inset-0 h-full w-full"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={fig.src}
        aria-label={alt}
        style={{
          objectFit: "cover",
          objectPosition: `${posX}% ${posY}%`,
        }}
      >
        <source src={fig.video} type="video/mp4" />
      </video>
    );
  }

  // Modo IMAGEN
  if (fig) {
    const posX = Math.max(0, Math.min(100, 50 - fig.x));
    const posY = Math.max(0, Math.min(100, 50 - fig.y));
    const scale = fig.s && fig.s !== 1 ? `scale(${fig.s})` : undefined;
    return (
      <Image
        src={fig.src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        style={{
          objectPosition: `${posX}% ${posY}%`,
          ...(scale ? { transform: scale } : {}),
        }}
        sizes="(max-width: 900px) 100vw, 50vw"
      />
    );
  }

  // Modo PLACEHOLDER
  const bg =
    tone === "cool"
      ? "var(--menta)"
      : tone === "dark"
      ? "var(--ink-900)"
      : "var(--arena)";
  const lineColor =
    tone === "dark" ? "rgba(217,202,193,.10)" : "rgba(89,65,60,.10)";

  return (
    <div
      role="img"
      aria-label={alt}
      className="absolute inset-0"
      style={{
        background: `repeating-linear-gradient(135deg, ${lineColor} 0, ${lineColor} 1px, transparent 1px, transparent 9px), ${bg}`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute block"
        style={{
          bottom: "18px",
          left: "18px",
          width: "28px",
          height: "1px",
          background:
            tone === "dark" ? "rgba(217,202,193,.35)" : "rgba(89,65,60,.35)",
        }}
      />
    </div>
  );
}
