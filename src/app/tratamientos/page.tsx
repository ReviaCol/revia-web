import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ImageSlot } from "@/components/site/ImageSlot";
import { RevealsBootstrap } from "@/components/site/RevealsBootstrap";
import { TratamientosUX } from "./_components/TratamientosUX";

export const metadata: Metadata = {
  title: "Tratamientos — Reviá",
  alternates: { canonical: "/tratamientos" },
  description:
    "Portafolio completo de medicina estética y regenerativa, siempre no invasiva. Tratamientos faciales, corporales, capilares y antienvejecimiento.",
};

const CATEGORIES = [
  { id: "corporal", n: "01", t: "Corporal", bg: "var(--terra)", tone: "warm" as const },
  { id: "facial", n: "02", t: "Facial", bg: "var(--ink-900)", tone: "dark" as const },
  { id: "capilar", n: "03", t: "Unidad Capilar", bg: "var(--ink-900)", tone: "dark" as const },
  { id: "antiedad", n: "04", t: "Antienvejecimiento", bg: "var(--terra)", tone: "warm" as const },
  { id: "longevidad", n: "05", t: "Longevidad", bg: "var(--turq-deep)", tone: "cool" as const, href: "/longevidad" },
  { id: "complementarios", n: "06", t: "Complementarios", bg: "var(--ink-900)", tone: "dark" as const },
];

/**
 * /tratamientos — sin page-hero ni "universos".
 * Entra directo en las cards de categorías (cinematográficas) y luego el
 * menú UX con tabs + cards. (El concepto "Universos" fue retirado.)
 */
export default function TratamientosPage() {
  return (
    <>
      <SiteNav variant="solid" />
      <RevealsBootstrap />

      <main id="contenido">
        {/* CATEGORÍAS — entrada de la página, padding-top compensa nav */}
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
              {CATEGORIES.map((c, i) => {
                const href = c.href ?? `#${c.id}`;
                return (
                  <Link
                    key={c.id}
                    className="tcard"
                    href={href}
                    style={{ background: c.bg }}
                    data-rev="img"
                    data-delay={i ? String(i * 80) : undefined}
                  >
                    <ImageSlot slot={`cat-${c.id === "antiedad" ? "antiedad" : c.id}`} alt={c.t} tone={c.tone} />
                    <div
                      className="veil"
                      style={
                        c.tone === "cool"
                          ? { background: "linear-gradient(180deg,rgba(20,55,58,.22),rgba(20,55,58,.92))" }
                          : undefined
                      }
                    />
                    <div className="tc-in">
                      <h3>{c.t}</h3>
                    </div>
                    <span className="tc-num">{c.n}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* MENÚ COMPLETO — cards UX con tabs por categoría */}
        <section className="sec cream2" aria-label="Menú completo">
          <div className="wrap">
            <div className="sec-head" style={{ marginBottom: "clamp(20px,2.4vw,32px)" }}>
              <p className="eyebrow" data-rev="up">El menú completo</p>
              <h2 data-rev="wipe" data-delay="100" style={{ fontSize: "clamp(28px,3.4vw,48px)" }}>
                Cada tratamiento, una forma de <em>revelarte</em>.
              </h2>
            </div>
            <TratamientosUX />
          </div>
        </section>

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
