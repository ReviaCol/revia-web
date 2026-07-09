"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * TratamientosUX — vista navegable del catálogo oficial (tabs + cards).
 *
 * Presentacional: los tratamientos llegan por prop desde el server component
 * (/tratamientos/page.tsx), que los lee de getCatalog() (Supabase con fallback
 * al JSON). Antes había una copia hardcodeada aquí — se eliminó al colapsar el
 * catálogo a una sola fuente (CMS Fase 1, ADR 0014). NO reintroducir listas
 * literales en este archivo.
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
};

const CATEGORIES: { id: CategoryId | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "corporal", label: "Corporal" },
  { id: "facial", label: "Facial" },
  { id: "capilar", label: "Capilar" },
  { id: "antiedad", label: "Antienvejecimiento" },
  { id: "longevidad", label: "Longevidad & Bienestar" },
  { id: "complementarios", label: "Complementarios" },
];

const CAT_ORDER: CategoryId[] = [
  "corporal",
  "facial",
  "capilar",
  "antiedad",
  "longevidad",
  "complementarios",
];

const CAT_LABEL: Record<CategoryId, string> = {
  corporal: "Rejuvenecimiento Corporal",
  facial: "Rejuvenecimiento Facial",
  capilar: "Unidad Capilar",
  antiedad: "Programa Antienvejecimiento",
  longevidad: "Unidad de Bienestar, Nutrición Sostenible y Longevidad",
  complementarios: "Programas Complementarios",
};

/**
 * Destino de cada card por categoría. `href` recibe el slug del tratamiento;
 * las categorías sin ficha individual (antiedad, complementarios) lo ignoran y
 * mandan a una página fija. `cue` es el texto de la señal de enlace en la card.
 */
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
      <span style={cueStyle}>
        {dest.cue}
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

export function TratamientosUX({ treatments }: { treatments: UxTreatment[] }) {
  const [active, setActive] = useState<CategoryId | "todos">("todos");

  const counts: Record<string, number> = { todos: treatments.length };
  treatments.forEach((t) => {
    counts[t.cat] = (counts[t.cat] ?? 0) + 1;
  });

  const groups: { id: CategoryId; label: string; items: UxTreatment[] }[] = [];
  if (active === "todos") {
    CAT_ORDER.forEach((id) => {
      const items = treatments.filter((t) => t.cat === id);
      if (items.length) groups.push({ id, label: CAT_LABEL[id], items });
    });
  } else {
    groups.push({
      id: active,
      label: CAT_LABEL[active],
      items: treatments.filter((t) => t.cat === active),
    });
  }

  return (
    <>
      <div className="tx-tabs" role="tablist" aria-label="Filtrar por categoría">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={active === c.id}
            className={`tx-tab${active === c.id ? " is-active" : ""}`}
            onClick={() => setActive(c.id)}
          >
            {c.label}
            <span className="tx-tab-count">{counts[c.id] ?? 0}</span>
          </button>
        ))}
      </div>

      {groups.map((g) => (
        <div className="tx-group" key={g.id} id={g.id}>
          <div className="tx-group-head">
            <span className="tx-group-eyebrow">{g.label}</span>
            <span className="tx-group-count">
              {g.items.length} {g.items.length === 1 ? "tratamiento" : "tratamientos"}
            </span>
          </div>
          <div className="tx-grid">
            {g.items.map((t) => (
              <TreatmentCard t={t} key={t.id} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
