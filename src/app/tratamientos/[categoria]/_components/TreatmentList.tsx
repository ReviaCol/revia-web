"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { duration, easing, stagger } from "@/lib/motion-tokens";
import type { Treatment } from "@/lib/treatments";

/** Humaniza un slug de zona corporal: "rostro-completo" → "rostro completo". */
function humanizeZone(zone: string): string {
  return zone.replace(/-/g, " ");
}

const ROMAN_UNITS = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
const ROMAN_TENS = ["", "X", "XX", "XXX"];
/** Romano para el índice catalogado (1–39 cubre cualquier categoría). */
function roman(n: number): string {
  return (ROMAN_TENS[Math.floor(n / 10)] ?? "") + (ROMAN_UNITS[n % 10] ?? "");
}

const listV: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger.base } },
};

const rowV: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.long, ease: easing.outExpo },
  },
};

/**
 * TreatmentList — "carta catalogada" de tratamientos de una categoría (ADR 0008).
 * Continuidad celeste en cream: numerales romanos como las zonas de la
 * constelación, hilo turquesa en hover (no terracota), reveal escalonado con la
 * cadencia de la Carta celeste. NO es tabla ni cards de e-commerce (sitemap §4).
 */
export function TreatmentList({
  treatments,
  categorySlug,
}: {
  treatments: Treatment[];
  categorySlug: string;
}) {
  return (
    <section
      aria-label="Lista de tratamientos"
      className="relative z-[2]"
      style={{ padding: "var(--hero-y-bottom) var(--gutter) var(--section-y-tight)" }}
    >
      <motion.div
        className="max-w-[920px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={listV}
      >
        {treatments.map((t, i) => (
          <motion.div
            key={t.id}
            variants={rowV}
            style={{ borderTop: "1px solid rgba(89, 65, 60, 0.16)" }}
          >
            <Link
              href={`/tratamientos/${categorySlug}/${t.id}`}
              className="group grid items-baseline"
              style={{
                gridTemplateColumns: "auto minmax(0, 1fr) auto",
                gap: "clamp(16px, 3vw, 36px)",
                padding: "32px 0",
              }}
            >
              {/* Numeral catalogado (decorativo) — hilo turquesa de la constelación */}
              <span
                aria-hidden="true"
                className="font-body"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "var(--revia-turquesa-700)",
                  paddingTop: "10px",
                  minWidth: "2ch",
                }}
              >
                {roman(i + 1)}
              </span>

              <div>
                <h2
                  className="font-display font-normal text-coffee-900 m-0"
                  style={{ fontSize: "clamp(24px, 2.6vw, 34px)", lineHeight: 1.12, letterSpacing: "-0.012em" }}
                >
                  <span className="relative inline-block">
                    {t.name}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 bottom-0 h-px bg-accent transition-all duration-500 ease-out group-hover:w-full"
                      style={{ width: "0%" }}
                    />
                  </span>
                </h2>
                <p className="font-body text-coffee-700 m-0 mt-3" style={{ fontSize: "15px", lineHeight: 1.6, maxWidth: "560px" }}>
                  {t.summary}
                </p>
                {t.bodyZones && t.bodyZones.length > 0 ? (
                  <p
                    className="font-body uppercase text-coffee-500 m-0 mt-4"
                    style={{ fontSize: "10px", letterSpacing: "0.16em" }}
                  >
                    {t.bodyZones.map(humanizeZone).join(" · ")}
                  </p>
                ) : null}
              </div>

              <span
                className="font-body uppercase text-coffee-900 inline-flex items-center gap-2 whitespace-nowrap"
                style={{ fontSize: "11px", letterSpacing: "0.14em", paddingTop: "8px" }}
              >
                <span className="hidden sm:inline">Conocer el protocolo</span>
                <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-2">→</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
