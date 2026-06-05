"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * FAQ — preguntas frecuentes. Usa <details>/<summary> nativo (accesible,
 * navegable por teclado, sin JS). Tono honesto y empático (brand voice §7).
 */

type Tone = "warm" | "cool";
export type QA = { q: string; a: string };

const TONE = {
  warm: {
    eyebrow: "var(--revia-coffee-700)",
    title: "var(--revia-coffee-900)",
    body: "var(--revia-coffee-700)",
    rule: "rgba(89, 65, 60, 0.16)",
  },
  cool: {
    eyebrow: "var(--revia-sky-700)",
    title: "var(--revia-deepblue-900)",
    body: "var(--revia-sky-700)",
    rule: "var(--revia-sky-200)",
  },
} as const;

export function FAQ({
  eyebrow = "Preguntas frecuentes",
  heading,
  items,
  tone = "warm",
  background,
}: {
  eyebrow?: string;
  heading?: string;
  items: QA[];
  tone?: Tone;
  background?: string;
}) {
  const c = TONE[tone];
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      aria-label="Preguntas frecuentes"
      className="relative z-[2]"
      style={{ padding: "var(--section-y-tight) var(--gutter)", background }}
    >
      <div className="max-w-[820px]">
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

        {heading && (
          <motion.h2
            className="font-display font-medium m-0 mb-10"
            style={{ fontSize: "clamp(30px, 4vw, 48px)", lineHeight: 1.1, letterSpacing: "-0.012em", color: c.title }}
            initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.12 }}
          >
            {heading}
          </motion.h2>
        )}

        <div>
          {items.map((item) => (
            <details
              key={item.q}
              className="group"
              style={{ borderTop: `1px solid ${c.rule}` }}
            >
              <summary
                className="font-display flex justify-between items-center gap-6 cursor-pointer list-none"
                style={{
                  fontSize: "clamp(18px, 2vw, 22px)",
                  lineHeight: 1.3,
                  color: c.title,
                  padding: "22px 0",
                }}
              >
                {item.q}
                <span
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-300 group-open:rotate-45"
                  style={{ fontSize: "24px", fontWeight: 300, color: c.body }}
                >
                  +
                </span>
              </summary>
              <p
                className="font-body m-0"
                style={{ fontSize: "15px", lineHeight: 1.65, color: c.body, padding: "0 0 24px", maxWidth: "640px" }}
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
