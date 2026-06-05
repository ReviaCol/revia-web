"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * EquipoCTA — cierre de /equipo. Invita a conocer al equipo en consulta.
 * Bloque cream-100 generoso + CTA hacia /contacto.
 */
export function EquipoCTA() {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      aria-labelledby="equipo-cta-heading"
      className="relative z-[2]"
      style={{ padding: "var(--section-y-tight) var(--gutter)" }}
    >
      <motion.div
        className="text-center max-w-[720px] mx-auto"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={baseTransition}
      >
        <p
          className="font-body uppercase text-coffee-700 m-0 mb-7"
          style={{ fontSize: "11px", letterSpacing: "0.28em", fontWeight: 500 }}
        >
          La mejor presentación es en persona
        </p>

        <h2
          id="equipo-cta-heading"
          className="font-display font-medium text-coffee-900 m-0"
          style={{
            fontSize: "clamp(32px, 4.4vw, 56px)",
            lineHeight: 1.08,
            letterSpacing: "-0.012em",
          }}
        >
          Conoce al equipo en consulta.
        </h2>

        <p
          className="font-body text-coffee-700 m-0 mt-6 mx-auto"
          style={{ fontSize: "16px", lineHeight: 1.6, maxWidth: "480px" }}
        >
          Cada protocolo empieza con una conversación. Agenda tu valoración y
          deja que te escuchemos primero.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            href="/contacto"
            className="group inline-flex items-center gap-4 bg-coffee-900 text-cream-50 px-8 py-4 transition-all duration-500 ease-out hover:bg-coffee-700 hover:-translate-y-0.5"
          >
            <span
              className="font-body uppercase"
              style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em" }}
            >
              Agendar consulta
            </span>
            <span
              aria-hidden="true"
              className="transition-transform duration-500 ease-out group-hover:translate-x-2"
            >
              →
            </span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
