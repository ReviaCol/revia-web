"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * PillarGrid — grilla editorial numerada (pilares, fases, componentes, pasos).
 * Pictograma = número grande (NO íconos médicos cliché, brand-system §8).
 */

type Tone = "warm" | "cool";
export type Pillar = { title: string; body: string };

const TONE = {
  warm: {
    eyebrow: "var(--revia-coffee-700)",
    title: "var(--revia-coffee-900)",
    body: "var(--revia-coffee-700)",
    num: "var(--revia-terracotta-500)",
    rule: "rgba(89, 65, 60, 0.16)",
  },
  cool: {
    eyebrow: "var(--revia-sky-700)",
    title: "var(--revia-deepblue-900)",
    body: "var(--revia-sky-700)",
    num: "var(--revia-sky-500)",
    rule: "var(--revia-sky-200)",
  },
} as const;

export function PillarGrid({
  eyebrow,
  heading,
  pillars,
  tone = "warm",
  columns = 3,
  background,
  id,
}: {
  eyebrow?: string;
  heading?: string;
  pillars: Pillar[];
  tone?: Tone;
  columns?: number;
  background?: string;
  id?: string;
}) {
  const c = TONE[tone];
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      id={id}
      aria-label={eyebrow ?? heading ?? "Pilares"}
      className="relative z-[2]"
      style={{ padding: "var(--section-y-tight) var(--gutter)", background, scrollMarginTop: "96px" }}
    >
      {(eyebrow || heading) && (
        <header className="revia-section-header max-w-[720px]">
          {eyebrow && (
            <motion.p
              className="font-body inline-flex items-center m-0 mb-6 uppercase"
              style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px", color: c.eyebrow }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={baseTransition}
            >
              <span aria-hidden="true" className="block" style={{ width: "28px", height: "1px", background: "var(--revia-accent)" }} />
              {eyebrow}
            </motion.p>
          )}
          {heading && (
            <motion.h2
              className="font-display font-medium m-0"
              style={{ fontSize: "clamp(30px, 4vw, 48px)", lineHeight: 1.1, letterSpacing: "-0.012em", color: c.title }}
              initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...baseTransition, delay: 0.12 }}
            >
              {heading}
            </motion.h2>
          )}
        </header>
      )}

      <motion.div
        className="grid gap-x-10 gap-y-12"
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(${260}px, 100%), 1fr))`, ["--cols" as string]: columns }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            variants={{
              hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: baseTransition },
            }}
            style={{ borderTop: `1px solid ${c.rule}`, paddingTop: "20px" }}
          >
            <div
              className="font-display"
              style={{ fontSize: "34px", lineHeight: 1, color: c.num, fontWeight: 300, marginBottom: "16px" }}
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3
              className="font-display font-normal m-0 mb-3"
              style={{ fontSize: "21px", lineHeight: 1.2, letterSpacing: "-0.01em", color: c.title }}
            >
              {p.title}
            </h3>
            <p className="font-body m-0" style={{ fontSize: "14px", lineHeight: 1.6, color: c.body }}>
              {p.body}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
