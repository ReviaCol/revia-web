import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { RevealsBootstrap } from "@/components/site/RevealsBootstrap";
import { BookingCta } from "./_components/BookingCta";
import { ContactFormDesign } from "./_components/ContactFormDesign";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contacto — Reviá",
  alternates: { canonical: "/contacto" },
  description:
    "Agenda tu valoración en línea con Reviá. Centro de medicina estética y regenerativa no invasiva en Bogotá.",
};

const SERVICES = [
  { id: "no-invasivos-corporal", name: "Rejuvenecimiento Corporal" },
  { id: "no-invasivos-facial", name: "Rejuvenecimiento Facial" },
  { id: "implante-capilar", name: "Unidad Capilar" },
  { id: "antienvejecimiento", name: "Antienvejecimiento" },
  { id: "longevidad-bienestar", name: "Longevidad & Bienestar" },
  { id: "complementarios", name: "Programas Complementarios" },
];

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      <SiteNav variant="solid" />
      <RevealsBootstrap />

      <main id="contenido" className="contacto-page">
        <div
          className="contacto-shell wrap"
          style={{
            paddingTop: "calc(var(--nav-h) + clamp(32px,4vw,56px))",
            paddingBottom: "clamp(48px,6vw,96px)",
            paddingLeft: "var(--gutter)",
            paddingRight: "var(--gutter)",
          }}
        >
          {/* ENCABEZADO compacto */}
          <header className="contacto-head" data-rev="up">
            <p className="eyebrow">Contacto</p>
            <h1>
              El primer paso es una <em>conversación</em>.
            </h1>
            <p className="contacto-sub">
              Agenda tu valoración en línea o escríbenos. Te respondemos en
              menos de 24h.
            </p>
          </header>

          {/* GRID 2 columnas: Agendar | Escribirnos */}
          <div className="contacto-grid">
            {/* Lado IZQUIERDO — Agendar + canales + visita */}
            <div className="contacto-left">
              <section
                className="contacto-card contacto-card--feature"
                id="agendar"
                aria-label="Agendar valoración"
                data-rev="up"
              >
                <p className="eyebrow">Agendar en línea</p>
                <h2>
                  Reserva tu valoración en <em>30 min</em>.
                </h2>
                <p>
                  Disponibilidad en tiempo real del calendario de la Dra.
                  Bibiana González (estética) y del equipo capilar. Pago en
                  línea seguro; recibes recordatorios automáticos.
                </p>
                <BookingCta />
              </section>

              <section
                className="contacto-card"
                aria-label="Vías directas"
                data-rev="up"
                data-delay="120"
              >
                <p className="eyebrow">Vías directas</p>
                <div className="contacto-channels">
                  <a
                    className="contacto-channel"
                    href={CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="cc-label">WhatsApp</span>
                    <span className="cc-value">{CONTACT.whatsappDisplay}</span>
                    <span aria-hidden="true" className="cc-arrow">→</span>
                  </a>
                  <a className="contacto-channel" href={CONTACT.telHref}>
                    <span className="cc-label">Llamar</span>
                    <span className="cc-value">{CONTACT.telDisplay}</span>
                    <span aria-hidden="true" className="cc-arrow">→</span>
                  </a>
                  <a
                    className="contacto-channel"
                    href={`mailto:${CONTACT.email}`}
                  >
                    <span className="cc-label">Email</span>
                    <span className="cc-value">{CONTACT.email}</span>
                    <span aria-hidden="true" className="cc-arrow">→</span>
                  </a>
                  <a
                    className="contacto-channel"
                    href={CONTACT.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="cc-label">Instagram</span>
                    <span className="cc-value">@reviatratamientossincirugia</span>
                    <span aria-hidden="true" className="cc-arrow">→</span>
                  </a>
                </div>
              </section>

              <section
                className="contacto-card contacto-card--address"
                aria-label="Dirección"
                data-rev="up"
                data-delay="200"
              >
                <p className="eyebrow">Visítanos</p>
                <div className="address-card" style={{ marginTop: 18 }}>
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
              </section>
            </div>

            {/* Lado DERECHO — Formulario */}
            <aside
              className="contacto-right contacto-card"
              id="mensaje"
              aria-label="Déjanos un mensaje"
              data-rev="up"
              data-delay="60"
            >
              <p className="eyebrow">¿Prefieres escribirnos?</p>
              <h2>Déjanos un mensaje.</h2>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "var(--ink-700)",
                  margin: "10px 0 22px",
                }}
              >
                Te respondemos en menos de 24h con el cuidado que mereces.
              </p>
              <ContactFormDesign
                services={SERVICES}
                initialService={params.service}
              />
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
