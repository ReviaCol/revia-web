"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * LegalDoc — layout compacto para páginas legales (privacidad, términos, aviso).
 * Tipografía Reviá para no romper la marca, pero densidad de lectura legal.
 */

export type LegalBlock = { heading: string; paragraphs: string[] };

export function LegalDoc({
  eyebrow,
  title,
  updated,
  intro,
  blocks,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro?: string;
  blocks: LegalBlock[];
}) {
  return (
    <section
      className="relative z-[2]"
      style={{ padding: "var(--hero-y-top) var(--gutter) var(--section-y)" }}
    >
      <div style={{ maxWidth: "760px" }}>
        <motion.p
          className="font-body inline-flex items-center text-coffee-700 m-0 mb-7 uppercase"
          style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.medium, ease: easing.outExpo }}
        >
          <span aria-hidden="true" className="block bg-accent" style={{ width: "28px", height: "1px" }} />
          {eyebrow}
        </motion.p>

        <motion.h1
          className="font-display font-medium text-coffee-900 m-0"
          style={{ fontSize: "clamp(34px, 4.6vw, 60px)", lineHeight: 1.08, letterSpacing: "-0.014em" }}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: duration.long, ease: easing.outExpo, delay: 0.15 }}
        >
          {title}
        </motion.h1>

        <p className="font-body text-coffee-500 m-0 mt-5 uppercase" style={{ fontSize: "11px", letterSpacing: "0.16em" }}>
          Última actualización: {updated}
        </p>

        {intro && (
          <p className="font-body text-coffee-700 m-0 mt-8" style={{ fontSize: "16px", lineHeight: 1.7 }}>
            {intro}
          </p>
        )}

        <div className="mt-12 grid gap-10">
          {blocks.map((block) => (
            <div key={block.heading}>
              <h2
                className="font-display font-normal text-coffee-900 m-0 mb-4"
                style={{ fontSize: "clamp(20px, 2.2vw, 26px)", lineHeight: 1.2, letterSpacing: "-0.01em" }}
              >
                {block.heading}
              </h2>
              <div className="grid gap-4">
                {block.paragraphs.map((p, i) => (
                  <p key={i} className="font-body text-coffee-700 m-0" style={{ fontSize: "15px", lineHeight: 1.7 }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
