"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * HeritageSection — herencia de 20 años + cifras institucionales.
 *
 * Caveat legal (memoria/project_revia_legal_lafont.md): NO decir "Reviá tiene
 * 40 años". Frasear como herencia ("heredamos") e infraestructura.
 */

type Stat = {
  label: string;
  value: number;
  unit: string;
  format?: (n: number) => string;
  staticText?: string;
};

const STATS: Stat[] = [
  {
    label: "Instalaciones diseñadas para la experiencia médica",
    value: 3560,
    unit: "m²",
    format: (n: number) => n.toLocaleString("es-CO"),
  },
  {
    label: "Certificación internacional de calidad",
    value: 0,
    unit: "",
    staticText: "ISO 9001",
  },
  {
    label: "Infecciones registradas en nuestra práctica",
    value: 0,
    unit: "",
    staticText: "0",
  },
  {
    label: "Complicaciones médicas registradas",
    value: 0,
    unit: "",
    staticText: "0",
  },
];

export function HeritageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const monolithY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="heritage-heading"
      className="relative z-[2]"
      style={{
        padding: "var(--section-y) var(--gutter)",
        background: "var(--revia-cream-100)",
      }}
    >
      <div
        className="grid gap-16 items-center heritage-grid"
        style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)" }}
      >
        <motion.div
          className="relative flex items-center justify-center aspect-[3/4] max-h-[680px]"
          style={{
            background: "var(--revia-terracotta-500)",
            boxShadow: "0 80px 120px -60px rgba(89, 65, 60, 0.28)",
            y: monolithY,
            willChange: "transform",
          }}
          initial={{ opacity: 0, scale: 0.985 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: duration.xlong, ease: easing.outExpo }}
        >
          <CornerOrnaments />

          <span
            className="font-display font-light text-cream-50 select-none"
            style={{
              fontSize: "clamp(180px, 22vw, 340px)",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
            }}
            aria-hidden="true"
          >
            20
          </span>

          <span
            className="absolute font-body uppercase text-cream-50"
            style={{
              top: "32px",
              left: "32px",
              fontSize: "10px",
              letterSpacing: "0.4em",
              opacity: 0.85,
            }}
          >
            años heredados
          </span>

          <span
            className="absolute font-body uppercase text-cream-50"
            style={{
              bottom: "32px",
              right: "32px",
              fontSize: "10px",
              letterSpacing: "0.4em",
              opacity: 0.85,
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            Reviá · MMXXVI
          </span>
        </motion.div>

        <div className="max-w-[560px]">
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
              style={{ width: "28px", height: "1px" }}
            />
            Herencia · II
          </motion.p>

          <motion.h2
            id="heritage-heading"
            className="font-display font-medium text-coffee-900 m-0"
            style={{
              fontSize: "clamp(32px, 3.8vw, 52px)",
              lineHeight: 1.1,
              letterSpacing: "-0.012em",
            }}
            initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.12 }}
          >
            Heredamos dos décadas
            <br />
            de{" "}
            <em
              style={{
                fontStyle: "normal",
                fontWeight: 500,
                color: "var(--revia-terracotta-600)",
              }}
            >
              rigor médico
            </em>
            .
          </motion.h2>

          <motion.p
            className="font-body text-coffee-700 m-0 mt-7 max-w-[480px]"
            style={{ fontSize: "15px", lineHeight: 1.65 }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.24 }}
          >
            Operamos en infraestructuras diseñadas para una experiencia médica
            de excelencia. Laboratorios propios, farmacias in-house, salas de
            recuperación especializadas. Cada cifra respalda nuestra promesa.
          </motion.p>

          <motion.div
            className="grid gap-x-8 gap-y-10 mt-12"
            style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
            }}
          >
            {STATS.map((stat) => (
              <StatCell key={stat.label} stat={stat} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatCell({ stat }: { stat: Stat }) {
  const cellRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cellRef, { once: true, amount: 0.5 });
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <motion.div
      ref={cellRef}
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: baseTransition },
      }}
      style={{
        borderTop: "1px solid rgba(89, 65, 60, 0.18)",
        paddingTop: "14px",
      }}
    >
      <div
        className="font-display text-coffee-900"
        style={{
          fontSize: "clamp(28px, 2.6vw, 38px)",
          lineHeight: 1,
          fontWeight: 400,
          letterSpacing: "-0.012em",
        }}
      >
        {stat.staticText ? (
          stat.staticText
        ) : (
          <CountUp to={stat.value} format={stat.format} start={inView} />
        )}
        {stat.unit && (
          <span
            className="font-body text-coffee-700 ml-1"
            style={{ fontSize: "14px", fontWeight: 400 }}
          >
            {stat.unit}
          </span>
        )}
      </div>
      <div
        className="font-body text-coffee-700 mt-3"
        style={{ fontSize: "12px", lineHeight: 1.5, letterSpacing: "0.02em" }}
      >
        {stat.label}
      </div>
    </motion.div>
  );
}

function CountUp({
  to,
  format,
  start,
}: {
  to: number;
  format?: (n: number) => string;
  start: boolean;
}) {
  const prefersReduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [value, setValue] = useState(prefersReduce ? to : 0);

  useEffect(() => {
    if (!start || prefersReduce) return;
    const durationMs = 1200;
    const startTime = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const elapsed = t - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(to * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, prefersReduce]);

  return <>{format ? format(value) : value}</>;
}

function CornerOrnaments() {
  const lineColor = "rgba(251, 246, 241, 0.32)";
  const size = "22px";
  const offset = "18px";
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    pointerEvents: "none",
  };
  return (
    <>
      <span aria-hidden="true" style={{ ...baseStyle, top: offset, left: offset, borderTop: `1px solid ${lineColor}`, borderLeft: `1px solid ${lineColor}` }} />
      <span aria-hidden="true" style={{ ...baseStyle, top: offset, right: offset, borderTop: `1px solid ${lineColor}`, borderRight: `1px solid ${lineColor}` }} />
      <span aria-hidden="true" style={{ ...baseStyle, bottom: offset, left: offset, borderBottom: `1px solid ${lineColor}`, borderLeft: `1px solid ${lineColor}` }} />
      <span aria-hidden="true" style={{ ...baseStyle, bottom: offset, right: offset, borderBottom: `1px solid ${lineColor}`, borderRight: `1px solid ${lineColor}` }} />
    </>
  );
}
