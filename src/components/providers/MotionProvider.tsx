"use client";

import { MotionConfig } from "motion/react";

/**
 * MotionProvider — accesibilidad de movimiento.
 *
 * `reducedMotion="user"` hace que TODOS los componentes de Motion respeten la
 * preferencia del sistema `prefers-reduced-motion`: desactiva animaciones de
 * transform/layout (mantiene opacity), sin tener que tocar cada componente.
 * El fallback CSS en globals.css solo afecta animaciones/transiciones CSS, no
 * las animaciones JS de Motion — por eso este wrapper es necesario.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
