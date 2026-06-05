"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * PhilosophyTeaser — sección 02 de la home.
 *
 * Continúa el manifiesto con un eyebrow + frase escultórica, acompañada de
 * un número monolítico "20" sobre bloque terracotta. CTA hacia /filosofia.
 *
 * Lenguaje "no invasivo": NO menciona cirugía ni quirúrgico (regla dura
 * del proyecto). El "20" referencia los años heredados de rigor médico.
 */
export function PhilosophyTeaser() {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      id="filosofia"
      aria-labelledby="philosophy-heading"
      className="relative z-[2] overflow-hidden"
      style={{ padding: "var(--section-y) var(--gutter)" }}
    >
      <div className="home-split grid gap-12 items-center">
        {/* Columna texto */}
        <div className="max-w-[640px]">
          <motion.p
            className="font-body inline-flex items-center text-coffee-700 m-0 mb-9 uppercase"
            style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px" }}
            initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={baseTransition}
          >
            <span aria-hidden="true" className="block bg-accent" style={{ width: "28px", height: "1px" }} />
            Filosofía · iii
          </motion.p>

          <h2
            id="philosophy-heading"
            className="font-display font-medium text-coffee-900 m-0"
            style={{
              fontSize: "clamp(36px, 4.4vw, 60px)",
              lineHeight: 1.1,
              letterSpacing: "-0.012em",
            }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...baseTransition, delay: 0.12 }}
            >
              20 años de rigor médico
            </motion.span>
            <motion.span
              className="block stagger-indent-sm"
              initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...baseTransition, delay: 0.24 }}
            >
              nutren cada gesto
            </motion.span>
            <motion.span
              className="block stagger-indent-lg"
              initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...baseTransition, delay: 0.36 }}
            >
              <em
                style={{
                  fontStyle: "normal",
                  fontWeight: 500,
                  color: "var(--revia-terracotta-600)",
                }}
              >
                regenerativo
              </em>
              .
            </motion.span>
          </h2>

          <motion.p
            className="font-body text-coffee-700 m-0 mt-8 max-w-[440px]"
            style={{ fontSize: "15px", lineHeight: 1.6 }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.5 }}
          >
            Tecnología que potencia tu biología. Células madre, exosomas,
            bioestimuladores y plasma rico en plaquetas. Ningún procedimiento
            invasivo: solo activamos lo que tu cuerpo ya conoce.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.7 }}
            className="mt-10"
          >
            <Link
              href="/filosofia"
              className="inline-flex items-center gap-2 font-body uppercase text-coffee-900 group"
              style={{ fontSize: "14px", letterSpacing: "0.08em" }}
            >
              <span className="relative pb-1">
                Conocer la filosofía completa
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px bg-accent transition-all duration-500 ease-out group-hover:w-full"
                  style={{ width: "64px" }}
                />
              </span>
              <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-2">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Columna número escultórico */}
        <motion.div
          className="relative flex items-center justify-center aspect-[3/4]"
          style={{
            background: "var(--revia-terracotta-500)",
            boxShadow: "0 80px 120px -60px rgba(89, 65, 60, 0.22)",
          }}
          initial={{ opacity: 0, scale: 0.985 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: duration.xlong, ease: easing.outExpo }}
        >
          <span
            className="font-display font-light text-cream-50 select-none"
            style={{
              fontSize: "clamp(180px, 22vw, 320px)",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
            }}
            aria-hidden="true"
          >
            20
          </span>
          <span
            className="absolute font-body uppercase text-cream-50"
            style={{
              top: "32px",
              left: "32px",
              fontSize: "10px",
              letterSpacing: "0.4em",
              opacity: 0.85,
            }}
          >
            años heredados
          </span>
        </motion.div>
      </div>
    </section>
  );
}
