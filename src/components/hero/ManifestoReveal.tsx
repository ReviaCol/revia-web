"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * ManifestoReveal — el héroe verbal del Hero.
 * Línea 1 entra al cargar; línea 2 revela on scroll.
 */
export function ManifestoReveal() {
  return (
    <section
      aria-labelledby="manifesto-text"
      className="manifesto-section col-start-1 row-start-2 self-start z-[4] relative"
    >
      <h1
        id="manifesto-text"
        className="font-display font-medium text-coffee-900 m-0"
        style={{
          fontSize: "clamp(44px, 6.6vw, 96px)",
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
        }}
      >
        <motion.span
          className="block manifesto-line"
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: duration.long, ease: easing.outExpo, delay: 0.8 }}
        >
          Tu belleza ya existe.
        </motion.span>

        <motion.span
          className="block manifesto-line manifesto-line-indent"
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: duration.long, ease: easing.outExpo, delay: 0.12 }}
        >
          Espera ser{" "}
          <em
            style={{
              fontStyle: "normal",
              fontWeight: 500,
              color: "var(--revia-terracotta-600)",
            }}
          >
            revelada
          </em>
          .
        </motion.span>
      </h1>

      <motion.div
        aria-hidden="true"
        className="hero-mobile-band relative mt-12 overflow-hidden"
        style={{
          height: "200px",
          background: "var(--revia-terracotta-500)",
          borderRadius: "1px",
          boxShadow: "0 40px 80px -50px rgba(89, 65, 60, 0.30)",
        }}
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: duration.xlong, ease: easing.outExpo, delay: 0.5 }}
      >
        <div
          className="absolute"
          style={{
            top: "18px",
            bottom: "18px",
            left: "18px",
            width: "44%",
            background: `repeating-linear-gradient(135deg, rgba(89, 65, 60, 0.10) 0, rgba(89, 65, 60, 0.10) 1px, transparent 1px, transparent 9px), var(--revia-peach-200)`,
          }}
        />
        <span
          className="absolute font-body uppercase"
          style={{
            top: "16px",
            right: "18px",
            fontSize: "9px",
            letterSpacing: "0.4em",
            color: "rgba(251, 246, 241, 0.85)",
          }}
        >
          MMXXVI · Bogotá
        </span>
      </motion.div>
    </section>
  );
}
