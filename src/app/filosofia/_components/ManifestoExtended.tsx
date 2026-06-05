"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * ManifestoExtended — Hero de la página Filosofía.
 * 3 estrofas con numerales romanos gigantes detrás (parallax sutil).
 * Header con scroll-driven fade. Ritmo apretado.
 */

type ManifestoStrophe = {
  numeral: string;
  eyebrow: string;
  lines: string[];
  accent?: string;
};

const STROPHES: ManifestoStrophe[] = [
  {
    numeral: "I",
    eyebrow: "Manifiesto · i",
    lines: ["Tu belleza ya existe.", "Espera ser revelada."],
    accent: "revelada",
  },
  {
    numeral: "II",
    eyebrow: "Manifiesto · ii",
    lines: [
      "Buscamos tu verdadera esencia",
      "para revelarla en tu mejor expresión.",
    ],
    accent: "esencia",
  },
  {
    numeral: "III",
    eyebrow: "Manifiesto · iii",
    lines: [
      "La naturalidad guía cada protocolo.",
      "Tu resultado se siente como salud radiante,",
      "como vitalidad auténtica.",
    ],
    accent: "naturalidad",
  },
];

export function ManifestoExtended() {
  const headerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.7]);

  return (
    <section
      aria-label="Manifiesto"
      className="relative z-[2]"
      style={{
        padding:
          "var(--hero-y-top) var(--gutter) var(--section-y-tight) var(--gutter)",
      }}
    >
      <motion.header
        ref={headerRef}
        className="mb-16 max-w-[820px]"
        style={{ y: headerY, opacity: headerOpacity, willChange: "transform" }}
      >
        <motion.p
          className="font-body inline-flex items-center text-coffee-700 m-0 mb-8 uppercase"
          style={{ fontSize: "12px", letterSpacing: "0.28em", gap: "14px" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.medium, ease: easing.outExpo }}
        >
          <span
            aria-hidden="true"
            className="block bg-accent"
            style={{ width: "32px", height: "1px" }}
          />
          Filosofía · MMXXVI
        </motion.p>

        <motion.h1
          className="font-display font-medium text-coffee-900 m-0"
          style={{
            fontSize: "clamp(40px, 5.6vw, 72px)",
            lineHeight: 1.08,
            letterSpacing: "-0.014em",
          }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: duration.long, ease: easing.outExpo, delay: 0.2 }}
        >
          La razón
          <span className="block" style={{ paddingLeft: "clamp(40px, 8vw, 120px)" }}>
            detrás de
          </span>
          <span className="block" style={{ paddingLeft: "clamp(80px, 16vw, 220px)" }}>
            <em
              style={{
                fontStyle: "normal",
                fontWeight: 500,
                color: "var(--revia-terracotta-600)",
              }}
            >
              cada gesto
            </em>
            .
          </span>
        </motion.h1>
      </motion.header>

      <div className="grid gap-20 md:gap-24 lg:gap-32">
        {STROPHES.map((s, i) => (
          <Strophe key={i} strophe={s} index={i} />
        ))}
      </div>
    </section>
  );
}

function Strophe({
  strophe,
  index,
}: {
  strophe: ManifestoStrophe;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const numeralY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <motion.div
      ref={ref}
      className="relative max-w-[920px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.10 } },
      }}
    >
      <motion.span
        aria-hidden="true"
        className="hidden lg:block font-display select-none pointer-events-none"
        style={{
          position: "absolute",
          top: "-40px",
          left: index % 2 === 0 ? "-120px" : "auto",
          right: index % 2 === 1 ? "-80px" : "auto",
          fontSize: "clamp(180px, 22vw, 280px)",
          lineHeight: 0.85,
          fontWeight: 300,
          color: "rgba(89, 65, 60, 0.06)",
          letterSpacing: "-0.02em",
          y: numeralY,
          willChange: "transform",
          zIndex: 0,
        }}
      >
        {strophe.numeral}
      </motion.span>

      <div className="relative z-[1]">
        <motion.p
          className="font-body inline-flex items-center text-coffee-700 m-0 mb-7 uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.32em", gap: "14px" }}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0, transition: baseTransition },
          }}
        >
          <span
            aria-hidden="true"
            className="block bg-accent"
            style={{ width: "28px", height: "1px" }}
          />
          {strophe.eyebrow}
        </motion.p>

        <p
          className="font-display font-medium text-coffee-900 m-0"
          style={{
            fontSize: "clamp(34px, 4.6vw, 64px)",
            lineHeight: 1.14,
            letterSpacing: "-0.012em",
          }}
        >
          {strophe.lines.map((line, idx) => (
            <motion.span
              key={idx}
              className="block"
              style={{
                paddingLeft:
                  idx > 0
                    ? `clamp(20px, ${idx * 4}vw, ${idx * 60}px)`
                    : 0,
              }}
              variants={{
                hidden: { opacity: 0, filter: "blur(8px)", y: 14 },
                visible: {
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  transition: baseTransition,
                },
              }}
            >
              {strophe.accent && line.includes(strophe.accent) ? (
                <>
                  {line.split(strophe.accent)[0]}
                  <em
                    style={{
                      fontStyle: "normal",
                      fontWeight: 500,
                      color: "var(--revia-terracotta-600)",
                    }}
                  >
                    {strophe.accent}
                  </em>
                  {line.split(strophe.accent)[1]}
                </>
              ) : (
                line
              )}
            </motion.span>
          ))}
        </p>
      </div>
    </motion.div>
  );
}
