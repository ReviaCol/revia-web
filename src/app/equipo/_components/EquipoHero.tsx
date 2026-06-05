"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * EquipoHero — hero de /equipo. Tono ritual, sin reclamar trayectoria histórica.
 * Cifra segura: "perspectivas múltiples · conocimiento acumulado" (manifiesto).
 * NUNCA años de experiencia que sumen >20, NUNCA La Font, NUNCA cirugía.
 */
export function EquipoHero() {
  return (
    <section
      aria-label="Equipo médico"
      className="relative z-[2]"
      style={{
        padding: "var(--hero-y-top) var(--gutter) var(--hero-y-bottom)",
      }}
    >
      <div className="max-w-[860px]">
        <motion.p
          className="font-body inline-flex items-center text-coffee-700 m-0 mb-8 uppercase"
          style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.medium, ease: easing.outExpo }}
        >
          <span aria-hidden="true" className="block bg-accent" style={{ width: "28px", height: "1px" }} />
          Equipo
        </motion.p>

        <motion.h1
          className="font-display font-medium text-coffee-900 m-0"
          style={{
            fontSize: "clamp(38px, 5.4vw, 72px)",
            lineHeight: 1.06,
            letterSpacing: "-0.014em",
          }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: duration.long, ease: easing.outExpo, delay: 0.15 }}
        >
          Perspectivas{" "}
          <em
            style={{
              fontStyle: "normal",
              fontWeight: 500,
              color: "var(--revia-terracotta-600)",
            }}
          >
            múltiples
          </em>
          .
          <br />
          Conocimiento acumulado.
        </motion.h1>

        <motion.p
          className="font-body text-coffee-700 m-0 mt-7"
          style={{ fontSize: "17px", lineHeight: 1.6, maxWidth: "560px" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.long, ease: easing.outExpo, delay: 0.28 }}
        >
          Equipos multidisciplinarios completos. Dermatólogos, médicos estéticos,
          nutricionistas y especialistas en medicina regenerativa. Tu
          descubrimiento merece más de una mirada.
        </motion.p>
      </div>
    </section>
  );
}
