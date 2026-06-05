"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * SectionContinued — segundo viewport del Hero.
 * Continúa el manifesto: eyebrow "Manifiesto · ii" + dos líneas con stagger.
 */
export function SectionContinued() {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      aria-label="Manifiesto continuado"
      className="relative z-[2] flex items-center bg-cream-50"
      style={{
        padding: "var(--section-y) var(--gutter)",
      }}
    >
      <div className="max-w-[1100px]">
        <motion.p
          className="font-body inline-flex items-center text-coffee-700 m-0 mb-9 uppercase"
          style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px" }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={baseTransition}
        >
          <span
            aria-hidden="true"
            className="block bg-accent"
            style={{ width: "28px", height: "1px" }}
          />
          Manifiesto · ii
        </motion.p>

        <p
          className="font-display font-normal text-coffee-900 m-0"
          style={{
            fontSize: "clamp(40px, 4.4vw, 64px)",
            lineHeight: 1.18,
            letterSpacing: "-0.005em",
            maxWidth: "22ch",
          }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.12 }}
          >
            Buscamos tu verdadera esencia
          </motion.span>
          <motion.span
            className="block"
            style={{ paddingLeft: "1.4em" }}
            initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.24 }}
          >
            para revelarla en tu mejor expresión.
          </motion.span>
        </p>
      </div>
    </section>
  );
}
