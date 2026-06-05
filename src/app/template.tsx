"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * template.tsx — page transitions (sitemap §17: fade + slight scale 0.98 → 1).
 *
 * En App Router, template.tsx re-monta en cada navegación cliente, así que basta
 * con una animación de entrada (sin AnimatePresence de salida, frágil en App
 * Router). Decisiones de marca/robustez:
 *
 * 1. PRIMER MOUNT (carga directa / refresh): se omite la transición. Así el Hero
 *    (u otra página) reproduce su propia entrada sin una segunda capa encima, y
 *    no penalizamos el LCP de la home. Un flag a nivel de módulo persiste entre
 *    re-mounts del template dentro de la misma sesión SPA; se lee una sola vez en
 *    el inicializador de estado y se actualiza en un efecto (nunca en render).
 * 2. NAVEGACIONES: fade + scale 0.98 → 1 con el easing único de marca.
 * 3. prefers-reduced-motion: degrada a opacity-only (sin transform/scale).
 * 4. Al terminar, se limpia el transform inline (transform: none) para no dejar
 *    un containing-block que descoloque elementos position:fixed (overlay mobile).
 */

let hasNavigatedOnce = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  // Lectura única del flag de sesión (no reasignación) en el inicializador.
  const [isFirstMount] = useState(() => !hasNavigatedOnce);

  useEffect(() => {
    // A partir del primer mount, los próximos serán navegaciones cliente.
    hasNavigatedOnce = true;
  }, []);

  // Carga directa / refresh: sin transición (protege LCP, evita doble animación).
  if (isFirstMount) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      ref={ref}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      transition={{
        duration: reduce ? duration.short : duration.medium,
        ease: easing.outExpo,
      }}
      style={{ transformOrigin: "top center" }}
      onAnimationComplete={() => {
        // Suelta el transform en reposo: evita que un transform residual cree un
        // containing-block para descendientes position:fixed (overlay nav mobile).
        if (ref.current) ref.current.style.transform = "none";
      }}
    >
      {children}
    </motion.div>
  );
}
