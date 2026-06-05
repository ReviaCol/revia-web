"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";
import { FigureSlot } from "@/components/media/FigureSlot";
import { FIGURES } from "@/data/figures";

/**
 * NaturalidadSection — "Naturalidad como guía".
 *
 * Narrativa AFIRMATIVA (corregida 2026-06-03): los principios se enuncian como
 * lo que SÍ hacemos, no como negaciones. Versión anterior decía "No prometemos
 * transformación radical / No imponemos / No usamos" — defensivo y débil.
 * Ahora todos los principios afirman acción y postura.
 */

const PRINCIPLES = [
  "Revelamos lo que tu cuerpo ya conoce.",
  "Honramos la singularidad de cada rostro.",
  "Activamos tu propia biología.",
  "Acompañamos tu ritmo, no lo forzamos.",
];

export function NaturalidadSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const figureY = useTransform(scrollYProgress, [0, 1], [-20, 40]);
  const monolithDriftY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="nat-heading"
      className="relative z-[2] overflow-hidden"
      style={{
        padding: "var(--section-y) var(--gutter)",
        background: "var(--revia-cream-100)",
      }}
    >
      <div
        className="grid gap-12 lg:gap-16 items-start"
        style={{ gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)" }}
      >
        <motion.div
          className="relative max-w-[600px]"
          style={{ y: textY, willChange: "transform" }}
        >
          <motion.p
            className="font-body inline-flex items-center text-coffee-700 m-0 mb-7 uppercase"
            style={{ fontSize: "12px", letterSpacing: "0.28em", gap: "14px" }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={baseTransition}
          >
            <span
              aria-hidden="true"
              className="block bg-accent"
              style={{ width: "28px", height: "1px" }}
            />
            Naturalidad · IV
          </motion.p>

          <motion.h2
            id="nat-heading"
            className="font-display font-medium text-coffee-900 m-0"
            style={{
              fontSize: "clamp(34px, 4.2vw, 56px)",
              lineHeight: 1.08,
              letterSpacing: "-0.012em",
            }}
            initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.12 }}
          >
            Tu resultado se siente
            <br />
            como{" "}
            <em
              style={{
                fontStyle: "normal",
                color: "var(--revia-terracotta-600)",
                fontWeight: 500,
              }}
            >
              salud radiante
            </em>
            .
          </motion.h2>

          <motion.p
            className="font-body text-coffee-700 m-0 mt-6 max-w-[500px]"
            style={{ fontSize: "15px", lineHeight: 1.65 }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.24 }}
          >
            Cuatro principios guían cada protocolo. No son promesas: son la
            forma en que entendemos la belleza.
          </motion.p>

          <motion.ul
            className="mt-10 grid gap-5 max-w-[500px] list-none p-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.10, delayChildren: 0.25 },
              },
            }}
          >
            {PRINCIPLES.map((line, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-4"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0, transition: baseTransition },
                }}
              >
                <span
                  aria-hidden="true"
                  className="block bg-accent mt-3 flex-none"
                  style={{ width: "16px", height: "1px" }}
                />
                <span
                  className="font-body text-coffee-700"
                  style={{ fontSize: "16px", lineHeight: 1.5 }}
                >
                  {line}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <div
          className="relative"
          style={{ minHeight: "clamp(420px, 60vw, 680px)" }}
        >
          <motion.span
            aria-hidden="true"
            className="absolute block"
            style={{
              top: "-32px",
              right: "-24px",
              width: "55%",
              height: "65%",
              background: "var(--revia-peach-200)",
              y: monolithDriftY,
              willChange: "transform",
              zIndex: 0,
            }}
          />

          <motion.div
            className="relative aspect-[3/4] max-h-[680px] overflow-hidden"
            style={{
              boxShadow: "0 40px 80px -50px rgba(89, 65, 60, 0.30)",
              y: figureY,
              willChange: "transform",
              zIndex: 1,
            }}
            initial={{ opacity: 0, filter: "blur(10px)", y: 16 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: duration.xlong, ease: easing.outExpo }}
          >
            <FigureSlot
              {...FIGURES.filosofiaNaturalidad}
              caption="Figura contemplativa — naturalidad como guía"
              tone="warm"
            />

            <span
              aria-hidden="true"
              className="absolute font-body uppercase text-cream-50"
              style={{
                top: "24px",
                right: "20px",
                fontSize: "9px",
                letterSpacing: "0.4em",
                opacity: 0.85,
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              naturalidad · IV
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
