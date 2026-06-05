"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * PageHero — hero reutilizable para páginas dedicadas (warm/cool).
 *
 * Sigue el idiom de marca: eyebrow con línea, headline display con palabra
 * acento, subtítulo. Respeta la regla 60/30/10 y "no mezclar warm + cool".
 */

type Tone = "warm" | "cool";

const TONE = {
  warm: {
    eyebrow: "var(--revia-coffee-700)",
    title: "var(--revia-coffee-900)",
    body: "var(--revia-coffee-700)",
    accent: "var(--revia-terracotta-600)",
  },
  cool: {
    eyebrow: "var(--revia-sky-700)",
    title: "var(--revia-deepblue-900)",
    body: "var(--revia-sky-700)",
    accent: "var(--revia-sky-700)",
  },
} as const;

export function PageHero({
  eyebrow,
  title,
  accent,
  subtitle,
  tone = "warm",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle?: string;
  tone?: Tone;
}) {
  const c = TONE[tone];

  // Resalta `accent` dentro del título si está presente.
  let titleNode: React.ReactNode = title;
  if (accent && title.includes(accent)) {
    const [before, after] = title.split(accent);
    titleNode = (
      <>
        {before}
        <em style={{ fontStyle: "normal", fontWeight: 500, color: c.accent }}>
          {accent}
        </em>
        {after}
      </>
    );
  }

  return (
    <section
      aria-label={eyebrow}
      className="relative z-[2]"
      style={{
        padding: "var(--hero-y-top) var(--gutter) var(--hero-y-bottom)",
      }}
    >
      <motion.p
        className="font-body inline-flex items-center m-0 mb-8 uppercase"
        style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px", color: c.eyebrow }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.medium, ease: easing.outExpo }}
      >
        <span aria-hidden="true" className="block" style={{ width: "28px", height: "1px", background: "var(--revia-accent)" }} />
        {eyebrow}
      </motion.p>

      <motion.h1
        className="font-display font-medium m-0"
        style={{
          fontSize: "clamp(40px, 5.6vw, 76px)",
          lineHeight: 1.05,
          letterSpacing: "-0.014em",
          maxWidth: "960px",
          color: c.title,
        }}
        initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: duration.long, ease: easing.outExpo, delay: 0.15 }}
      >
        {titleNode}
      </motion.h1>

      {subtitle && (
        <motion.p
          className="font-body m-0 mt-7"
          style={{ fontSize: "17px", lineHeight: 1.6, maxWidth: "580px", color: c.body }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.long, ease: easing.outExpo, delay: 0.28 }}
        >
          {subtitle}
        </motion.p>
      )}
    </section>
  );
}
