"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * CategoriesGrid — grid editorial 2x2 con las 4 categorías.
 *
 * Versión expandida del TreatmentsPreview de la home: cada card más grande,
 * con lista de tratamientos representativos. Cada card lleva a su subpágina.
 *
 * Sigue el sistema cromático del overview (artboard #03):
 * - Corporal → terracotta-500
 * - Facial → peach-200
 * - Implante capilar → coffee-900 (deep warm)
 * - Antienvejecimiento → amber-300 (puente cool)
 */

type Category = {
  number: string;
  title: string;
  summary: string;
  treatments: string[];
  href: string;
  bg: string;
  fg: string;
  fgMuted: string;
};

const CATEGORIES: ReadonlyArray<Category> = [
  {
    number: "01",
    title: "Corporal",
    summary: "Protocolos no invasivos para textura, firmeza y composición corporal.",
    treatments: [
      "Protocolo anti-celulitis",
      "Moldeado corporal",
      "Radiofrecuencia",
      "Bioestimuladores",
    ],
    href: "/tratamientos/corporal",
    bg: "var(--revia-terracotta-500)",
    fg: "var(--revia-cream-50)",
    fgMuted: "rgba(251, 246, 241, 0.85)",
  },
  {
    number: "02",
    title: "Facial",
    summary: "Tratamientos que devuelven luz, textura y vitalidad a tu piel.",
    treatments: [
      "Plasma rico en plaquetas",
      "Ácido hialurónico",
      "Toxina botulínica",
      "Rejuvenecimiento facial 360",
    ],
    href: "/tratamientos/facial",
    bg: "var(--revia-peach-200)",
    fg: "var(--revia-coffee-900)",
    fgMuted: "rgba(89, 65, 60, 0.75)",
  },
  {
    number: "03",
    title: "Implante capilar",
    summary: "Tu cabello, una obra biológica de arte. DHI y zafiro, sin invasión.",
    treatments: [
      "Técnica DHI",
      "Técnica Zafiro",
      "Sin rasurado (Non-Shaven)",
      "Cámara hiperbárica post",
    ],
    href: "/implante-capilar",
    bg: "var(--revia-coffee-900)",
    fg: "var(--revia-cream-50)",
    fgMuted: "rgba(251, 246, 241, 0.75)",
  },
  {
    number: "04",
    title: "Antienvejecimiento",
    summary: "Programa holístico para revertir el desgaste celular y sistémico.",
    treatments: [
      "Terapia con NAD",
      "Vitamina C de alta concentración",
      "Células madre",
      "Exosomas",
    ],
    href: "/antienvejecimiento",
    bg: "var(--revia-amber-300)",
    fg: "var(--revia-coffee-900)",
    fgMuted: "rgba(89, 65, 60, 0.75)",
  },
];

export function CategoriesGrid() {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      aria-labelledby="categories-heading"
      className="relative z-[2]"
      style={{ padding: "var(--section-y) var(--gutter)" }}
    >
      <header className="revia-section-header max-w-[640px]">
        <motion.p
          className="font-body inline-flex items-center text-coffee-700 m-0 mb-6 uppercase"
          style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px" }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={baseTransition}
        >
          <span aria-hidden="true" className="block bg-accent" style={{ width: "28px", height: "1px" }} />
          Categorías
        </motion.p>

        <motion.h2
          id="categories-heading"
          className="font-display font-medium text-coffee-900 m-0"
          style={{
            fontSize: "clamp(32px, 4vw, 48px)",
            lineHeight: 1.1,
            letterSpacing: "-0.012em",
          }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...baseTransition, delay: 0.12 }}
        >
          Cuatro caminos. Una sola filosofía.
        </motion.h2>
      </header>

      <motion.div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {CATEGORIES.map((cat) => (
          <motion.div
            key={cat.title}
            variants={{
              hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: baseTransition,
              },
            }}
          >
            <Link
              href={cat.href}
              className="group relative flex flex-col h-full p-7 transition-transform duration-500 ease-out hover:-translate-y-1"
              style={{
                background: cat.bg,
                color: cat.fg,
                minHeight: "clamp(340px, 40vw, 440px)",
                aspectRatio: "4 / 5",
              }}
            >
              <span
                className="font-body uppercase opacity-80"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.28em",
                  marginBottom: "auto",
                }}
              >
                {cat.number}
              </span>

              <h3
                className="font-display font-normal m-0 mt-8 mb-4"
                style={{
                  fontSize: "clamp(32px, 2.8vw, 40px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.012em",
                }}
              >
                {cat.title}
              </h3>

              <p
                className="font-body m-0 mb-6"
                style={{
                  fontSize: "13px",
                  lineHeight: 1.5,
                  color: cat.fgMuted,
                }}
              >
                {cat.summary}
              </p>

              <ul className="list-none p-0 m-0 grid gap-1.5 mb-7">
                {cat.treatments.map((t) => (
                  <li
                    key={t}
                    className="font-body"
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.4,
                      color: cat.fgMuted,
                    }}
                  >
                    · {t}
                  </li>
                ))}
              </ul>

              <span
                className="font-body uppercase inline-flex items-center gap-2 mt-auto"
                style={{ fontSize: "10px", letterSpacing: "0.16em" }}
              >
                Conocer
                <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-2">→</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
