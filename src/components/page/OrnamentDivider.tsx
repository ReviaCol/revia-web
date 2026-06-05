"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * OrnamentDivider — separador editorial entre secciones.
 *
 * Hairline + microetiqueta romana opcional + diamante + hairline.
 * Apretado verticalmente: vive entre dos secciones que ya tienen padding propio,
 * así que aporta solo ~32px de altura total (no debe inflar el ritmo).
 */
type Tone = "warm" | "cool";
type Align = "center" | "left" | "right";

type Props = {
  label?: string;
  tone?: Tone;
  align?: Align;
};

export function OrnamentDivider({ label, tone = "warm", align = "center" }: Props) {
  const lineColor =
    tone === "cool" ? "rgba(53, 132, 140, 0.30)" : "rgba(89, 65, 60, 0.20)";
  const diamondColor =
    tone === "cool" ? "var(--revia-turquesa-700)" : "var(--revia-coffee-700)";
  const labelColor =
    tone === "cool" ? "var(--revia-turquesa-700)" : "var(--revia-coffee-700)";

  const justify =
    align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";

  return (
    <motion.div
      aria-hidden="true"
      className="relative w-full"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: justify,
        gap: "20px",
        padding: "8px var(--gutter)",
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: duration.long, ease: easing.outExpo }}
    >
      <motion.span
        className="block"
        style={{
          height: "1px",
          background: lineColor,
          flex: align === "center" ? "1 1 0" : "0 0 120px",
          maxWidth: align === "center" ? "260px" : "200px",
        }}
        initial={{ scaleX: 0, transformOrigin: "right center" }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: duration.xlong, ease: easing.outExpo, delay: 0.1 }}
      />

      {label && (
        <span
          className="font-body uppercase"
          style={{
            fontSize: "10px",
            letterSpacing: "0.32em",
            fontWeight: 500,
            color: labelColor,
            opacity: 0.85,
          }}
        >
          {label}
        </span>
      )}

      <span
        className="block"
        style={{
          width: "6px",
          height: "6px",
          background: diamondColor,
          transform: "rotate(45deg)",
          opacity: 0.85,
        }}
      />

      <motion.span
        className="block"
        style={{
          height: "1px",
          background: lineColor,
          flex: align === "center" ? "1 1 0" : "0 0 120px",
          maxWidth: align === "center" ? "260px" : "200px",
        }}
        initial={{ scaleX: 0, transformOrigin: "left center" }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: duration.xlong, ease: easing.outExpo, delay: 0.1 }}
      />
    </motion.div>
  );
}
