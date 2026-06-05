import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ImageSlot } from "@/components/site/ImageSlot";
import { RevealsBootstrap } from "@/components/site/RevealsBootstrap";

export const metadata: Metadata = {
  title: "Longevidad & Bienestar — Reviá",
  alternates: { canonical: "/longevidad" },
  description:
    "Unidad de Bienestar, Nutrición Sostenible y Longevidad. Un universo aparte de la estética.",
};

// Nombres oficiales del catálogo (04-content/treatments.json)
const EXPERIENCIAS = [
  { cls: "e1", num: "01", slot: "exp-exomind",   t: "Neuro-Reset con EXOMIND" },
  { cls: "e2", num: "02", slot: "exp-fuego",     t: "Circuito de Contraste (Fuego y Hielo)" },
  { cls: "e3", num: "03", slot: "exp-flotacion", t: "Cápsulas de Flotación" },
  { cls: "e4", num: "04", slot: "exp-exilis",    t: "Medicina Regenerativa con Exilis" },
  { cls: "e5", num: "05", slot: "exp-camina",    t: "Caminadoras Subacuáticas" },
];

// Membresías VIP — nombres oficiales del sitemap (00-context/sitemap.md líneas 59-60)
const MEMBRESIAS = [
  { tier: "Esencial",  name: "Salud Funcional",        featured: false },
  { tier: "Premium",   name: "Recuperación Ejecutiva", featured: true },
  { tier: "Élite",     name: "Biohacker Élite",        featured: false },
];

export default function LongevidadPage() {
  return (
    <>
      <SiteNav variant="solid" />
      <RevealsBootstrap />

      <main id="contenido">
        <section className="page-hero on-teal" data-screen-label="Longevidad · Hero">
          <div className="ph-inner">
            <p className="eyebrow cool" data-rev="up">Unidad de Bienestar</p>
            <h1 data-rev="up" data-delay="100">Redefiniendo tu <em>edad biológica</em>.</h1>
            <p className="ph-sub" data-rev="up" data-delay="220">
              Un universo aparte de la estética. La Unidad de Bienestar tiene
              su propio lenguaje. Tu salud, tu mayor ventaja.
            </p>
          </div>
        </section>

        {/* EXPERIENCIAS — los 5 tratamientos oficiales de la Unidad de Bienestar */}
        <section className="sec cream2 coolsec" id="experiencias" data-screen-label="Longevidad · Experiencias">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow" data-rev="up">El santuario</p>
              <h2 data-rev="wipe" data-delay="100">Experiencias que <em>recalibran</em>.</h2>
            </div>
            <div className="exp-grid">
              {EXPERIENCIAS.map((e, i) => (
                <Link
                  key={e.cls}
                  className={`expcard ${e.cls}`}
                  href="/contacto?service=longevidad-bienestar"
                  data-rev="img"
                  data-delay={i ? String(i * 80 + 40) : undefined}
                >
                  <ImageSlot slot={e.slot} alt={e.t} tone="cool" />
                  <div className="veil" />
                  <span className="ec-num">{e.num}</span>
                  <div className="ec-in">
                    <h3>{e.t}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* MEMBRESÍAS — solo nombres oficiales (Salud Funcional, Recuperación Ejecutiva, Biohacker Élite) */}
        <section className="sec coolsec" id="membresias" data-screen-label="Longevidad · Membresías">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow" data-rev="up">Membresías VIP</p>
              <h2 data-rev="wipe" data-delay="100">Tres formas de hacer de tu salud una <em>ventaja</em>.</h2>
            </div>
            <div className="membership-grid" data-stagger="120">
              {MEMBRESIAS.map((m) => (
                <article
                  key={m.name}
                  className={`membership-card${m.featured ? " featured" : ""}`}
                >
                  {m.featured && <span className="m-badge">Más popular</span>}
                  <div className="m-tier">{m.tier}</div>
                  <h3>{m.name}</h3>
                  <Link
                    className="m-cta"
                    href="/contacto?service=longevidad-bienestar#agendar"
                  >
                    <span>Hablar con un asesor</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="closing cool" data-screen-label="Longevidad · Cierre">
          <p className="eyebrow on-dark cl-eyebrow" data-rev="up">Tu primer paso</p>
          <h2 data-rev="wipe" data-delay="100">Conversemos sobre tu <em>edad biológica</em>.</h2>
          <p className="cl-body" data-rev="up" data-delay="220">
            Empieza con una valoración.
          </p>
          <Link className="cl-cta" href="/contacto?service=longevidad-bienestar#agendar" data-rev="up" data-delay="320">
            Agendar consulta <span className="arw">→</span>
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
