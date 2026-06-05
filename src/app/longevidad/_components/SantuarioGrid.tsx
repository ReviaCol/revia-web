"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";
import type { Treatment } from "@/lib/treatments";

/**
 * SantuarioGrid — grid de las experiencias del Santuario Sensorial (universo cool).
 * Cada card enlaza a /longevidad/[id]. Bloques sky-500/deepblue, tono sensorial.
 */
export function SantuarioGrid({ experiences }: { experiences: Treatment[] }) {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      aria-labelledby="santuario-heading"
      className="relative z-[2]"
      style={{ padding: "var(--section-y-tight) var(--gutter)" }}
    >
      <header className="revia-section-header max-w-[720px]">
        <motion.p
          className="font-body inline-flex items-center m-0 mb-6 uppercase"
          style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px", color: "var(--revia-sky-700)" }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={baseTransition}
        >
          <span aria-hidden="true" className="block" style={{ width: "28px", height: "1px", background: "var(--revia-accent)" }} />
          Tu santuario sensorial
        </motion.p>
        <motion.h2
          id="santuario-heading"
          className="font-display font-medium m-0"
          style={{ fontSize: "clamp(30px, 4vw, 48px)", lineHeight: 1.1, letterSpacing: "-0.012em", color: "var(--revia-deepblue-900)" }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...baseTransition, delay: 0.12 }}
        >
          Herramientas para tu mejor versión.
        </motion.h2>
      </header>

      <motion.div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.id}
            variants={{
              hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: baseTransition },
            }}
          >
            <Link
              href={`/longevidad/${exp.id}`}
              className="group relative flex flex-col justify-end h-full p-7 transition-transform duration-500 ease-out hover:-translate-y-1"
              style={{
                background: i % 2 === 0 ? "var(--revia-sky-500)" : "var(--revia-deepblue-900)",
                color: "var(--revia-cream-50)",
                minHeight: "clamp(240px, 30vw, 300px)",
                aspectRatio: "4 / 3",
              }}
            >
              <span
                className="absolute font-body uppercase"
                style={{ top: "22px", left: "28px", fontSize: "9px", letterSpacing: "0.28em", opacity: 0.75 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display font-normal m-0 mb-3" style={{ fontSize: "clamp(24px, 2.4vw, 30px)", lineHeight: 1.1 }}>
                {exp.name}
              </h3>
              <p className="font-body m-0" style={{ fontSize: "13px", lineHeight: 1.5, opacity: 0.85 }}>
                {exp.summary}
              </p>
              <span
                className="font-body uppercase mt-6 inline-flex items-center gap-2"
                style={{ fontSize: "10px", letterSpacing: "0.16em" }}
              >
                Explorar
                <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-2">→</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
