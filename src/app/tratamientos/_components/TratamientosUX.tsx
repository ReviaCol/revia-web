"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ImageSlot } from "@/components/site/ImageSlot";
import { CONCERNS } from "@/data/concerns";

/**
 * TratamientosExplorer — selector unificado del catálogo (ADR 0019).
 *
 * Un solo componente cliente que posee el estado de navegación y renderiza
 * las DOS superficies que antes vivían separadas y desconectadas:
 *   A) las 6 cards cinematográficas de categoría (ahora SON el selector), y
 *   B) el menú con doble eje de filtro (categoría + preocupación) y la grilla.
 *
 * Cambios vs. la versión anterior:
 *  - Las hero cards ya no son anclas (#corporal) que saltaban a un destino
 *    tapado por el nav: ahora fijan el filtro y hacen scroll suave con offset.
 *  - Entrada guiada: sin selección no se vuelca la grilla (decisión Andres).
 *  - Segundo eje "por preocupación" que cruza categorías (src/data/concerns.ts).
 *  - Transición Motion al cambiar de filtro; filtros/tabs se quedan fijos, sin
 *    auto-scroll salvo al elegir desde las hero cards o por deep-link de hash.
 *
 * Presentacional respecto a los datos: los tratamientos llegan por prop desde
 * el server component (/tratamientos/page.tsx → getCatalog()). NO reintroducir
 * listas literales de tratamientos aquí.
 *
 * Destino de cada card (decisión de Andres, 2026-07-09):
 *  - Corporal / Facial / Capilar → ficha /tratamientos/{cat}/{slug}
 *  - Longevidad → experiencia /longevidad/{slug}
 *  - Antienvejecimiento → su landing de programa /antienvejecimiento
 *  - Complementarios → /contacto (aún sin página propia)
 */

export type CategoryId =
  | "corporal"
  | "facial"
  | "capilar"
  | "antiedad"
  | "longevidad"
  | "complementarios";

export type UxTreatment = {
  cat: CategoryId;
  id: string;
  name: string;
  summary?: string;
  outcome?: string;
};

/** Meta presentacional de las 6 hero cards (estático, no depende del catálogo). */
type CategoryMeta = {
  id: CategoryId;
  n: string;
  label: string;
  bg: string;
  tone: "warm" | "cool" | "dark";
  slot: string;
  /** Si existe, la card navega ahí en vez de filtrar (Longevidad → su universo). */
  href?: string;
};

const CATEGORIES_META: CategoryMeta[] = [
  { id: "corporal", n: "01", label: "Corporal", bg: "var(--terra)", tone: "warm", slot: "cat-corporal" },
  { id: "facial", n: "02", label: "Facial", bg: "var(--ink-900)", tone: "dark", slot: "cat-facial" },
  { id: "capilar", n: "03", label: "Unidad Capilar", bg: "var(--ink-900)", tone: "dark", slot: "cat-capilar" },
  { id: "antiedad", n: "04", label: "Antienvejecimiento", bg: "var(--terra)", tone: "warm", slot: "cat-antiedad" },
  { id: "longevidad", n: "05", label: "Longevidad", bg: "var(--turq-deep)", tone: "cool", slot: "cat-longevidad", href: "/longevidad" },
  { id: "complementarios", n: "06", label: "Complementarios", bg: "var(--ink-900)", tone: "dark", slot: "cat-complementarios" },
];

const CAT_ORDER: CategoryId[] = [
  "corporal",
  "facial",
  "capilar",
  "antiedad",
  "longevidad",
  "complementarios",
];

const TAB_LABEL: Record<CategoryId, string> = {
  corporal: "Corporal",
  facial: "Facial",
  capilar: "Capilar",
  antiedad: "Antienvejecimiento",
  longevidad: "Longevidad & Bienestar",
  complementarios: "Complementarios",
};

const CAT_LABEL: Record<CategoryId, string> = {
  corporal: "Rejuvenecimiento Corporal",
  facial: "Rejuvenecimiento Facial",
  capilar: "Unidad Capilar",
  antiedad: "Programa Antienvejecimiento",
  longevidad: "Unidad de Bienestar, Nutrición Sostenible y Longevidad",
  complementarios: "Programas Complementarios",
};

const DEST_BY_CAT: Record<CategoryId, { href: (slug: string) => string; cue: string }> = {
  corporal: { href: (slug) => `/tratamientos/corporal/${slug}`, cue: "Conocer el tratamiento" },
  facial: { href: (slug) => `/tratamientos/facial/${slug}`, cue: "Conocer el tratamiento" },
  capilar: { href: (slug) => `/tratamientos/capilar/${slug}`, cue: "Conocer el tratamiento" },
  longevidad: { href: (slug) => `/longevidad/${slug}`, cue: "Conocer la experiencia" },
  antiedad: { href: () => "/antienvejecimiento", cue: "Ver el programa" },
  complementarios: { href: () => "/contacto", cue: "Consultar" },
};

const cueStyle: React.CSSProperties = {
  marginTop: "auto",
  paddingTop: "16px",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: "10px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--turq-deep)",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
};

/** Estado de selección. `none` = entrada guiada (grilla oculta). */
type Selection =
  | { k: "none" }
  | { k: "all" }
  | { k: "cat"; id: CategoryId }
  | { k: "concern"; id: string };

type Group = { key: string; eyebrow: string; note?: string; items: UxTreatment[] };

function TreatmentCard({ t }: { t: UxTreatment }) {
  const dest = DEST_BY_CAT[t.cat];
  return (
    <Link
      className="tx-card"
      href={dest.href(t.id)}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <span className="tx-chip">No invasivo</span>
      <h3>{t.name}</h3>
      {t.summary ? <p className="tx-sum">{t.summary}</p> : null}
      {t.outcome ? <p className="tx-outcome">{t.outcome}</p> : null}
      <span style={cueStyle}>
        {dest.cue}
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

export function TratamientosExplorer({ treatments }: { treatments: UxTreatment[] }) {
  const [sel, setSel] = useState<Selection>({ k: "none" });
  const reduce = useReducedMotion();
  const menuRef = useRef<HTMLElement>(null);

  const byId = useMemo(() => {
    const m = new Map<string, UxTreatment>();
    treatments.forEach((t) => m.set(t.id, t));
    return m;
  }, [treatments]);

  // Deep-linking por hash: /tratamientos#capilar (home, y el redirect de
  // /tratamientos/[categoria]) o #cabello (preocupación) preseleccionan el
  // filtro y hacen scroll al menú. Antes las hero cards eran anclas #cat; ahora
  // el hash lo resuelve el estado, así que esos links siguen funcionando —y
  // además filtran en vez de solo saltar.
  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, "");
    if (!raw) return;
    const hash = decodeURIComponent(raw);
    let next: Selection | null = null;
    if ((CAT_ORDER as string[]).includes(hash)) {
      next = { k: "cat", id: hash as CategoryId };
    } else if (CONCERNS.some((c) => c.id === hash)) {
      next = { k: "concern", id: hash };
    }
    if (!next) return;
    setSel(next);
    requestAnimationFrame(() => {
      menuRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    });
    // Solo al montar: preselección de entrada, no un listener continuo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const catCounts = useMemo(() => {
    const c: Record<string, number> = {};
    treatments.forEach((t) => {
      c[t.cat] = (c[t.cat] ?? 0) + 1;
    });
    return c;
  }, [treatments]);

  const concernCounts = useMemo(() => {
    const c: Record<string, number> = {};
    CONCERNS.forEach((con) => {
      c[con.id] = con.treatmentIds.filter((id) => byId.has(id)).length;
    });
    return c;
  }, [byId]);

  const groups: Group[] = useMemo(() => {
    if (sel.k === "none") return [];
    if (sel.k === "cat") {
      return [
        {
          key: sel.id,
          eyebrow: CAT_LABEL[sel.id],
          items: treatments.filter((t) => t.cat === sel.id),
        },
      ];
    }
    if (sel.k === "concern") {
      const con = CONCERNS.find((x) => x.id === sel.id);
      if (!con) return [];
      const items = con.treatmentIds
        .map((id) => byId.get(id))
        .filter((t): t is UxTreatment => Boolean(t));
      return [{ key: con.id, eyebrow: con.label, note: con.blurb, items }];
    }
    // all
    const out: Group[] = [];
    CAT_ORDER.forEach((id) => {
      const items = treatments.filter((t) => t.cat === id);
      if (items.length) out.push({ key: id, eyebrow: CAT_LABEL[id], items });
    });
    return out;
  }, [sel, treatments, byId]);

  const selKey =
    sel.k === "cat" || sel.k === "concern" ? `${sel.k}:${sel.id}` : sel.k;

  function pickCategory(id: CategoryId) {
    setSel((prev) =>
      prev.k === "cat" && prev.id === id ? { k: "none" } : { k: "cat", id },
    );
  }

  function pickCategoryFromHero(id: CategoryId) {
    setSel({ k: "cat", id });
    // Scroll suave al menú con el offset del nav (scroll-margin en .tx-menu).
    requestAnimationFrame(() => {
      menuRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  function pickConcern(id: string) {
    setSel((prev) =>
      prev.k === "concern" && prev.id === id ? { k: "none" } : { k: "concern", id },
    );
  }

  const total = treatments.length;

  return (
    <>
      {/* SECCIÓN A — Categorías cinematográficas (ahora selector) */}
      <section
        className="sec-tight"
        aria-label="Categorías de tratamientos"
        style={{ paddingTop: "calc(var(--nav-h) + clamp(32px,4vw,56px))" }}
      >
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: "clamp(24px,3vw,40px)" }}>
            <p className="eyebrow" data-rev="up">Tratamientos</p>
            <h2 data-rev="wipe" data-delay="100">
              Activamos lo que <em>ya eres</em>.
            </h2>
            <p
              className="body"
              data-rev="up"
              data-delay="220"
              style={{
                maxWidth: "620px",
                fontSize: "17px",
                lineHeight: 1.7,
                color: "var(--ink-700)",
                marginTop: "24px",
              }}
            >
              Un portafolio completo de medicina estética y regenerativa,
              siempre no invasiva. Elige por dónde empezar.
            </p>
          </div>

          <div className="cards6">
            {CATEGORIES_META.map((c, i) => {
              const inner = (
                <>
                  <ImageSlot slot={c.slot} alt={c.label} tone={c.tone} />
                  <div
                    className="veil"
                    style={
                      c.tone === "cool"
                        ? { background: "linear-gradient(180deg,rgba(20,55,58,.22),rgba(20,55,58,.92))" }
                        : undefined
                    }
                  />
                  <div className="tc-in">
                    <h3>{c.label}</h3>
                  </div>
                  <span className="tc-num">{c.n}</span>
                </>
              );
              const revProps = {
                "data-rev": "img",
                "data-delay": i ? String(i * 80) : undefined,
              } as const;
              if (c.href) {
                return (
                  <Link key={c.id} className="tcard" href={c.href} style={{ background: c.bg }} {...revProps}>
                    {inner}
                  </Link>
                );
              }
              return (
                <button
                  key={c.id}
                  type="button"
                  className="tcard"
                  data-picked={sel.k === "cat" && sel.id === c.id ? "true" : undefined}
                  style={{ background: c.bg }}
                  aria-label={`Ver tratamientos de ${c.label}`}
                  onClick={() => pickCategoryFromHero(c.id)}
                  {...revProps}
                >
                  {inner}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECCIÓN B — Menú con doble eje de filtro */}
      <section className="sec cream2 tx-menu" aria-label="Menú completo" ref={menuRef}>
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: "clamp(20px,2.4vw,32px)" }}>
            <p className="eyebrow" data-rev="up">El menú completo</p>
            <h2 data-rev="wipe" data-delay="100" style={{ fontSize: "clamp(28px,3.4vw,48px)" }}>
              Cada tratamiento, una forma de <em>revelarte</em>.
            </h2>
          </div>

          <div className="tx-filters" data-rev="up">
            <div className="tx-axis">
              <span className="tx-axis-label">Explora por categoría</span>
              <div className="tx-tabs" role="tablist" aria-label="Filtrar por categoría">
                <button
                  type="button"
                  role="tab"
                  aria-selected={sel.k === "all"}
                  className={`tx-tab${sel.k === "all" ? " is-active" : ""}`}
                  onClick={() => setSel(sel.k === "all" ? { k: "none" } : { k: "all" })}
                >
                  Todos
                  <span className="tx-tab-count">{total}</span>
                </button>
                {CAT_ORDER.map((id) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={sel.k === "cat" && sel.id === id}
                    className={`tx-tab${sel.k === "cat" && sel.id === id ? " is-active" : ""}`}
                    onClick={() => pickCategory(id)}
                  >
                    {TAB_LABEL[id]}
                    <span className="tx-tab-count">{catCounts[id] ?? 0}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="tx-axis">
              <span className="tx-axis-label">o por lo que buscas</span>
              <div className="tx-chips" role="group" aria-label="Filtrar por preocupación">
                {CONCERNS.map((con) => (
                  <button
                    key={con.id}
                    type="button"
                    aria-pressed={sel.k === "concern" && sel.id === con.id}
                    className={`tx-concern${sel.k === "concern" && sel.id === con.id ? " is-active" : ""}`}
                    onClick={() => pickConcern(con.id)}
                  >
                    {con.label}
                    <span className="tx-tab-count">{concernCounts[con.id] ?? 0}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="tx-results">
            <AnimatePresence mode="wait" initial={false}>
              {sel.k === "none" ? (
                <motion.div
                  key="empty"
                  className="tx-empty"
                  initial={reduce ? undefined : { opacity: 0 }}
                  animate={reduce ? undefined : { opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="tx-empty-mark" aria-hidden="true">↓</span>
                  <p className="tx-empty-line">
                    Elige una categoría o una preocupación
                    <br />
                    para revelar los tratamientos.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={selKey}
                  initial={reduce ? undefined : { opacity: 0, y: 12 }}
                  animate={reduce ? undefined : { opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  {groups.map((g) => (
                    <div className="tx-group" key={g.key}>
                      <div className="tx-group-head">
                        <span className="tx-group-eyebrow">{g.eyebrow}</span>
                        {g.note ? <span className="tx-group-note">{g.note}</span> : null}
                        <span className="tx-group-count">
                          {g.items.length} {g.items.length === 1 ? "tratamiento" : "tratamientos"}
                        </span>
                      </div>
                      <div className="tx-grid">
                        {g.items.map((t) => (
                          <TreatmentCard t={t} key={`${g.key}-${t.id}`} />
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
