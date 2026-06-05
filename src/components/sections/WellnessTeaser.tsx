"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";
import { FigureSlot } from "@/components/media/FigureSlot";
import { FIGURES } from "@/data/figures";

/**
 * WellnessTeaser — sección 04 de la home.
 *
 * Cambia a UNIVERSO COOL: paleta sky/deepblue. Es el cambio cromático más
 * importante de la home — separa la oferta estética (warm) del universo
 * de longevidad y bienestar (cool).
 *
 * Replica artboard #07 del overview pero condensado para teaser.
 */

const PILARES = [
  "Nutrición",
  "Actividad",
  "Sueño",
  "Estrés",
  "Carga tóxica",
  "Conexiones",
] as const;

export function WellnessTeaser() {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      id="longevidad"
      aria-labelledby="wellness-heading"
      className="relative z-[2] overflow-hidden"
      style={{
        padding: "var(--section-y) var(--gutter)",
        background: "var(--revia-sky-50)",
        color: "var(--revia-deepblue-900)",
      }}
    >
      <div className="home-split grid gap-12">
        {/* Columna texto */}
        <div className="max-w-[560px]">
          <motion.p
            className="font-body inline-flex items-center m-0 mb-9 uppercase"
            style={{
              fontSize: "12px",
              letterSpacing: "0.2em",
              gap: "14px",
              color: "var(--revia-sky-700)",
            }}
            initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={baseTransition}
          >
            <span
              aria-hidden="true"
              className="block"
              style={{
                width: "28px",
                height: "1px",
                background: "var(--revia-accent)",
              }}
            />
            Unidad de Bienestar
          </motion.p>

          <motion.h2
            id="wellness-heading"
            className="font-display font-medium m-0"
            style={{
              fontSize: "clamp(40px, 5vw, 60px)",
              lineHeight: 1.05,
              letterSpacing: "-0.012em",
              color: "var(--revia-deepblue-900)",
            }}
            initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.12 }}
          >
            Redefiniendo<br />tu edad biológica.
          </motion.h2>

          <motion.p
            className="font-body m-0 mt-8 max-w-[420px]"
            style={{
              fontSize: "15px",
              lineHeight: 1.6,
              color: "var(--revia-sky-700)",
            }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.24 }}
          >
            Un universo aparte. Lenguaje sensorial, paleta fría, herramientas
            de biohacking y performance humana. Tu salud, tu mayor ventaja
            competitiva.
          </motion.p>

          {/* Grid de 6 pilares */}
          <motion.div
            className="wellness-pillars grid gap-3 mt-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {PILARES.map((pilar, i) => (
              <motion.div
                key={pilar}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: baseTransition },
                }}
                style={{
                  borderTop: "1px solid var(--revia-sky-200)",
                  paddingTop: "10px",
                }}
              >
                <div
                  className="font-body"
                  style={{
                    fontSize: "9px",
                    fontWeight: 500,
                    letterSpacing: "0.16em",
                    color: "var(--revia-sky-700)",
                    textTransform: "uppercase",
                  }}
                >
                  0{i + 1}
                </div>
                <div
                  className="font-display"
                  style={{
                    fontSize: "16px",
                    lineHeight: 1.2,
                    color: "var(--revia-deepblue-900)",
                    marginTop: "4px",
                  }}
                >
                  {pilar}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.7 }}
          >
            <Link
              href="/longevidad"
              className="inline-flex items-center gap-2 font-body uppercase group"
              style={{
                fontSize: "14px",
                letterSpacing: "0.08em",
                color: "var(--revia-deepblue-900)",
              }}
            >
              <span className="relative pb-1">
                Conocer la Unidad de Bienestar
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px transition-all duration-500 ease-out group-hover:w-full"
                  style={{
                    width: "64px",
                    background: "var(--revia-accent)",
                  }}
                />
              </span>
              <span
                aria-hidden="true"
                className="transition-transform duration-500 ease-out group-hover:translate-x-2"
              >
                →
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Columna visual: monolito sky-500 + figura placeholder */}
        <motion.div
          className="relative aspect-[3/4] max-h-[640px]"
          style={{ background: "var(--revia-sky-500)" }}
          initial={{ opacity: 0, scale: 0.985 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: duration.xlong, ease: easing.outExpo }}
        >
          <div className="absolute inset-7 overflow-hidden">
            <FigureSlot {...FIGURES.longevidadTeaser} caption="[ figura cielo · brochure pág. 6 ]" tone="cool" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
