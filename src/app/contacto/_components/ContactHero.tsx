"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * ContactHero — hero de /contacto.
 * Serif grande, tono manifesto poético. Universo warm (cream + coffee).
 */
export function ContactHero() {
  return (
    <section
      aria-label="Contacto"
      className="relative z-[2]"
      style={{
        padding: "var(--hero-y-top) var(--gutter) var(--hero-y-bottom)",
      }}
    >
      <div className="max-w-[820px]">
        <motion.p
          className="font-body inline-flex items-center text-coffee-700 m-0 mb-8 uppercase"
          style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.medium, ease: easing.outExpo }}
        >
          <span aria-hidden="true" className="block bg-accent" style={{ width: "28px", height: "1px" }} />
          Contacto
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
          Antes de cualquier tratamiento,
          <br />
          una{" "}
          <em
            style={{
              fontStyle: "normal",
              fontWeight: 500,
              color: "var(--revia-terracotta-600)",
            }}
          >
            conversación
          </em>
          .
        </motion.h1>

        <motion.p
          className="font-body text-coffee-700 m-0 mt-7"
          style={{ fontSize: "17px", lineHeight: 1.6, maxWidth: "520px" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.long, ease: easing.outExpo, delay: 0.28 }}
        >
          Cuéntanos qué buscas revelar. Te respondemos en menos de 24 horas, con
          el cuidado que mereces.
        </motion.p>
      </div>
    </section>
  );
}
