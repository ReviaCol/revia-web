"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * FilosofiaCTA — cierre de la página filosofía.
 * Marco editorial con 4 corner ornaments + microetiqueta superior + CTA.
 */
export function FilosofiaCTA() {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      aria-label="Invitación a contacto"
      className="relative z-[2]"
      style={{
        padding: "var(--section-y-airy) var(--gutter)",
        background: "var(--revia-cream-100)",
      }}
    >
      <motion.div
        className="relative max-w-[860px] mx-auto text-center"
        style={{ padding: "clamp(48px, 8vw, 96px) clamp(20px, 4vw, 56px)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={baseTransition}
      >
        <CTACorners />

        <motion.p
          className="font-body inline-flex items-center justify-center text-coffee-700 m-0 mb-8 uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.32em", gap: "14px" }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={baseTransition}
        >
          <span
            aria-hidden="true"
            className="block bg-accent"
            style={{ width: "24px", height: "1px" }}
          />
          Invitación · VI
          <span
            aria-hidden="true"
            className="block bg-accent"
            style={{ width: "24px", height: "1px" }}
          />
        </motion.p>

        <motion.p
          className="font-display font-medium text-coffee-900 m-0"
          style={{
            fontSize: "clamp(34px, 4.6vw, 60px)",
            lineHeight: 1.1,
            letterSpacing: "-0.012em",
          }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ ...baseTransition, delay: 0.12 }}
        >
          El conocimiento merece
          <br />
          <em
            style={{
              fontStyle: "normal",
              color: "var(--revia-terracotta-600)",
              fontWeight: 500,
            }}
          >
            una conversación
          </em>
          .
        </motion.p>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ ...baseTransition, delay: 0.3 }}
        >
          <Link
            href="/contacto"
            className="inline-flex items-center gap-3 transition-all duration-500 ease-out hover:-translate-y-0.5 group"
            style={{
              padding: "16px 32px",
              background: "var(--revia-coffee-900)",
              color: "var(--revia-cream-50)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            Hablar con un especialista
            <span
              aria-hidden="true"
              className="transition-transform duration-500 ease-out group-hover:translate-x-2"
            >
              →
            </span>
          </Link>
        </motion.div>

        <motion.p
          className="font-body uppercase text-coffee-500 m-0 mt-10"
          style={{
            fontSize: "10px",
            letterSpacing: "0.4em",
            fontWeight: 500,
            opacity: 0.7,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ ...baseTransition, delay: 0.5 }}
        >
          Reviá · MMXXVI · Bogotá
        </motion.p>
      </motion.div>
    </section>
  );
}

function CTACorners() {
  const lineColor = "rgba(89, 65, 60, 0.30)";
  const size = "28px";
  const inset = "0";

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    pointerEvents: "none",
  };

  return (
    <>
      <span aria-hidden="true" style={{ ...baseStyle, top: inset, left: inset, borderTop: `1px solid ${lineColor}`, borderLeft: `1px solid ${lineColor}` }} />
      <span aria-hidden="true" style={{ ...baseStyle, top: inset, right: inset, borderTop: `1px solid ${lineColor}`, borderRight: `1px solid ${lineColor}` }} />
      <span aria-hidden="true" style={{ ...baseStyle, bottom: inset, left: inset, borderBottom: `1px solid ${lineColor}`, borderLeft: `1px solid ${lineColor}` }} />
      <span aria-hidden="true" style={{ ...baseStyle, bottom: inset, right: inset, borderBottom: `1px solid ${lineColor}`, borderRight: `1px solid ${lineColor}` }} />
    </>
  );
}
