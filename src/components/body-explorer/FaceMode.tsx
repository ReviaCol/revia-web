"use client";

import { motion } from "motion/react";
import type { FaceZone } from "./body-zones";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * FaceMode — modo ROSTRO del BodyExplorer (PLACEHOLDER).
 *
 * Slot elegante a la espera del modelo 3D / foto editorial definitiva.
 * Mantiene el contrato `onZoneFocus` por compatibilidad con BodyExplorer,
 * aunque actualmente no emite ninguna zona enfocada.
 *
 * Próximas opciones a explorar (sin urgencia):
 *  - Render 3D nativo del rostro (Rodin / Meshy / fotogrametría con fotos propias)
 *  - Foto editorial específica para este propósito (sesión con la fotógrafa)
 *  - Ilustración custom 2D (línea fina + mancha terracotta)
 *
 * Por ahora, el slot se siente Reviá: monolito terracotta, microtexto ritual,
 * boxshadow institucional. Los seis tratamientos faciales siguen disponibles
 * desde el listado por categorías más abajo en /tratamientos.
 */
export function FaceMode({
  onZoneFocus,
}: {
  onZoneFocus: (zone: FaceZone | null) => void;
}) {
  // Mantener el contrato pero sin emitir focus
  if (typeof window !== "undefined") {
    queueMicrotask(() => onZoneFocus(null));
  }

  return (
    <div className="w-full">
      <div
        className="relative w-full mx-auto flex items-center justify-center overflow-hidden"
        style={{
          maxWidth: "380px",
          aspectRatio: "4 / 5",
          background: "var(--revia-terracotta-500)",
          padding: "32px",
          boxShadow:
            "0 80px 120px -60px rgba(89, 65, 60, 0.32), 0 24px 60px -30px rgba(89, 65, 60, 0.20)",
        }}
      >
        <span
          className="absolute font-body uppercase pointer-events-none"
          style={{
            top: "32px",
            left: "16px",
            fontSize: "9px",
            letterSpacing: "0.4em",
            color: "var(--revia-cream-50)",
            opacity: 0.75,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          Face · Studio
        </span>

        <span
          className="absolute font-body uppercase pointer-events-none"
          style={{
            bottom: "32px",
            right: "16px",
            fontSize: "9px",
            letterSpacing: "0.4em",
            color: "var(--revia-cream-50)",
            opacity: 0.55,
            writingMode: "vertical-rl",
          }}
        >
          MMXXVI
        </span>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.long, ease: easing.outExpo }}
        >
          <div
            className="font-body uppercase text-cream-50 mb-3"
            style={{
              fontSize: "10px",
              letterSpacing: "0.32em",
              fontWeight: 500,
              opacity: 0.85,
            }}
          >
            En estudio
          </div>
          <div
            className="font-display text-cream-50"
            style={{
              fontSize: "22px",
              lineHeight: 1.3,
              fontWeight: 400,
              maxWidth: "240px",
              margin: "0 auto",
            }}
          >
            Modelo del rostro en preparación
          </div>
          <div
            className="font-body text-cream-50 mt-4"
            style={{
              fontSize: "12px",
              lineHeight: 1.55,
              opacity: 0.75,
              maxWidth: "260px",
              margin: "16px auto 0",
            }}
          >
            Mientras tanto, usa el modo Cuerpo o explora los tratamientos
            faciales en el catálogo más abajo.
          </div>
        </motion.div>
      </div>

      <p
        className="font-body uppercase text-coffee-700 text-center mt-8"
        style={{
          fontSize: "10px",
          fontWeight: 500,
          letterSpacing: "0.28em",
          opacity: 0.6,
        }}
      >
        Próximamente · explorador facial
      </p>
    </div>
  );
}
