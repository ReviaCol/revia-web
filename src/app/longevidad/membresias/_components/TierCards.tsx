"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * TierCards — 3 membresías VIP como tiers aspiracionales (no planes de gym).
 * Sin precios (decisión abierta en sitemap → por ahora "Consultar inclusión").
 */

type Tier = {
  name: string;
  tagline: string;
  inclusions: string[];
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Salud Funcional",
    tagline: "Para quien empieza con bases sólidas.",
    inclusions: [
      "Evaluación de longevidad inicial",
      "Plan de nutrición sostenible",
      "Acceso al circuito de contraste",
      "Seguimiento trimestral",
    ],
  },
  {
    name: "Recuperación Ejecutiva",
    tagline: "Para quien vive en alta exigencia.",
    inclusions: [
      "Todo lo de Salud Funcional",
      "Sesiones de EXOMIND y flotación",
      "Protocolo de recuperación prioritario",
      "Seguimiento mensual",
    ],
  },
  {
    name: "Biohacker Élite",
    tagline: "Para el máximo performance humano.",
    inclusions: [
      "Todo lo de Recuperación Ejecutiva",
      "Medicina regenerativa con exosomas",
      "Acceso completo al santuario",
      "Acompañamiento personalizado continuo",
    ],
    featured: true,
  },
];

export function TierCards() {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      aria-label="Membresías"
      className="relative z-[2]"
      style={{ padding: "var(--hero-y-bottom) var(--gutter) var(--section-y-tight)" }}
    >
      <motion.div
        className="grid gap-5 items-stretch"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {TIERS.map((tier) => {
          const featured = tier.featured;
          return (
            <motion.div
              key={tier.name}
              variants={{
                hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: baseTransition },
              }}
              className="flex flex-col p-8"
              style={{
                background: featured ? "var(--revia-deepblue-900)" : "transparent",
                color: featured ? "var(--revia-cream-50)" : "var(--revia-deepblue-900)",
                border: featured ? "none" : "1px solid var(--revia-sky-200)",
              }}
            >
              <h2 className="font-display font-normal m-0" style={{ fontSize: "26px", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                {tier.name}
              </h2>
              <p
                className="font-body m-0 mt-2 mb-7"
                style={{ fontSize: "14px", lineHeight: 1.5, color: featured ? "rgba(251,246,241,0.8)" : "var(--revia-sky-700)" }}
              >
                {tier.tagline}
              </p>

              <ul className="list-none p-0 m-0 grid gap-3 flex-1">
                {tier.inclusions.map((inc) => (
                  <li
                    key={inc}
                    className="font-body"
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.5,
                      paddingLeft: "18px",
                      position: "relative",
                      color: featured ? "rgba(251,246,241,0.92)" : "var(--revia-deepblue-900)",
                    }}
                  >
                    <span aria-hidden="true" style={{ position: "absolute", left: 0, color: featured ? "var(--revia-sky-200)" : "var(--revia-sky-500)" }}>·</span>
                    {inc}
                  </li>
                ))}
              </ul>

              <Link
                href="/contacto?service=longevidad-bienestar"
                className="group inline-flex items-center justify-between gap-3 mt-9 px-6 py-4 transition-all duration-500 ease-out hover:-translate-y-0.5"
                style={{
                  background: featured ? "var(--revia-cream-50)" : "var(--revia-deepblue-900)",
                  color: featured ? "var(--revia-deepblue-900)" : "var(--revia-cream-50)",
                }}
              >
                <span className="font-body uppercase" style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em" }}>
                  Hablemos
                </span>
                <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-2">→</span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
