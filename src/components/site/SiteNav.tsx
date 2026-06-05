"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * SiteNav — port del header del mockup Claude Design.
 *
 * Tres estados:
 *   - `nav on-hero`  → sobre el hero (texto cream, logo cream visible)
 *   - `nav scrolled` → sobre cream institucional (texto coffee, logo terra)
 *   - `nav solid`    → páginas interiores sin hero (cream backdrop permanente)
 *
 * Usa `variant`:
 *   - "home"   → estado dinámico on-hero/scrolled (se controla con el hook)
 *   - "solid"  → solid permanente (interiores)
 *   - "teal"   → solid sobre fondo teal (Longevidad — opcional)
 */

const LINKS = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/tratamientos", label: "Tratamientos" },
  { href: "/longevidad", label: "Longevidad" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteNav({
  variant = "solid",
}: {
  variant?: "home" | "solid" | "teal";
}) {
  const [open, setOpen] = useState(false);

  // Lock scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Esc cierra el menú
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navClass =
    variant === "home"
      ? "nav on-hero"
      : variant === "teal"
      ? "nav solid teal-nav"
      : "nav solid";

  return (
    <>
      <header className={navClass} data-nav>
        <Link href="/" className="brand" aria-label="Reviá — inicio">
          <Image
            className="logo-terra"
            src="/brand/revia-logo-terra.png"
            alt="Reviá"
            width={140}
            height={40}
            priority
          />
          <Image
            className="logo-cream"
            src="/brand/revia-logo-cream.png"
            alt="Reviá"
            width={140}
            height={40}
            priority
          />
        </Link>

        <nav className="nav-links" aria-label="Principal">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <Link className="nav-cta desk" href="/contacto#agendar">
          Agendar consulta
        </Link>

        <button
          className="nav-burger"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Overlay mobile */}
      <div
        id="mobile-menu"
        className={`mobile-menu${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
      >
        <button
          className="close"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link className="mcta" href="/contacto#agendar" onClick={() => setOpen(false)}>
          Agendar consulta
        </Link>
      </div>
    </>
  );
}
