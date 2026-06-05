"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * ScrollHint - linea + microtexto + flecha pulsante.
 * Aparece al final del primer viewport del Hero.
 */
export function ScrollHint() {
  return (
    <motion.div
      className="col-start-1 col-end-[-1] row-start-3 z-[5] flex items-center text-coffee-700"
      style={{ padding: "0 var(--gutter) 36px", gap: "18px" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.medium, ease: easing.outExpo, delay: 1.4 }}
    >
      <span
        aria-hidden="true"
        className="block"
        style={{
          flex: "0 0 96px",
          height: "1px",
          background: "var(--revia-accent)",
        }}
      />
      <span
        className="font-body font-medium uppercase"
        style={{ fontSize: "11px", letterSpacing: "0.28em" }}
      >
        Desliza para revelar
      </span>
      <motion.svg
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="w-[14px] h-[14px]"
        animate={{ y: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.4, ease: easing.outExpo, repeat: Infinity }}
      >
        <path
          d="M7 1v12M1 7l6 6 6-6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="square"
        />
      </motion.svg>
    </motion.div>
  );
}
