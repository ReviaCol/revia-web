"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { bodyBlocksBySide, BODY_BLOCK_ZONES, type BodyBlockZone } from "./body-zones";
import treatmentsData from "@/data/treatments.json";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * BodyMode — modo CUERPO del BodyExplorer.
 *
 * Composición arquitectónica de bloques verticales (torso, abdomen, flancos,
 * muslos, etc.) inspirada en los monolitos del brochure 2026 de Reviá.
 *
 * Cada bloque es un rectángulo terracotta apilado verticalmente con su número
 * de orden y label discreto. Hover/tap sobre el bloque revela los tratamientos
 * disponibles para esa zona.
 *
 * Toggle frente/espalda cambia los bloques visibles (algunos son "both").
 *
 * No es una figura humana — es una abstracción arquitectónica que se siente
 * Reviá-shaped (lenguaje del brochure: bloques + agua + cielo).
 */

type Treatment = { id: string; name: string };
type TreatmentsJson = {
  categories: Array<{ id: string; treatments: Treatment[] }>;
};

const TREATMENTS_MAP: Record<string, Treatment> = (() => {
  const map: Record<string, Treatment> = {};
  for (const cat of (treatmentsData as TreatmentsJson).categories) {
    for (const t of cat.treatments) map[t.id] = t;
  }
  return map;
})();

export function BodyMode({
  onZoneFocus,
}: {
  onZoneFocus: (zone: BodyBlockZone | null) => void;
}) {
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  const visibleBlocks = bodyBlocksBySide(activeSide);
  const focusedZoneId = hoveredZoneId ?? activeZoneId;

  // Notify parent of focused zone (so parent can render the side panel)
  const focusedZone = focusedZoneId
    ? BODY_BLOCK_ZONES.find((z) => z.id === focusedZoneId) ?? null
    : null;

  // Sync to parent — but only on changes, not every render
  // We use a side-effect via setTimeout to batch
  if (typeof window !== "undefined") {
    queueMicrotask(() => onZoneFocus(focusedZone));
  }

  return (
    <div className="w-full">
      {/* Toggle Frente / Espalda dentro del modo Cuerpo */}
      <div
        role="tablist"
        aria-label="Vista del cuerpo"
        className="flex gap-0 mb-8 mx-auto"
        style={{ maxWidth: "320px" }}
      >
        {(["front", "back"] as const).map((s, i) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={activeSide === s}
            onClick={() => {
              setActiveSide(s);
              setActiveZoneId(null);
              setHoveredZoneId(null);
            }}
            className="font-body uppercase transition-all duration-500 flex-1"
            style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              padding: "12px 16px",
              background:
                activeSide === s
                  ? "var(--revia-coffee-900)"
                  : "transparent",
              color:
                activeSide === s
                  ? "var(--revia-cream-50)"
                  : "var(--revia-coffee-700)",
              border: "1px solid",
              borderColor:
                activeSide === s
                  ? "var(--revia-coffee-900)"
                  : "rgba(89, 65, 60, 0.18)",
              borderLeftWidth: i === 0 ? "1px" : "0",
              cursor: "pointer",
            }}
          >
            {s === "front" ? "Vista frontal" : "Vista posterior"}
          </button>
        ))}
      </div>

      {/* Composición de bloques arquitectónicos */}
      <div
        className="relative w-full mx-auto"
        style={{
          maxWidth: "380px",
          padding: "32px 24px",
          background: "var(--revia-cream-100)",
          boxShadow:
            "0 80px 120px -60px rgba(89, 65, 60, 0.20), 0 24px 60px -30px rgba(89, 65, 60, 0.12)",
        }}
      >
        {/* Microtexto vertical estilo monolito */}
        <span
          className="absolute font-body uppercase pointer-events-none"
          style={{
            top: "32px",
            left: "8px",
            fontSize: "9px",
            letterSpacing: "0.4em",
            color: "var(--revia-coffee-700)",
            opacity: 0.6,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          Body · Map
        </span>

        <span
          className="absolute font-body uppercase pointer-events-none"
          style={{
            bottom: "32px",
            right: "8px",
            fontSize: "9px",
            letterSpacing: "0.4em",
            color: "var(--revia-coffee-700)",
            opacity: 0.5,
            writingMode: "vertical-rl",
          }}
        >
          {activeSide === "front" ? "Anterior" : "Posterior"}
        </span>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSide}
            initial={{ opacity: 0, x: activeSide === "front" ? -8 : 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeSide === "front" ? 8 : -8 }}
            transition={{ duration: 0.5, ease: easing.outExpo }}
            className="flex flex-col gap-2"
          >
            {visibleBlocks.map((zone, idx) => {
              const isActive = activeZoneId === zone.id;
              const isHovered = hoveredZoneId === zone.id;
              const isFocused = isActive || isHovered;

              // Width tapering for visual hierarchy: torso wide, piernas narrow
              const widthPct = 100 - idx * 5;

              return (
                <motion.button
                  key={zone.id}
                  type="button"
                  aria-label={`Ver tratamientos en ${zone.label}`}
                  aria-expanded={isActive}
                  onClick={() =>
                    setActiveZoneId(isActive ? null : zone.id)
                  }
                  onPointerEnter={() => setHoveredZoneId(zone.id)}
                  onPointerLeave={() => setHoveredZoneId(null)}
                  onFocus={() => setHoveredZoneId(zone.id)}
                  onBlur={() => setHoveredZoneId(null)}
                  className="relative block transition-all duration-500 mx-auto"
                  style={{
                    width: `${Math.max(60, widthPct)}%`,
                    padding: "0",
                    border: "none",
                    cursor: "pointer",
                    background: "transparent",
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: duration.medium,
                    ease: easing.outExpo,
                    delay: idx * 0.06,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div
                    className="relative flex items-center justify-between transition-all duration-500"
                    style={{
                      background: isFocused
                        ? "var(--revia-terracotta-500)"
                        : "var(--revia-terracotta-600)",
                      padding: "20px 24px",
                      minHeight: "60px",
                      boxShadow: isFocused
                        ? "0 20px 40px -20px rgba(89, 65, 60, 0.4), 0 0 0 1px rgba(251, 246, 241, 0.15)"
                        : "0 8px 20px -10px rgba(89, 65, 60, 0.25)",
                    }}
                  >
                    <span
                      className="font-body uppercase text-cream-50"
                      style={{
                        fontSize: "9px",
                        fontWeight: 500,
                        letterSpacing: "0.32em",
                        opacity: 0.7,
                      }}
                    >
                      {zone.number}
                    </span>
                    <span
                      className="font-display text-cream-50 text-right"
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: 1.2,
                      }}
                    >
                      {zone.label}
                    </span>

                    {/* Glow pulsante cuando está focused */}
                    {isFocused && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute"
                        style={{
                          right: "-6px",
                          top: "50%",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: "var(--revia-cream-50)",
                          boxShadow: "0 0 16px rgba(251, 246, 241, 0.7)",
                          transform: "translateY(-50%)",
                        }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hint */}
      <p
        className="font-body uppercase text-coffee-700 text-center mt-8"
        style={{
          fontSize: "10px",
          fontWeight: 500,
          letterSpacing: "0.28em",
          opacity: 0.6,
        }}
      >
        Pasa el cursor o toca cualquier bloque
      </p>
    </div>
  );
}

// Re-export para que el padre acceda al map de tratamientos
export { TREATMENTS_MAP };
