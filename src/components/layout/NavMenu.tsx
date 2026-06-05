"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";
import { NAV_ITEMS, type NavItem } from "./nav-items";

/**
 * NavMenu — piezas de navegación compartidas por SiteNav (páginas dedicadas) y
 * Navbar (hero de la home). Centraliza los mega-menús desktop y el overlay
 * mobile con accordions para no duplicar lógica entre ambas navs.
 *
 * Marca: easing único out-expo, reveals suaves (blur+opacity+y, sin slide/bounce).
 * Respeta prefers-reduced-motion (degrada a opacity-only). El panel de "Longevidad"
 * adopta el shift cromático cool sin contaminar el resto de la nav warm.
 */

const COOL = {
  panelBg: "rgba(251, 246, 241, 0.96)", // sky-50
  border: "rgba(89, 65, 60, 0.12)",
  overview: "var(--revia-sky-700)",
  rule: "var(--revia-sky-200)",
  leaf: "var(--revia-deepblue-900)",
  leafDim: "var(--revia-sky-700)",
  accent: "var(--revia-sky-500)",
} as const;

const WARM = {
  panelBg: "rgba(251, 246, 241, 0.96)", // cream-50
  border: "rgba(89, 65, 60, 0.12)",
  overview: "var(--revia-coffee-700)",
  rule: "rgba(89, 65, 60, 0.14)",
  leaf: "var(--revia-coffee-900)",
  leafDim: "var(--revia-coffee-700)",
  accent: "var(--revia-terracotta-600)",
} as const;

function palette(tone: NavItem["tone"]) {
  return tone === "cool" ? COOL : WARM;
}

/* ============================================================================
   DESKTOP — lista horizontal con mega-menús (hover / focus / tap)
   ========================================================================== */

export function DesktopNavList({ current }: { current?: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useReducedMotion();
  const baseId = useId();

  // Cerrar al hacer click fuera (cubre el caso tap en touch, donde no hay mouseleave).
  useEffect(() => {
    if (openIdx === null) return;
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenIdx(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openIdx]);

  const close = (focusTrigger?: number) => {
    setOpenIdx(null);
    if (focusTrigger != null) triggerRefs.current[focusTrigger]?.focus();
  };

  return (
    <nav ref={navRef} aria-label="Principal" className="hidden md:block">
      <ul className="flex items-center gap-11 list-none m-0 p-0">
        {NAV_ITEMS.map((item, i) => {
          const isCurrent = current === item.href;
          const hasMenu = !!item.menu?.length;

          if (!hasMenu) {
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`font-body text-[14px] font-medium uppercase tracking-[0.08em] transition-colors duration-200 ${
                    isCurrent
                      ? "text-coffee-900"
                      : "text-coffee-700 hover:text-coffee-900 focus-visible:text-coffee-900"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          const open = openIdx === i;
          const panelId = `${baseId}-mega-${i}`;
          const c = palette(item.tone);

          return (
            <li
              key={item.href}
              className="relative"
              onMouseEnter={() => setOpenIdx(i)}
              onMouseLeave={() => setOpenIdx(null)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setOpenIdx((cur) => (cur === i ? null : cur));
                }
              }}
            >
              <button
                ref={(el) => {
                  triggerRefs.current[i] = el;
                }}
                type="button"
                aria-haspopup="true"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIdx(open ? null : i)}
                onFocus={() => setOpenIdx(i)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.stopPropagation();
                    close(i);
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpenIdx(i);
                    const panel = document.getElementById(panelId);
                    panel?.querySelector<HTMLAnchorElement>("a")?.focus();
                  }
                }}
                className={`inline-flex items-center gap-1.5 font-body text-[14px] font-medium uppercase tracking-[0.08em] transition-colors duration-200 ${
                  isCurrent || open
                    ? "text-coffee-900"
                    : "text-coffee-700 hover:text-coffee-900 focus-visible:text-coffee-900"
                }`}
              >
                {item.label}
                <svg
                  aria-hidden="true"
                  width="9"
                  height="9"
                  viewBox="0 0 10 10"
                  className="transition-transform duration-300 ease-out"
                  style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-label={item.label}
                    className="absolute left-0 top-full pt-4"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, filter: "blur(6px)" }}
                    animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, filter: "blur(6px)" }}
                    transition={{ duration: reduce ? duration.short : duration.medium, ease: easing.outExpo }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.stopPropagation();
                        close(i);
                      }
                    }}
                  >
                    <div
                      className="min-w-[260px]"
                      style={{
                        background: c.panelBg,
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: `1px solid ${c.border}`,
                        borderRadius: "2px",
                        boxShadow: "0 24px 60px -28px rgba(89, 65, 60, 0.34)",
                        padding: "22px 26px 24px",
                      }}
                    >
                      {item.overviewLabel && (
                        <Link
                          href={item.href}
                          onClick={() => setOpenIdx(null)}
                          className="font-body inline-flex items-center gap-2 uppercase group"
                          style={{
                            fontSize: "11px",
                            letterSpacing: "0.2em",
                            color: c.overview,
                            paddingBottom: "16px",
                            marginBottom: "16px",
                            borderBottom: `1px solid ${c.rule}`,
                            width: "100%",
                          }}
                        >
                          {item.overviewLabel}
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      )}

                      <ul className="list-none m-0 p-0 grid gap-3.5">
                        {item.menu!.map((leaf) => (
                          <li key={leaf.href}>
                            <Link
                              href={leaf.href}
                              onClick={() => setOpenIdx(null)}
                              className="font-display group inline-flex items-center justify-between gap-6 w-full transition-colors duration-200"
                              style={{ fontSize: "18px", lineHeight: 1.25, letterSpacing: "-0.01em", color: c.leaf }}
                            >
                              <span className="transition-colors duration-200 group-hover:[color:var(--hover)] group-focus-visible:[color:var(--hover)]" style={{ ["--hover" as string]: c.accent }}>
                                {leaf.label}
                              </span>
                              <span
                                aria-hidden="true"
                                className="opacity-0 -translate-x-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0"
                                style={{ color: c.accent, fontSize: "15px" }}
                              >
                                →
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ============================================================================
   MOBILE — botón hamburger + overlay full-screen con accordions
   ========================================================================== */

export function NavMobile({
  current,
  panelId = "mobile-menu",
}: {
  current?: string;
  panelId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const reduce = useReducedMotion();

  // Bloqueo de scroll del body mientras el overlay está abierto.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Cerrar overlay con Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeAll = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menú"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center justify-center text-coffee-900"
        style={{ width: "44px", height: "44px", fontSize: "22px", lineHeight: 1 }}
      >
        ☰
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="fixed inset-0 z-[60] md:hidden flex flex-col overflow-y-auto"
            style={{ background: "var(--revia-cream-50)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.short, ease: easing.outExpo }}
          >
            <div className="flex items-center justify-between shrink-0" style={{ padding: "28px var(--gutter) 0" }}>
              <Image
                src="/brand/revia-logo-terra-transparent.svg"
                alt="Reviá — Belleza y Vitalidad"
                width={140}
                height={40}
                className="h-[36px] w-auto"
              />
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={closeAll}
                className="inline-flex items-center justify-center text-coffee-900"
                style={{ width: "44px", height: "44px", fontSize: "26px", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            <nav
              aria-label="Principal"
              className="flex-1 flex flex-col justify-center"
              style={{ padding: "40px var(--gutter)" }}
            >
              <ul className="list-none m-0 p-0 grid gap-6">
                {NAV_ITEMS.map((item, i) => {
                  const hasMenu = !!item.menu?.length;
                  const isExpanded = expanded === i;
                  const accordionId = `${panelId}-acc-${i}`;
                  const c = palette(item.tone);

                  return (
                    <motion.li
                      key={item.href}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      transition={{
                        duration: duration.medium,
                        ease: easing.outExpo,
                        delay: 0.05 + i * 0.05,
                      }}
                    >
                      {!hasMenu ? (
                        <Link
                          href={item.href}
                          onClick={closeAll}
                          aria-current={current === item.href ? "page" : undefined}
                          className="font-display block text-coffee-900"
                          style={{
                            fontSize: "clamp(30px, 8vw, 42px)",
                            lineHeight: 1.1,
                            letterSpacing: "-0.012em",
                            fontWeight: current === item.href ? 500 : 400,
                          }}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <>
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            aria-controls={accordionId}
                            onClick={() => setExpanded(isExpanded ? null : i)}
                            className="font-display w-full flex items-center justify-between gap-4 text-coffee-900"
                            style={{
                              fontSize: "clamp(30px, 8vw, 42px)",
                              lineHeight: 1.1,
                              letterSpacing: "-0.012em",
                              fontWeight: current === item.href ? 500 : 400,
                            }}
                          >
                            <span>{item.label}</span>
                            <svg
                              aria-hidden="true"
                              width="20"
                              height="20"
                              viewBox="0 0 10 10"
                              className="shrink-0 transition-transform duration-300 ease-out"
                              style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                            >
                              <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.ul
                                id={accordionId}
                                className="list-none m-0 p-0 grid gap-3 overflow-hidden"
                                style={{ paddingTop: "16px", paddingLeft: "2px" }}
                                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                                transition={{ duration: duration.short, ease: easing.outExpo }}
                              >
                                {item.overviewLabel && (
                                  <li>
                                    <Link
                                      href={item.href}
                                      onClick={closeAll}
                                      className="font-body inline-flex items-center gap-2 uppercase"
                                      style={{ fontSize: "11px", letterSpacing: "0.18em", color: c.overview }}
                                    >
                                      {item.overviewLabel}
                                      <span aria-hidden="true">→</span>
                                    </Link>
                                  </li>
                                )}
                                {item.menu!.map((leaf) => (
                                  <li key={leaf.href}>
                                    <Link
                                      href={leaf.href}
                                      onClick={closeAll}
                                      className="font-display block"
                                      style={{ fontSize: "20px", lineHeight: 1.3, color: c.leafDim }}
                                    >
                                      {leaf.label}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div
              className="font-body text-coffee-700 shrink-0"
              style={{ padding: "0 var(--gutter) 40px", fontSize: "13px", lineHeight: 1.7 }}
            >
              <p className="m-0">Cra 16 # 86B-52, Bogotá</p>
              <a href="tel:+573188279094" className="text-coffee-900">
                +57 318 827 9094
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
