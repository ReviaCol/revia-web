"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * PerspectivasSection — equipo multidisciplinario.
 * Grid con numerales romanos + background gradient turquesa central.
 */

const SPECIALISTS = [
  "Dermatólogos",
  "Médicos estéticos",
  "Nutricionistas",
  "Especialistas en medicina regenerativa",
  "Tricólogos",
  "Especialistas en bienestar y longevidad",
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export function PerspectivasSection() {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      aria-labelledby="pers-heading"
      className="relative z-[2] overflow-hidden"
      style={{ padding: "var(--section-y) var(--gutter)" }}
    >
      <span
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(640px, 80%)",
          height: "min(480px, 60vh)",
          background:
            "radial-gradient(ellipse at center, rgba(78, 166, 166, 0.10) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-[1] max-w-[820px] mx-auto text-center">
        <motion.p
          className="font-body inline-flex items-center justify-center text-coffee-700 m-0 mb-7 uppercase"
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
          Equipo · V
        </motion.p>

        <motion.h2
          id="pers-heading"
          className="font-display font-medium text-coffee-900 m-0"
          style={{
            fontSize: "clamp(36px, 4.6vw, 60px)",
            lineHeight: 1.05,
            letterSpacing: "-0.012em",
          }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...baseTransition, delay: 0.12 }}
        >
          Perspectivas múltiples.
          <br />
          <em
            style={{
              fontStyle: "normal",
              color: "var(--revia-terracotta-600)",
              fontWeight: 500,
            }}
          >
            Conocimiento acumulado.
          </em>
        </motion.h2>

        <motion.p
          className="font-body text-coffee-700 m-0 mt-7 mx-auto"
          style={{ fontSize: "16px", lineHeight: 1.65, maxWidth: "560px" }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...baseTransition, delay: 0.24 }}
        >
          Tu descubrimiento merece equipos completos. Un grupo que diagnostica
          desde múltiples ángulos y te acompaña con honestidad.
        </motion.p>
      </div>

      <motion.ul
        className="relative z-[1] mt-16 list-none p-0 m-0 grid gap-x-10 gap-y-12 max-w-[920px] mx-auto"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.10 } },
        }}
      >
        {SPECIALISTS.map((s, i) => (
          <motion.li
            key={s}
            variants={{
              hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: duration.long, ease: easing.outExpo },
              },
            }}
            className="relative"
            style={{
              borderTop: "1px solid rgba(89, 65, 60, 0.18)",
              paddingTop: "14px",
            }}
          >
            <div
              className="font-body uppercase mb-3"
              style={{
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.32em",
                color: "var(--revia-coffee-500)",
                opacity: 0.85,
              }}
            >
              {ROMAN[i]}
            </div>
            <p
              className="font-display text-coffee-900 m-0"
              style={{
                fontSize: "22px",
                lineHeight: 1.2,
                fontWeight: 400,
              }}
            >
              {s}
            </p>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        className="relative z-[1] text-center mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ ...baseTransition, delay: 0.5 }}
      >
        <Link
          href="/equipo"
          className="inline-flex items-center gap-3 font-body uppercase text-coffee-900 group"
          style={{ fontSize: "14px", letterSpacing: "0.10em" }}
        >
          <span className="relative pb-1">
            Conocer al equipo
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px bg-accent transition-all duration-700 ease-out group-hover:w-full"
              style={{ width: "80px" }}
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
    </section>
  );
}
