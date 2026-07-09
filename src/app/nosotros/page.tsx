import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ImageSlot } from "@/components/site/ImageSlot";
import { RevealsBootstrap } from "@/components/site/RevealsBootstrap";
import { getSpecialties } from "@/lib/equipo";
import { EquipoMedicos } from "./_components/EquipoMedicos";

export const metadata: Metadata = {
  title: "Nosotros — Reviá",
  alternates: { canonical: "/nosotros" },
  description:
    "Tecnología regenerativa no invasiva, un equipo multidisciplinario y 3.560 m² de infraestructura médica.",
};

// Tecnologías oficiales — del catálogo y sitemap
// (Células madre, exosomas, etc. son tratamientos confirmados en treatments.json)
const TECNOLOGIAS = [
  { n: "I",   t: "Células madre" },
  { n: "II",  t: "Exosomas" },
  { n: "III", t: "Bioestimuladores de colágeno" },
  { n: "IV",  t: "Plasma rico en plaquetas" },
  { n: "V",   t: "Radiofrecuencia de precisión" },
  { n: "VI",  t: "Terapia con NAD" },
];

export default async function NosotrosPage() {
  const especialidades = await getSpecialties();
  return (
    <>
      <SiteNav variant="solid" />
      <RevealsBootstrap />

      <main id="contenido">
        {/* TECNOLOGÍA */}
        <section
          className="sec"
          id="tecnologia"
          data-screen-label="Nosotros · Tecnología"
          style={{ paddingTop: "calc(var(--nav-h) + clamp(40px,6vw,80px))" }}
        >
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow" data-rev="up">Tecnología</p>
              <h2 data-rev="wipe" data-delay="100">
                Tecnología que <em>potencia</em> tu biología.
              </h2>
            </div>
            <div className="pgrid" data-stagger="80">
              {TECNOLOGIAS.map((p) => (
                <div className="pcard" key={p.n}>
                  <div className="pn">{p.n}</div>
                  <h3>{p.t}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EQUIPO — solo especialidades oficiales (sin nombres ni quotes inventadas) */}
        <section
          className="sec cream2"
          id="equipo"
          data-screen-label="Nosotros · Equipo"
        >
          <div className="wrap">
            <div className="sec-head" style={{ marginBottom: 0 }}>
              <p className="eyebrow" data-rev="up">Equipo</p>
              <h2
                data-rev="wipe"
                data-delay="100"
                style={{ fontSize: "clamp(30px,3.6vw,52px)" }}
              >
                Un equipo <em>multidisciplinario</em>.
              </h2>
            </div>
            <ul
              className="esp-grid"
              data-stagger="100"
              style={{
                listStyle: "none",
                padding: 0,
                margin: "clamp(36px,4vw,60px) 0 0",
                display: "grid",
                gap: "clamp(20px,2vw,28px) clamp(28px,3vw,52px)",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              }}
            >
              {especialidades.map((e) => (
                <li
                  key={e}
                  style={{
                    borderTop: "1px solid rgba(89,65,60,.18)",
                    paddingTop: "14px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                    fontSize: "clamp(20px,1.8vw,26px)",
                    lineHeight: 1.2,
                    color: "var(--ink-900)",
                  }}
                >
                  {e}
                </li>
              ))}
            </ul>

            {/* Médicos (CMS Fase 3, ADR 0017) — complementa las especialidades.
                No renderiza nada mientras no haya médicos visibles en la DB. */}
            <EquipoMedicos />
          </div>
        </section>

        {/* INFRAESTRUCTURA — cifras oficiales (brand-system.md §9.1) */}
        <section
          className="sec"
          id="infraestructura"
          data-screen-label="Nosotros · Infraestructura"
        >
          <div className="wrap split">
            <div className="visual" data-rev="img">
              <ImageSlot
                slot="equipo-infra"
                alt="Infraestructura Reviá"
                tone="warm"
              />
            </div>
            <div className="copy">
              <p className="eyebrow" data-rev="up">La casa</p>
              <h2 className="sec-head" data-rev="wipe" data-delay="100">
                3.560 m² diseñados para una experiencia médica de{" "}
                <em>excelencia</em>.
              </h2>
              <p className="body" data-rev="up" data-delay="220">
                Laboratorios propios, farmacias in-house, salas de recuperación
                especializadas, centro de esterilización y cámara hiperbárica.
              </p>
              <div
                className="stats"
                data-stagger="100"
                style={{ marginTop: "clamp(28px,3.4vw,44px)" }}
              >
                <div className="st">
                  <div className="v">3.560<small>m²</small></div>
                  <div className="k">Instalaciones</div>
                </div>
                <div className="st">
                  <div className="v">ISO 9001</div>
                  <div className="k">Certificación internacional</div>
                </div>
                <div className="st">
                  <div className="v">0</div>
                  <div className="k">Infecciones registradas</div>
                </div>
                <div className="st">
                  <div className="v">0</div>
                  <div className="k">Complicaciones registradas</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="closing warm" data-screen-label="Nosotros · Cierre">
          <p className="eyebrow on-dark cl-eyebrow" data-rev="up">Tu primer paso</p>
          <h2 data-rev="wipe" data-delay="100">Empieza con una <em>conversación</em>.</h2>
          <p className="cl-body" data-rev="up" data-delay="220">
            El primer paso siempre es escucharte.
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
