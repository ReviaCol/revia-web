"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaceMode } from "./FaceMode";
import { BodyMode, TREATMENTS_MAP } from "./BodyMode";
import type { BodyBlockZone, FaceZone } from "./body-zones";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * BodyExplorer — explorador interactivo de zonas y tratamientos.
 *
 * Dos modos:
 *   - "face": modelo 3D del rostro (Rodin) con hotspots faciales precisos
 *   - "body": composición arquitectónica de bloques (lenguaje monolito Reviá)
 *
 * Layout:
 *   - Columna izquierda: el explorer (3D o bloques) con su propio toggle interno
 *   - Columna derecha: panel de tratamientos de la zona enfocada
 */

type AnyZone = FaceZone | BodyBlockZone;

export function BodyExplorer() {
  const [activeMode, setActiveMode] = useState<"face" | "body">("face");
  const [focusedZone, setFocusedZone] = useState<AnyZone | null>(null);

  return (
    <div className="w-full">
      {/* Toggle Rostro / Cuerpo — el control principal */}
      <div
        role="tablist"
        aria-label="Modo del explorador"
        className="flex gap-0 mb-10 mx-auto"
        style={{ maxWidth: "380px" }}
      >
        {(
          [
            { id: "face", label: "Rostro" },
            { id: "body", label: "Cuerpo" },
          ] as const
        ).map((m, i) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={activeMode === m.id}
            onClick={() => {
              setActiveMode(m.id);
              setFocusedZone(null);
            }}
            className="font-body uppercase transition-all duration-500 flex-1"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              padding: "16px 20px",
              background:
                activeMode === m.id
                  ? "var(--revia-coffee-900)"
                  : "var(--revia-cream-50)",
              color:
                activeMode === m.id
                  ? "var(--revia-cream-50)"
                  : "var(--revia-coffee-700)",
              border: "1px solid",
              borderColor:
                activeMode === m.id
                  ? "var(--revia-coffee-900)"
                  : "rgba(89, 65, 60, 0.18)",
              borderLeftWidth: i === 0 ? "1px" : "0",
              cursor: "pointer",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="explorer-inner-grid grid gap-12 items-start">
        {/* Explorer */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.6, ease: easing.outExpo }}
            >
              {activeMode === "face" ? (
                <FaceMode onZoneFocus={setFocusedZone} />
              ) : (
                <BodyMode onZoneFocus={setFocusedZone} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Panel lateral con tratamientos de la zona enfocada */}
        <div className="explorer-panel min-h-[320px] flex items-center sticky top-32">
          <AnimatePresence mode="wait">
            {focusedZone ? (
              <motion.div
                key={focusedZone.id}
                initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 4, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: easing.outExpo }}
                className="w-full"
                role="region"
                aria-live="polite"
              >
                <div
                  className="font-body uppercase text-coffee-700 mb-3"
                  style={{
                    fontSize: "9px",
                    fontWeight: 500,
                    letterSpacing: "0.32em",
                  }}
                >
                  {activeMode === "face" ? "Rostro · Zona" : "Cuerpo · Zona"}
                </div>

                <h3
                  className="font-display font-medium text-coffee-900 m-0 mb-6"
                  style={{
                    fontSize: "clamp(28px, 3vw, 36px)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {focusedZone.label}
                </h3>

                <div
                  className="font-body uppercase text-coffee-500 mb-4"
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.24em",
                  }}
                >
                  Tratamientos disponibles
                </div>

                <ul className="list-none p-0 m-0 grid gap-2">
                  {focusedZone.treatmentIds
                    .map((id) => TREATMENTS_MAP[id])
                    .filter(Boolean)
                    .map((t, i) => (
                      <motion.li
                        key={t.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: duration.short,
                          ease: easing.outExpo,
                          delay: 0.1 + i * 0.06,
                        }}
                        className="font-display text-coffee-900"
                        style={{
                          fontSize: "16px",
                          lineHeight: 1.4,
                          fontWeight: 400,
                          paddingTop: "10px",
                          borderTop: "1px solid rgba(89, 65, 60, 0.12)",
                        }}
                      >
                        {t.name}
                      </motion.li>
                    ))}
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <div
                  className="font-body uppercase text-coffee-700 mb-3"
                  style={{
                    fontSize: "9px",
                    fontWeight: 500,
                    letterSpacing: "0.32em",
                  }}
                >
                  Body · Map
                </div>
                <h3
                  className="font-display font-medium text-coffee-900 m-0 mb-4"
                  style={{
                    fontSize: "clamp(24px, 2.6vw, 32px)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {activeMode === "face"
                    ? "Explora cada zona del rostro."
                    : "Explora cada zona del cuerpo."}
                </h3>
                <p
                  className="font-body text-coffee-700 m-0"
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.6,
                    maxWidth: "340px",
                  }}
                >
                  {activeMode === "face"
                    ? "Pasa el cursor sobre cualquier región del rostro para conocer los tratamientos faciales disponibles."
                    : "Pasa el cursor o toca cualquiera de los bloques arquitectónicos para conocer los tratamientos corporales disponibles en esa zona."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

