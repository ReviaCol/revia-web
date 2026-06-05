"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * TechPillars — "Tecnología que potencia tu biología".
 * 6 cards con numerales romanos, hover de border-shift en turquesa.
 */

const PILLARS = [
  { name: "Células madre", desc: "Reparación tisular y señales de rejuvenecimiento al organismo." },
  { name: "Exosomas", desc: "Mensajeros biológicos que reactivan el ciclo de regeneración celular." },
  { name: "Bioestimuladores de colágeno", desc: "Estímulo gradual al colágeno propio para piel firme y natural." },
  { name: "Plasma rico en plaquetas", desc: "Factores de crecimiento de tu propia sangre, devueltos a la dermis." },
  { name: "Radiofrecuencia de precisión", desc: "Energía controlada que reafirma sin invasión." },
  { name: "Terapia con NAD", desc: "Producción de energía celular y reparación del ADN." },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export function TechPillars() {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      aria-labelledby="tech-heading"
      className="relative z-[2] overflow-hidden"
      style={{ padding: "var(--section-y) var(--gutter)" }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 0%, rgba(78, 166, 166, 0.08) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      <header className="relative z-[1] mb-16 max-w-[860px]">
        <motion.p
          className="font-body inline-flex items-center text-coffee-700 m-0 mb-7 uppercase"
          style={{ fontSize: "12px", letterSpacing: "0.28em", gap: "14px" }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={baseTransition}
        >
          <span
            aria-hidden="true"
            className="block bg-accent"
            style={{ width: "32px", height: "1px" }}
          />
          Tecnología · III
        </motion.p>

        <motion.h2
          id="tech-heading"
          className="font-display font-medium text-coffee-900 m-0"
          style={{
            fontSize: "clamp(36px, 4.6vw, 60px)",
            lineHeight: 1.08,
            letterSpacing: "-0.012em",
          }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...baseTransition, delay: 0.12 }}
        >
          Tecnología que{" "}
          <em
            style={{
              fontStyle: "normal",
              color: "var(--revia-terracotta-600)",
              fontWeight: 500,
            }}
          >
            potencia
          </em>
          <br />
          tu biología.
        </motion.h2>

        <motion.p
          className="font-body text-coffee-700 m-0 mt-6 max-w-[560px]"
          style={{ fontSize: "15px", lineHeight: 1.65 }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...baseTransition, delay: 0.24 }}
        >
          Activamos procesos que tu cuerpo ya conoce. Potenciamos mecanismos
          que tus células ya poseen. Solo precisión biológica.
        </motion.p>
      </header>

      <motion.div
        className="relative z-[1] grid gap-x-10 gap-y-14"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {PILLARS.map((pillar, i) => (
          <PillarCard
            key={pillar.name}
            pillar={pillar}
            romanNumeral={ROMAN[i]}
          />
        ))}
      </motion.div>
    </section>
  );
}

function PillarCard({
  pillar,
  romanNumeral,
}: {
  pillar: { name: string; desc: string };
  romanNumeral: string;
}) {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: baseTransition,
        },
      }}
      className="relative group pillar-card"
      style={{
        paddingTop: "22px",
        borderTop: "1px solid rgba(89, 65, 60, 0.18)",
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: easing.outExpo }}
    >
      <span aria-hidden="true" className="pillar-hover-line" />

      <div
        className="flex items-baseline gap-3 mb-3"
        style={{ color: "var(--revia-coffee-500)" }}
      >
        <span
          className="font-display"
          style={{
            fontSize: "18px",
            fontWeight: 300,
            opacity: 0.55,
            letterSpacing: "0.06em",
          }}
        >
          {romanNumeral}
        </span>
        <span
          className="font-body uppercase"
          style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.32em",
          }}
        >
          Pilar
        </span>
      </div>

      <h3
        className="font-display text-coffee-900 m-0 mb-3"
        style={{ fontSize: "24px", lineHeight: 1.15, fontWeight: 400 }}
      >
        {pillar.name}
      </h3>
      <p
        className="font-body text-coffee-700 m-0"
        style={{ fontSize: "14px", lineHeight: 1.6 }}
      >
        {pillar.desc}
      </p>
    </motion.article>
  );
}
