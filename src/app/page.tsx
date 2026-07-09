import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ImageSlot } from "@/components/site/ImageSlot";
import { RevealsBootstrap } from "@/components/site/RevealsBootstrap";
import { getSiteContact } from "@/lib/site-content";
import { getHomeContent } from "@/lib/home-content";
import { renderEmphasis } from "@/lib/rich-text";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Home — port 1:1 del Reviá Home.html (Claude Design 2026-06-04).
 * Hero cinematográfico full-bleed + Manifiesto + Filosofía split +
 * Tratamientos grid asimétrico + Longevidad turquesa profunda + Contacto.
 */
export default async function HomePage() {
  const contact = await getSiteContact();
  const home = await getHomeContent();
  return (
    <>
      <SiteNav variant="home" />
      <RevealsBootstrap homeMode />

      <main id="top">
        {/* HERO */}
        <section className="hero" data-screen-label="01 Hero">
          <ImageSlot
            slot="hero-main"
            alt="Foto héroe — figura contemplativa"
            tone="dark"
            priority
          />
          <div className="scrim" />
          <div className="scrim-side" />
          <div className="hero-inner">
            <h1 data-rev="up">
              {home.heroLine1}
              <br />
              {renderEmphasis(home.heroLine2)}
            </h1>
            <p className="sub" data-rev="up" data-delay="180">
              {home.heroSubtitle}
            </p>
          </div>
          <div className="scroll-cue">
            <span className="ln" /> Desliza
          </div>
          <div className="meta">
            MMXXVI
            <br />
            Bogotá · Colombia
          </div>
        </section>

        {/* MANIFIESTO */}
        <section className="sec manifesto" aria-label="Manifiesto">
          <div className="wrap">
            <p className="eyebrow" data-rev="up">
              {home.manifestoEyebrow}
            </p>
            <p
              className="big"
              data-rev="wipe"
              data-delay="120"
              style={{ marginTop: "36px" }}
            >
              {home.manifestoLine1}{" "}
              <span className="l2">
                {renderEmphasis(home.manifestoLine2)}
              </span>
            </p>
          </div>
        </section>

        {/* FILOSOFÍA — split editorial */}
        <section
          className="sec cream2"
          id="filosofia"
          data-screen-label="02 Filosofía"
        >
          <div className="wrap philo">
            <div className="visual" data-rev="img">
              <ImageSlot
                slot="filosofia-img"
                alt="Laboratorio — detalle clínico cálido"
                tone="warm"
              />
            </div>
            <div>
              <p className="eyebrow" data-rev="up">
                Filosofía
              </p>
              <h2
                className="sec-head"
                data-rev="wipe"
                data-delay="100"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: "clamp(34px,4.6vw,68px)",
                  lineHeight: 1.04,
                  letterSpacing: "-.02em",
                  margin: ".4em 0 0",
                }}
              >
                Veinte años de rigor médico nutren cada gesto{" "}
                <em>regenerativo</em>.
              </h2>
              <p className="body" data-rev="up" data-delay="220">
                Células madre, exosomas, bioestimuladores y plasma rico en
                plaquetas. Ningún procedimiento invasivo: solo tecnología que
                potencia tu propia biología.
              </p>
              <div
                data-rev="up"
                data-delay="320"
                style={{ marginTop: "40px" }}
              >
                <Link className="tlink" href="/nosotros#filosofia">
                  <span className="lbl">Conocer la filosofía</span>
                  <span className="arw">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TRATAMIENTOS — grid asimétrico cinematográfico */}
        <section
          className="sec"
          id="tratamientos"
          data-screen-label="03 Tratamientos"
        >
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow" data-rev="up">
                Tratamientos
              </p>
              <h2 data-rev="wipe" data-delay="100">
                Activamos lo que ya eres.
              </h2>
            </div>
            <div className="trat-grid">
              <Link
                className="tcard c1"
                href="/tratamientos"
                style={{ background: "var(--terra)" }}
                data-rev="img"
              >
                <ImageSlot slot="trat-corporal" alt="Corporal" tone="warm" />
                <div className="veil" />
                <div className="tc-in">
                  <h3>Corporal</h3>
                  <p className="tc-sum">
                    Anti-celulitis, moldeado y radiofrecuencia.
                  </p>
                  <span className="tc-more">
                    Conocer <span className="arw">→</span>
                  </span>
                </div>
                <span className="tc-num">01</span>
              </Link>
              <Link
                className="tcard c2"
                href="/tratamientos"
                style={{ background: "var(--ink-900)" }}
                data-rev="img"
                data-delay="120"
              >
                <ImageSlot slot="trat-facial" alt="Facial" tone="dark" />
                <div className="veil" />
                <div className="tc-in">
                  <h3>Facial</h3>
                  <p className="tc-sum">
                    PRP, ácido hialurónico y rejuvenecimiento 360.
                  </p>
                  <span className="tc-more">
                    Conocer <span className="arw">→</span>
                  </span>
                </div>
                <span className="tc-num">02</span>
              </Link>
              <Link
                className="tcard c3"
                href="/tratamientos#capilar"
                style={{ background: "var(--ink-900)" }}
                data-rev="img"
                data-delay="200"
              >
                <ImageSlot
                  slot="trat-implante"
                  alt="Unidad Capilar"
                  tone="dark"
                />
                <div className="veil" />
                <div className="tc-in">
                  <h3>Unidad Capilar</h3>
                  <p className="tc-sum">
                    DHI y zafiro. Sin cicatrices visibles.
                  </p>
                  <span className="tc-more">
                    Conocer <span className="arw">→</span>
                  </span>
                </div>
                <span className="tc-num">03</span>
              </Link>
              <Link
                className="tcard c4"
                href="/tratamientos#antiedad"
                style={{ background: "var(--terra)" }}
                data-rev="img"
                data-delay="280"
              >
                <ImageSlot
                  slot="trat-anti"
                  alt="Antienvejecimiento"
                  tone="warm"
                />
                <div className="veil" />
                <div className="tc-in">
                  <h3>Antienvejecimiento</h3>
                  <p className="tc-sum">NAD, células madre y exosomas.</p>
                  <span className="tc-more">
                    Conocer <span className="arw">→</span>
                  </span>
                </div>
                <span className="tc-num">04</span>
              </Link>
            </div>
            <div className="trat-foot" data-rev="up">
              <Link className="tlink" href="/tratamientos">
                <span className="lbl">Ver los 27 tratamientos</span>
                <span className="arw">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* LONGEVIDAD — universo cool inmersivo */}
        <section
          className="sec teal"
          id="longevidad"
          data-screen-label="04 Longevidad"
        >
          <div className="wrap long">
            <div className="copy">
              <p className="eyebrow cool" data-rev="up">
                Unidad de Bienestar
              </p>
              <h2
                className="sec-head"
                data-rev="wipe"
                data-delay="100"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: "clamp(34px,5vw,76px)",
                  lineHeight: 1.03,
                  letterSpacing: "-.02em",
                  margin: ".4em 0 0",
                  color: "var(--cream-50)",
                }}
              >
                Redefiniendo tu <em>edad biológica</em>.
              </h2>
              <p className="body" data-rev="up" data-delay="220">
                Un universo aparte: biohacking, performance humana y longevidad.
                Tu salud, tu mayor ventaja.
              </p>
              <div className="pillars" data-stagger="80">
                <div className="p">
                  <div className="n">01</div>
                  <div className="t">Nutrición</div>
                </div>
                <div className="p">
                  <div className="n">02</div>
                  <div className="t">Actividad</div>
                </div>
                <div className="p">
                  <div className="n">03</div>
                  <div className="t">Sueño</div>
                </div>
                <div className="p">
                  <div className="n">04</div>
                  <div className="t">Estrés</div>
                </div>
                <div className="p">
                  <div className="n">05</div>
                  <div className="t">Carga tóxica</div>
                </div>
                <div className="p">
                  <div className="n">06</div>
                  <div className="t">Conexiones</div>
                </div>
              </div>
              <div
                data-rev="up"
                data-delay="200"
                style={{ marginTop: "44px" }}
              >
                <Link className="tlink cool" href="/longevidad">
                  <span className="lbl">Conocer la Unidad de Bienestar</span>
                  <span className="arw">→</span>
                </Link>
              </div>
            </div>
            <div className="visual" data-rev="img" data-delay="120">
              <ImageSlot
                slot="longevidad-img"
                alt="Cielo — agua infinita"
                tone="cool"
              />
              <span className="vmark">MMXXVI · Bogotá</span>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section
          className="sec"
          id="contacto"
          data-screen-label="05 Contacto"
        >
          <div className="wrap contact">
            <div>
              <p className="eyebrow" data-rev="up">
                Contacto
              </p>
              <h2 className="sec-head" data-rev="wipe" data-delay="100">
                El primer paso es una <em>conversación</em>.
              </h2>
              <p className="lead" data-rev="up" data-delay="220">
                Cuéntanos qué buscas revelar.
              </p>
              <div className="copts" data-stagger="90">
                <Link className="copt primary" href="/contacto#agendar">
                  <span>
                    <span className="t">Agendar consulta</span>
                    <span className="s">Reserva en línea · 30 min</span>
                  </span>
                  <span className="arw">→</span>
                </Link>
                <a
                  className="copt"
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <span className="t">WhatsApp</span>
                    <span className="s">{contact.whatsappDisplay}</span>
                  </span>
                  <span className="arw">→</span>
                </a>
                <a className="copt" href={contact.telHref}>
                  <span>
                    <span className="t">Llamar</span>
                    <span className="s">{contact.telDisplay}</span>
                  </span>
                  <span className="arw">→</span>
                </a>
              </div>
            </div>
            <div data-rev="up" data-delay="200">
              <p className="eyebrow">Visitar</p>
              <p className="addr">
                Cra 16 # 86B-52
                <br />
                Bogotá, Colombia
              </p>
              <div className="address-card" aria-label="Dirección de Reviá">
                <span className="address-mark" aria-hidden="true" />
                <div>
                  <div className="address-line1">Cra 16 # 86B-52</div>
                  <div className="address-line2">Chicó · Bogotá, Colombia</div>
                  <a
                    className="address-link"
                    href="https://maps.google.com/?q=Cra+16+%23+86B-52,+Bogot%C3%A1,+Colombia"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cómo llegar <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING — CTA grande final, refuerza la conversión a agendamiento */}
        <section className="closing warm" data-screen-label="06 Cierre">
          <p className="eyebrow on-dark cl-eyebrow" data-rev="up">
            Tu primer paso
          </p>
          <h2 data-rev="wipe" data-delay="100">
            Empieza con una <em>valoración</em>.
          </h2>
          <p className="cl-body" data-rev="up" data-delay="220">
            Agenda en línea, sin compromiso. En 30 minutos diseñamos contigo
            el camino más honesto para revelar lo que ya eres.
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
