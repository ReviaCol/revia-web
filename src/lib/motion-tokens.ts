/**
 * Motion tokens — Reviá
 *
 * Easing único de marca: out-expo suave, contemplativo, no juguetón.
 * Durations entre 0.6s y 1.2s. Stagger base 120ms.
 *
 * Sincronizado con final/motion-spec.md y brand-system.md (sección 6).
 */

export const easing = {
  outExpo: [0.22, 1, 0.36, 1] as const,
} as const;

export const duration = {
  short: 0.4,
  medium: 0.8,
  long: 1.0,
  xlong: 1.2,
} as const;

export const stagger = {
  base: 0.12,
  short: 0.08,
} as const;

/**
 * Variant base para reveals tipo cinematográfico.
 * Usar con motion.div / motion.span y `whileInView`.
 */
export const revealVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(8px)",
    y: 12,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: duration.long,
      ease: easing.outExpo,
    },
  },
} as const;

export const enterVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.medium,
      ease: easing.outExpo,
    },
  },
} as const;
