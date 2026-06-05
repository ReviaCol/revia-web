"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * TreatmentsPreview — sección 03 de la home.
 * Grid 2x2 con las 4 categorías de tratamientos. Replica artboard #03 del overview.
 *
 * Cada card tiene un tono distinto del sistema warm:
 * - Corporal → terracotta-500
 * - Facial → peach-200
 * - Implante capilar → coffee-900 (versión "deep warm")
 * - Antienvejecimiento → amber-300 (puente al universo cool)
 */

type TreatmentCard = {
  number: string;
  title: string;
  summary: string;
  href: string;
  bg: string;
  fg: string;
};

const TREATMENT_CARDS: ReadonlyArray<TreatmentCard> = [
  {
    number: "01",
    title: "Corporal",
    summary: "Anti-celulitis · moldeado · radiofrecuencia",
    href: "/tratamientos/corporal",
    bg: "var(--revia-terracotta-500)",
    fg: "var(--revia-cream-50)",
  },
  {
    number: "02",
    title: "Facial",
    summary: "PRP · ácido hialurónico · rejuvenecimiento 360",
    href: "/tratamientos/facial",
    bg: "var(--revia-peach-200)",
    fg: "var(--revia-coffee-900)",
  },
  {
    number: "03",
    title: "Implante capilar",
    summary: "DHI y zafiro · cero cicatrices visibles",
    href: "/implante-capilar",
    bg: "var(--revia-coffee-900)",
    fg: "var(--revia-cream-50)",
  },
  {
    number: "04",
    title: "Antienvejecimiento",
    summary: "NAD · células madre · exosomas",
    href: "/antienvejecimiento",
    bg: "var(--revia-amber-300)",
    fg: "var(--revia-coffee-900)",
  },
];

export function TreatmentsPreview() {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      id="tratamientos"
      aria-labelledby="treatments-heading"
      className="relative z-[2]"
      style={{
        padding: "var(--section-y) var(--gutter)",
        background: "var(--revia-cream-100)",
      }}
    >
      <header className="revia-section-header max-w-[820px]">
        <motion.p
          className="font-body inline-flex items-center text-coffee-700 m-0 mb-9 uppercase"
          style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px" }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={baseTransition}
        >
          <span aria-hidden="true" className="block bg-accent" style={{ width: "28px", height: "1px" }} />
          Tratamientos
        </motion.p>

        <motion.h2
          id="treatments-heading"
          className="font-display font-medium text-coffee-900 m-0"
          style={{
            fontSize: "clamp(36px, 4.4vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.012em",
          }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...baseTransition, delay: 0.12 }}
        >
          Tratamientos que activan lo que ya eres.
        </motion.h2>
      </header>

      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
          gridAutoRows: "minmax(280px, auto)",
        }}
      >
        {TREATMENT_CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...baseTransition, delay: i * 0.12 }}
          >
            <Link
              href={card.href}
              className="group relative flex flex-col justify-end p-6 h-full transition-transform duration-500 ease-out hover:-translate-y-1"
              style={{
                background: card.bg,
                color: card.fg,
                minHeight: "clamp(260px, 32vw, 320px)",
                aspectRatio: "4 / 3",
              }}
            >
              <span
                className="absolute font-body uppercase opacity-70"
                style={{
                  top: "20px",
                  left: "24px",
                  fontSize: "9px",
                  letterSpacing: "0.28em",
                }}
              >
                {card.number}
              </span>

              <h3
                className="font-display font-normal m-0 mb-2"
                style={{
                  fontSize: "clamp(28px, 2.6vw, 36px)",
                  lineHeight: 1.1,
                }}
              >
                {card.title}
              </h3>

              <p
                className="font-body m-0"
                style={{ fontSize: "12px", lineHeight: 1.4, opacity: 0.85 }}
              >
                {card.summary}
              </p>

              <span
                className="font-body uppercase mt-6 inline-flex items-center gap-2"
                style={{ fontSize: "10px", letterSpacing: "0.16em" }}
              >
                Conocer
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-out group-hover:translate-x-2"
                >
                  →
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-14 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ ...baseTransition, delay: 0.6 }}
      >
        <Link
          href="/tratamientos"
          className="inline-flex items-center gap-2 font-body uppercase text-coffee-900 group"
          style={{ fontSize: "14px", letterSpacing: "0.08em" }}
        >
          <span className="relative pb-1">
            Ver todos los tratamientos
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px bg-accent transition-all duration-500 ease-out group-hover:w-full"
              style={{ width: "64px" }}
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
