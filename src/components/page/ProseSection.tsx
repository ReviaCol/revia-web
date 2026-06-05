"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * ProseSection — bloque de texto largo con eyebrow + heading + párrafos.
 * Reutilizable en fichas de tratamiento, "para quién", y páginas legales.
 */

type Tone = "warm" | "cool";

const TONE = {
  warm: { eyebrow: "var(--revia-coffee-700)", title: "var(--revia-coffee-900)", body: "var(--revia-coffee-700)" },
  cool: { eyebrow: "var(--revia-sky-700)", title: "var(--revia-deepblue-900)", body: "var(--revia-sky-700)" },
} as const;

export function ProseSection({
  eyebrow,
  heading,
  paragraphs,
  tone = "warm",
  background,
  maxWidth = "720px",
}: {
  eyebrow?: string;
  heading?: string;
  paragraphs: string[];
  tone?: Tone;
  background?: string;
  maxWidth?: string;
}) {
  const c = TONE[tone];
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      aria-label={heading ?? eyebrow ?? "Sección"}
      className="relative z-[2]"
      style={{ padding: "var(--section-y-tight) var(--gutter)", background }}
    >
      <div style={{ maxWidth }}>
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
            className="font-display font-medium m-0 mb-8"
            style={{ fontSize: "clamp(28px, 3.6vw, 44px)", lineHeight: 1.12, letterSpacing: "-0.012em", color: c.title }}
            initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.12 }}
          >
            {heading}
          </motion.h2>
        )}
        <div className="grid gap-5">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              className="font-body m-0"
              style={{ fontSize: "16px", lineHeight: 1.7, color: c.body }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...baseTransition, delay: 0.18 + i * 0.08 }}
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
