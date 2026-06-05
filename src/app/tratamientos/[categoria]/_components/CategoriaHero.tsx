"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * CategoriaHero — hero dedicado de las subcategorías de tratamientos
 * (/tratamientos/facial · /corporal). "Continuidad celeste en cream" (ADR 0008):
 * trae el vocabulario de la Carta celeste al mundo cream — eyebrow con tick
 * turquesa, acento itálico en turquesa profunda (AA en texto grande; el menta
 * de la constelación no pasa AA sobre cream), eco celeste decorativo y un
 * barrido turquesa de entrada (cadencia de la constelación).
 *
 * Hero PROPIO (no toca el PageHero global, usado por otras páginas).
 */
export function CategoriaHero({
  eyebrow,
  title,
  accent,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle?: string;
}) {
  // Resalta `accent` dentro del título en itálica turquesa profunda.
  let titleNode: React.ReactNode = title;
  if (accent && title.includes(accent)) {
    const [before, after] = title.split(accent);
    titleNode = (
      <>
        {before}
        <em
          className="font-display"
          style={{ fontStyle: "italic", fontWeight: 400, color: "var(--revia-turquesa-700)" }}
        >
          {accent}
        </em>
        {after}
      </>
    );
  }

  return (
    <section
      aria-label={eyebrow}
      className="relative z-[2] overflow-hidden"
      style={{ padding: "var(--hero-y-top) var(--gutter) var(--hero-y-bottom)" }}
    >
      {/* Barrido turquesa de entrada (una vez) — cadencia de la constelación */}
      <span key="hero-sweep" className="celeste-sweep" aria-hidden="true" />

      {/* Eco celeste decorativo (estrellas + línea de constelación) */}
      <svg
        className="celeste-echo"
        viewBox="0 0 320 220"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          className="celeste-echo-line"
          d="M 28,150 Q 110,40 180,96 T 296,58"
          stroke="var(--revia-turquesa-500)"
          strokeWidth="0.75"
        />
        {[
          [28, 150, 2.6], [108, 70, 1.8], [180, 96, 3], [236, 120, 1.6], [296, 58, 2.2],
        ].map(([cx, cy, r], i) => (
          <circle
            key={i}
            className={`celeste-star celeste-star-${(i % 5) + 1}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="var(--revia-menta-300, #A9D9D4)"
          />
        ))}
      </svg>

      <motion.p
        className="font-body inline-flex items-center m-0 mb-8 uppercase"
        style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px", color: "var(--revia-coffee-700)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.medium, ease: easing.outExpo }}
      >
        <span
          aria-hidden="true"
          className="block"
          style={{ width: "28px", height: "1px", background: "var(--revia-accent)" }}
        />
        {eyebrow}
      </motion.p>

      <motion.h1
        className="font-display font-medium m-0 relative"
        style={{
          fontSize: "clamp(40px, 5.6vw, 76px)",
          lineHeight: 1.05,
          letterSpacing: "-0.014em",
          maxWidth: "960px",
          color: "var(--revia-coffee-900)",
        }}
        initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: duration.long, ease: easing.outExpo, delay: 0.15 }}
      >
        {titleNode}
      </motion.h1>

      {subtitle ? (
        <motion.p
          className="font-body m-0 mt-7 relative"
          style={{ fontSize: "17px", lineHeight: 1.6, maxWidth: "580px", color: "var(--revia-coffee-700)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.long, ease: easing.outExpo, delay: 0.28 }}
        >
          {subtitle}
        </motion.p>
      ) : null}
    </section>
  );
}
