import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/page/PageHero";
import { PillarGrid } from "@/components/page/PillarGrid";
import { FAQ } from "@/components/page/FAQ";
import { ClosingCTA } from "@/components/page/ClosingCTA";
import { TreatmentList } from "@/app/tratamientos/[categoria]/_components/TreatmentList";
import { getCategoryBySlug } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Implante capilar — Reviá",
  alternates: { canonical: "/implante-capilar" },
  description:
    "Tu cabello, una obra médica de arte. Implante capilar no invasivo con técnica DHI y zafiro en Bogotá. Sin dolor, sin cicatrices visibles, resultados naturales.",
};

const PILLARS = [
  {
    title: "Sin dolor, sin marcas visibles",
    body: "Anestesia local y técnica de mínima intervención. El proceso es cómodo y no deja cicatrices a la vista.",
  },
  {
    title: "Técnica DHI y zafiro",
    body: "Implantación directa folículo a folículo, con apertura de zafiro para mayor densidad, ángulo y naturalidad.",
  },
  {
    title: "Resultados que se ven tuyos",
    body: "Diseñamos tu línea capilar respetando tu rostro y tu edad. El cabello implantado crece como propio.",
  },
  {
    title: "A tu ritmo, en dos días",
    body: "Sesiones distribuidas para tu comodidad. El proceso nunca se siente forzado ni interminable.",
  },
  {
    title: "La verdad sobre tu crecimiento",
    body: "Te explicamos con honestidad qué esperar mes a mes. Sin promesas mágicas, con acompañamiento real.",
  },
];

const STEPS = [
  {
    title: "Valoración y diseño",
    body: "Estudiamos tu densidad, tu patrón y tu objetivo. Diseñamos la línea capilar contigo, no por ti.",
  },
  {
    title: "Extracción folicular",
    body: "Unidad por unidad, preservando la integridad de cada folículo. Con técnica sin rasurado disponible.",
  },
  {
    title: "Implantación de precisión",
    body: "Control de ángulo, profundidad y dirección con DHI y zafiro para un resultado indistinguible de lo natural.",
  },
  {
    title: "Recuperación acompañada",
    body: "Protocolo de cámara hiperbárica (oxigenación al 100%) y seguimiento del crecimiento paso a paso.",
  },
];

const FAQ_ITEMS = [
  {
    q: "¿Es un proceso doloroso?",
    a: "Aplicamos anestesia local para que la experiencia sea cómoda. La mayoría de las personas describe molestias mínimas durante y después del tratamiento.",
  },
  {
    q: "¿Cuándo veré resultados?",
    a: "El cabello implantado suele caer en las primeras semanas (es esperado) y comienza a crecer de forma estable a partir del tercer o cuarto mes. El resultado pleno se aprecia entre los 9 y 12 meses.",
  },
  {
    q: "¿Necesito rasurarme la cabeza?",
    a: "No necesariamente. Ofrecemos técnica sin rasurado (non-shaven) cuando tu caso lo permite, para que puedas retomar tu vida con discreción.",
  },
  {
    q: "¿El cabello implantado se vuelve a caer?",
    a: "Los folículos implantados se toman de zonas resistentes a la caída, por lo que tienden a permanecer. Te explicamos con honestidad cómo cuidar el resto de tu cabello.",
  },
  {
    q: "¿Cuánto tiempo toma el tratamiento?",
    a: "Distribuimos el proceso en dos días para tu comodidad, según la cantidad de folículos a implantar. Lo definimos contigo en la valoración.",
  },
];

export default async function ImplanteCapilarPage() {
  const capilar = await getCategoryBySlug("capilar");
  return (
    <>
      <SiteNav current="/tratamientos" />
      <main id="contenido">
        <PageHero
          eyebrow="Unidad Capilar"
          title="Tu cabello, una obra médica de arte."
          accent="obra médica de arte"
          subtitle="Un tratamiento capilar no invasivo, diseñado con la precisión de la medicina y la sensibilidad del arte. Sin dolor, sin marcas visibles, con resultados que se sienten tuyos."
          tone="warm"
        />
        <PillarGrid
          eyebrow="Por qué nuestra técnica"
          heading="Cinco razones para confiar tu cabello."
          pillars={PILLARS}
        />
        <PillarGrid
          eyebrow="El protocolo"
          heading="Cómo es el proceso, paso a paso."
          pillars={STEPS}
          background="var(--revia-cream-100)"
        />
        <section
          aria-label="Tratamientos capilares"
          className="relative z-[2]"
          style={{ padding: "var(--section-y-tight) var(--gutter) 0" }}
        >
          <header className="max-w-[720px]">
            <p
              className="font-body inline-flex items-center m-0 mb-6 uppercase"
              style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px", color: "var(--revia-coffee-700)" }}
            >
              <span
                aria-hidden="true"
                className="block"
                style={{ width: "28px", height: "1px", background: "var(--revia-accent)" }}
              />
              El menú capilar
            </p>
            <h2
              className="font-display font-medium m-0"
              style={{ fontSize: "clamp(30px, 4vw, 48px)", lineHeight: 1.1, letterSpacing: "-0.012em", color: "var(--revia-coffee-900)" }}
            >
              Del diagnóstico a la restauración.
            </h2>
            <p
              className="font-body m-0 mt-6"
              style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--revia-coffee-700)", maxWidth: "560px" }}
            >
              Un camino no invasivo que empieza por entender tu caso y activa, paso
              a paso, la biología de tu cabello — de la bioestimulación a la
              restauración folicular.
            </p>
          </header>
        </section>
        {capilar ? (
          <TreatmentList treatments={capilar.treatments} categorySlug="capilar" />
        ) : null}
        <FAQ
          heading="La verdad sobre tu implante."
          items={FAQ_ITEMS}
        />
        <ClosingCTA
          title="Reserva tu evaluación capilar."
          body="El primer paso es una valoración honesta. Cuéntanos qué buscas recuperar."
          ctaLabel="Reservar evaluación capilar"
          href="/contacto?service=implante-capilar"
          tone="warm"
        />
      </main>
      <Footer />
    </>
  );
}
