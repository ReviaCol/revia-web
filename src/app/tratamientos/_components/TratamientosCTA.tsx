"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * TratamientosCTA — cierre de la página de tratamientos.
 * Invitación a una valoración personalizada antes de cualquier protocolo.
 */
export function TratamientosCTA() {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      aria-label="Invitación a valoración personalizada"
      className="relative z-[2]"
      style={{
        padding: "var(--section-y-airy) var(--gutter)",
        background: "var(--revia-cream-100)",
      }}
    >
      <div className="max-w-[820px] mx-auto text-center">
        <motion.p
          className="font-body inline-flex items-center justify-center text-coffee-700 m-0 mb-9 uppercase"
          style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px" }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={baseTransition}
        >
          <span aria-hidden="true" className="block bg-accent" style={{ width: "28px", height: "1px" }} />
          Antes del protocolo
        </motion.p>

        <motion.p
          className="font-display font-medium text-coffee-900 m-0"
          style={{
            fontSize: "clamp(32px, 4.4vw, 56px)",
            lineHeight: 1.1,
            letterSpacing: "-0.012em",
          }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...baseTransition, delay: 0.12 }}
        >
          Cada cuerpo merece
          <br />
          un protocolo único.
        </motion.p>

        <motion.p
          className="font-body text-coffee-700 m-0 mt-6 mx-auto"
          style={{ fontSize: "16px", lineHeight: 1.6, maxWidth: "520px" }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...baseTransition, delay: 0.24 }}
        >
          La valoración inicial es una conversación con un especialista. Sin
          presión, sin compromisos, sin ventas. Solo la información que
          necesitas para decidir.
        </motion.p>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...baseTransition, delay: 0.4 }}
        >
          <Link
            href="/contacto"
            className="inline-flex items-center gap-3 px-7 py-4 transition-all duration-500 ease-out hover:-translate-y-0.5"
            style={{
              background: "var(--revia-coffee-900)",
              color: "var(--revia-cream-50)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Agendar valoración
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
