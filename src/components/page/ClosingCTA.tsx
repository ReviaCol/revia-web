"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * ClosingCTA — cierre reutilizable. Invitación, no presión.
 * warm → bloque cream-100 cálido. cool → bloque deepblue-900 (monolito oscuro).
 */

type Tone = "warm" | "cool";

const TONE = {
  warm: {
    bg: "var(--revia-cream-100)",
    title: "var(--revia-coffee-900)",
    body: "var(--revia-coffee-700)",
    btnBg: "var(--revia-coffee-900)",
    btnText: "var(--revia-cream-50)",
  },
  cool: {
    bg: "var(--revia-deepblue-900)",
    title: "var(--revia-cream-50)",
    body: "rgba(251, 246, 241, 0.78)",
    btnBg: "var(--revia-cream-50)",
    btnText: "var(--revia-deepblue-900)",
  },
} as const;

export function ClosingCTA({
  title,
  body,
  ctaLabel,
  href,
  tone = "warm",
}: {
  title: string;
  body?: string;
  ctaLabel: string;
  href: string;
  tone?: Tone;
}) {
  const c = TONE[tone];
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      aria-label="Invitación a contacto"
      className="relative z-[2]"
      style={{ padding: "var(--section-y-airy) var(--gutter)", background: c.bg }}
    >
      <div className="max-w-[820px] mx-auto text-center">
        <motion.h2
          className="font-display font-medium m-0"
          style={{
            fontSize: "clamp(34px, 4.4vw, 56px)",
            lineHeight: 1.1,
            letterSpacing: "-0.012em",
            color: c.title,
          }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={baseTransition}
        >
          {title}
        </motion.h2>

        {body && (
          <motion.p
            className="font-body m-0 mt-6 mx-auto"
            style={{ fontSize: "16px", lineHeight: 1.6, maxWidth: "500px", color: c.body }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.15 }}
          >
            {body}
          </motion.p>
        )}

        <motion.div
          className="mt-11 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...baseTransition, delay: 0.3 }}
        >
          <Link
            href={href}
            className="group inline-flex items-center gap-4 px-8 py-4 transition-all duration-500 ease-out hover:-translate-y-0.5"
            style={{
              background: c.btnBg,
              color: c.btnText,
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span className="font-body">{ctaLabel}</span>
            <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-2">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
