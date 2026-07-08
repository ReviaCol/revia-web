"use client";

import { useState } from "react";

/**
 * TratamientosUX — vista navegable del catálogo oficial.
 *
 * Los nombres y categorías vienen de `04-content/treatments.json` y
 * `05-src/src/data/treatments.json`. NO incluye duraciones, precios ni
 * promesas de resultado, porque esos datos no están validados con el
 * equipo médico de Reviá (deuda en `08-workflow/debt.md`).
 */

type Treatment = {
  cat: CategoryId;
  name: string;
};

type CategoryId =
  | "corporal"
  | "facial"
  | "capilar"
  | "antiedad"
  | "longevidad"
  | "complementarios";

const CATEGORIES: { id: CategoryId | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "corporal", label: "Corporal" },
  { id: "facial", label: "Facial" },
  { id: "capilar", label: "Capilar" },
  { id: "antiedad", label: "Antienvejecimiento" },
  { id: "longevidad", label: "Longevidad & Bienestar" },
  { id: "complementarios", label: "Complementarios" },
];

// Nombres extraídos directo de treatments.json (catálogo oficial)
const TREATMENTS: Treatment[] = [
  // Rejuvenecimiento Corporal
  { cat: "corporal", name: "Protocolo Anti-Celulitis" },
  { cat: "corporal", name: "Moldeado Corporal" },
  // Rejuvenecimiento Facial
  { cat: "facial", name: "Limpieza Facial" },
  { cat: "facial", name: "Bioenzimas y Enzimas Recombinantes" },
  { cat: "facial", name: "Terapia Biológica" },
  { cat: "facial", name: "Toxina Botulínica" },
  { cat: "facial", name: "Toxina Anti-Sudoración" },
  { cat: "facial", name: "Ácido Hialurónico" },
  { cat: "facial", name: "Bioestimuladores de Colágeno" },
  { cat: "facial", name: "Rejuvenecimiento Facial 360" },
  { cat: "facial", name: "Radiofrecuencia Fraccionada" },
  { cat: "facial", name: "Blefaroplastia No Invasiva" },
  { cat: "facial", name: "Plasma Rico en Plaquetas" },
  // Unidad Capilar
  { cat: "capilar", name: "Reviá NUTRI-FOL" },
  { cat: "capilar", name: "Plasma Rico Potenciado (PRP)" },
  { cat: "capilar", name: "Reviá FOLI-ACTIV" },
  { cat: "capilar", name: "Reviá PLASMA-BOOST" },
  { cat: "capilar", name: "Reviá REGEN-EX" },
  { cat: "capilar", name: "Técnica DHI y Zafiro" },
  { cat: "capilar", name: "Micro-injerto Capilar F.U.E." },
  { cat: "capilar", name: "Densificación Capilar Non-Shaven" },
  { cat: "capilar", name: "Restauración de Barba" },
  { cat: "capilar", name: "Restauración de Cejas" },
  // Programa Antienvejecimiento
  { cat: "antiedad", name: "Terapia con Vitamina C de alta concentración" },
  { cat: "antiedad", name: "Terapia con NAD" },
  { cat: "antiedad", name: "Células Madre" },
  { cat: "antiedad", name: "Exosomas" },
  // Unidad de Bienestar, Nutrición Sostenible y Longevidad
  { cat: "longevidad", name: "Neuro-Reset con EXOMIND" },
  { cat: "longevidad", name: "Circuito de Contraste (Fuego y Hielo)" },
  { cat: "longevidad", name: "Cápsulas de Flotación" },
  { cat: "longevidad", name: "Medicina Regenerativa con Exilis" },
  { cat: "longevidad", name: "Caminadoras Subacuáticas" },
  // Programas Complementarios
  { cat: "complementarios", name: "Portafolio Vascular en Estética" },
  { cat: "complementarios", name: "Programa de Manejo de Sobrepeso y Obesidad" },
  { cat: "complementarios", name: "Programa de Sueño" },
];

const CAT_LABEL: Record<CategoryId, string> = {
  corporal: "Rejuvenecimiento Corporal",
  facial: "Rejuvenecimiento Facial",
  capilar: "Unidad Capilar",
  antiedad: "Programa Antienvejecimiento",
  longevidad: "Unidad de Bienestar, Nutrición Sostenible y Longevidad",
  complementarios: "Programas Complementarios",
};

export function TratamientosUX() {
  const [active, setActive] = useState<CategoryId | "todos">("todos");

  const counts: Record<string, number> = { todos: TREATMENTS.length };
  TREATMENTS.forEach((t) => {
    counts[t.cat] = (counts[t.cat] ?? 0) + 1;
  });

  const groups: { id: CategoryId; label: string; items: Treatment[] }[] = [];
  if (active === "todos") {
    (["corporal", "facial", "capilar", "antiedad", "longevidad", "complementarios"] as CategoryId[]).forEach((id) => {
      const items = TREATMENTS.filter((t) => t.cat === id);
      if (items.length) groups.push({ id, label: CAT_LABEL[id], items });
    });
  } else {
    groups.push({ id: active, label: CAT_LABEL[active], items: TREATMENTS.filter((t) => t.cat === active) });
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
              <article className="tx-card" key={t.name}>
                <span className="tx-chip">No invasivo</span>
                <h3>{t.name}</h3>
              </article>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
