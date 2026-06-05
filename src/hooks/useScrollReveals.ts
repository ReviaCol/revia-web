"use client";

import { useEffect } from "react";

/**
 * useScrollReveals — port directo de revia-home.js + revia-page.js (mockup
 * Claude Design). Escanea elementos con [data-rev] o [data-stagger], y al
 * entrar al viewport (88% threshold) les añade la clase `.in` para activar
 * la transición CSS definida en design.css.
 *
 *   data-rev="up" | "wipe" | "img" | "fade"
 *   data-delay="120"   → transition-delay en ms (aplicado vía style inline)
 *   data-stagger="80"  → cada hijo se anima con stepX ms de delay
 *
 * Respeta `prefers-reduced-motion` vía las reglas globales del design.css.
 *
 * Uso: invocar una sola vez por página desde un component "use client":
 *   useScrollReveals();
 */
export function useScrollReveals() {
  useEffect(() => {
    let items: HTMLElement[] = Array.from(
      document.querySelectorAll<HTMLElement>("[data-rev],[data-stagger]")
    );

    function reveal() {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      items = items.filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.88 && r.bottom > 0) {
          const delay = el.getAttribute("data-delay");
          if (delay) el.style.transitionDelay = delay + "ms";
          if (el.hasAttribute("data-stagger")) {
            const step = parseInt(el.getAttribute("data-stagger") || "90", 10) || 90;
            Array.from(el.children).forEach((c, i) => {
              (c as HTMLElement).style.transitionDelay = i * step + "ms";
            });
          }
          el.classList.add("in");
          return false;
        }
        return true;
      });
    }

    window.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("resize", reveal, { passive: true });

    // Double rAF para layout estable + red de seguridad
    requestAnimationFrame(() => requestAnimationFrame(reveal));
    const t = window.setTimeout(reveal, 200);
    window.addEventListener("load", reveal);

    return () => {
      window.removeEventListener("scroll", reveal);
      window.removeEventListener("resize", reveal);
      window.removeEventListener("load", reveal);
      window.clearTimeout(t);
    };
  }, []);
}

/**
 * useNavScrollState — port del onScroll de revia-home.js.
 * Añade/quita la clase `scrolled` a [data-nav] cuando se pasa del hero.
 * Solo aplica en home (donde hay hero full-bleed); las páginas interiores
 * usan `nav solid` permanente.
 */
export function useNavScrollState(opts?: { heroSelector?: string }) {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("[data-nav]");
    const hero = document.querySelector<HTMLElement>(
      opts?.heroSelector || ".hero"
    );
    if (!nav) return;

    function onScroll() {
      const threshold = hero ? hero.offsetHeight - 90 : 200;
      if (!nav) return;
      if (window.scrollY > threshold) {
        nav.classList.add("scrolled");
        nav.classList.remove("on-hero");
      } else {
        nav.classList.remove("scrolled");
        if (hero) nav.classList.add("on-hero");
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [opts?.heroSelector]);
}
