"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { BookingWidget } from "./BookingWidget";

/**
 * BookingCta — disparador editorial de la reserva nativa.
 *
 * Botón compacto + modal accesible con BookingWidget. El modal se renderiza
 * en un Portal a `document.body` para evitar que CUALQUIER ancestor con
 * `transform`, `filter`, `perspective`, `will-change` o `contain` rompa el
 * `position: fixed` del modal (problema clásico de containing blocks).
 *
 * Esto pasó en demo con cliente: el modal aparecía recortado y descentrado
 * porque vivía dentro de una card con overflow:hidden y animaciones Motion.
 * Con Portal el modal es hijo directo del body, no de las cards.
 *
 * Cierre por Escape, click-outside, foco devuelto al trigger.
 */
export function BookingCta() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Portal solo funciona después del mount (necesita document.body)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [open, close]);

  const modal = (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="booking-modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="booking-scrim" onClick={close} aria-hidden="true" />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Agendar valoración en Reviá"
            className="booking-panel"
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="booking-close"
            >
              ×
            </button>
            <div className="booking-panel-inner">
              <BookingWidget onClose={close} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="booking-trigger group"
      >
        <span className="lbl">Agendar consulta</span>
        <span aria-hidden="true" className="arw">→</span>
      </button>

      {mounted ? createPortal(modal, document.body) : null}
    </>
  );
}
