"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";
import { FigureSlot } from "@/components/media/FigureSlot";
import { FIGURES } from "@/data/figures";

/**
 * Monolith — bloque escultórico terracotta-500 que ancla la composición editorial.
 * Solo desktop. En mobile el padre lo oculta vía CSS (.hero-grid > aside { display: none }).
 */
export function Monolith() {
  return (
    <aside
      aria-hidden="true"
      className="relative col-start-2 row-start-1 row-end-4 z-[2]"
    >
      <motion.div
        className="absolute"
        style={{
          top: "88px",
          right: "clamp(32px, 4vw, 64px)",
          bottom: "104px",
          left: "32px",
          background: "var(--revia-terracotta-500)",
          borderRadius: "1px",
          boxShadow:
            "0 80px 120px -60px rgba(89, 65, 60, 0.22), 0 24px 80px -40px rgba(89, 65, 60, 0.14)",
        }}
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: duration.xlong, ease: easing.outExpo, delay: 0.2 }}
      />

      <span
        className="absolute font-body text-[10px] font-medium uppercase z-[3]"
        style={{
          top: "120px",
          right: "clamp(48px, 5vw, 84px)",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          letterSpacing: "0.4em",
          color: "rgba(251, 246, 241, 0.85)",
        }}
      >
        MMXXVI · Bogotá
      </span>

      <motion.div
        className="absolute z-[3] overflow-hidden"
        style={{
          top: "152px",
          right: "clamp(96px, 10vw, 160px)",
          bottom: "144px",
          left: "-56px",
          boxShadow: "0 40px 80px -50px rgba(89, 65, 60, 0.30)",
        }}
        initial={{ opacity: 0, filter: "blur(10px)", y: 16 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 1.1, ease: easing.outExpo, delay: 0.5 }}
      >
        <FigureSlot {...FIGURES.heroHome} caption="[ figura contemplativa · brochure pág. 2 ]" tone="warm" />
      </motion.div>

      <div
        className="absolute"
        style={{
          bottom: "56px",
          left: "-20px",
          width: "88px",
          height: "8px",
          background: "var(--revia-terracotta-600)",
        }}
      />
    </aside>
  );
}
