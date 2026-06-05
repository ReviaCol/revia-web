"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * FilosofiaBackdrop — capa de fondo que respira con el scroll.
 *
 * Tres elementos:
 *   1. Gradient radial warm en la esquina superior izquierda — drift sutil.
 *   2. Gradient radial peach en el centro-derecho — drift inverso.
 *   3. Línea vertical hairline (a la altura del gutter izquierdo) que sirve
 *      como "rule editorial" del documento.
 *
 * Es `fixed` y `pointer-events: none`. Se monta una sola vez en la página de
 * Filosofía y respira a lo largo de todo el scroll.
 *
 * Reduced-motion: las transforms se anulan vía CSS global (clase `revia-respect-reduce`).
 */
export function FilosofiaBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Drift sutil — los dos gradients se mueven en direcciones opuestas a lo
  // largo del progreso del scroll. Las amplitudes son pequeñas (no es paralax
  // protagónico, es "respiración").
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacityRule = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {/* Gradient radial warm superior izquierdo */}
      <motion.div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "70%",
          height: "60%",
          background:
            "radial-gradient(ellipse at 30% 30%, rgba(140, 81, 59, 0.10) 0%, transparent 70%)",
          y: y1,
          willChange: "transform",
        }}
      />

      {/* Gradient radial peach centro derecho */}
      <motion.div
        style={{
          position: "absolute",
          top: "30%",
          right: "-15%",
          width: "65%",
          height: "55%",
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(217, 202, 193, 0.32) 0%, transparent 70%)",
          y: y2,
          willChange: "transform",
        }}
      />

      {/* Línea vertical editorial — visible solo en desktop. */}
      <motion.span
        className="hidden lg:block"
        style={{
          position: "absolute",
          top: "var(--hero-y-top)",
          bottom: "var(--section-y)",
          left: "calc(var(--gutter) - 24px)",
          width: "1px",
          background: "rgba(89, 65, 60, 0.10)",
          opacity: opacityRule,
        }}
      />
    </div>
  );
}
