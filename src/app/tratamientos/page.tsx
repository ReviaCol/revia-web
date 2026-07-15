import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { RevealsBootstrap } from "@/components/site/RevealsBootstrap";
import { getCatalog } from "@/lib/catalog";
import {
  TratamientosExplorer,
  type CategoryId,
  type UxTreatment,
} from "./_components/TratamientosUX";

export const metadata: Metadata = {
  title: "Tratamientos — Reviá",
  alternates: { canonical: "/tratamientos" },
  description:
    "Portafolio completo de medicina estética y regenerativa, siempre no invasiva. Tratamientos faciales, corporales, capilares y antienvejecimiento.",
};

/** Mapea el id de categoría del catálogo (DB/JSON) → id de tab del explorer. */
const DB_TO_UX: Record<string, CategoryId> = {
  "no-invasivos-corporal": "corporal",
  "no-invasivos-facial": "facial",
  "implante-capilar": "capilar",
  antienvejecimiento: "antiedad",
  "longevidad-bienestar": "longevidad",
  complementarios: "complementarios",
};

/**
 * /tratamientos — selector unificado (ADR 0019).
 *
 * Toda la parte interactiva (hero cards de categoría + menú con doble eje de
 * filtro + grilla) vive en <TratamientosExplorer>, un único client component
 * que posee el estado. Antes las hero cards eran anclas desconectadas del menú
 * y saltaban a un destino tapado por el nav; ahora fijan el filtro y hacen
 * scroll suave con offset. Entrada guiada: la grilla aparece al elegir.
 *
 * El catálogo se alimenta de getCatalog() (Supabase con fallback al JSON): una
 * sola fuente, sin lista hardcodeada (CMS Fase 1, ADR 0014).
 */
export default async function TratamientosPage() {
  const catalog = await getCatalog();
  const uxTreatments: UxTreatment[] = catalog.flatMap((c) => {
    const cat = DB_TO_UX[c.id];
    if (!cat) return [];
    return c.treatments.map((t) => ({
      cat,
      id: t.id,
      name: t.name,
      summary: t.summary,
      outcome: t.outcome,
    }));
  });

  return (
    <>
      <SiteNav variant="solid" />
      <RevealsBootstrap />

      <main id="contenido">
        <TratamientosExplorer treatments={uxTreatments} />

        {/* CLOSING */}
        <section className="closing warm" data-screen-label="Tratamientos · Cierre">
          <p className="eyebrow on-dark cl-eyebrow" data-rev="up">Tu primer paso</p>
          <h2 data-rev="wipe" data-delay="100">
            Empieza por la <em>valoración</em>.
          </h2>
          <p className="cl-body" data-rev="up" data-delay="220">
            Diagnosticamos juntos cuál es el camino más honesto para ti.
          </p>
          <Link className="cl-cta" href="/contacto#agendar" data-rev="up" data-delay="320">
            Agendar consulta <span className="arw">→</span>
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
