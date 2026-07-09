import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/layout/SiteNav";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/page/PageHero";
import { ProseSection } from "@/components/page/ProseSection";
import { PillarGrid } from "@/components/page/PillarGrid";
import { FAQ } from "@/components/page/FAQ";
import { getFaqs } from "@/lib/faqs";
import { ClosingCTA } from "@/components/page/ClosingCTA";
import { getCategoryById } from "@/lib/treatments";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

const LONGEVIDAD_ID = "longevidad-bienestar";

function getExperience(id: string) {
  return getCategoryById(LONGEVIDAD_ID)?.treatments.find((t) => t.id === id);
}

export function generateStaticParams() {
  return (getCategoryById(LONGEVIDAD_ID)?.treatments ?? []).map((t) => ({
    experiencia: t.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ experiencia: string }>;
}): Promise<Metadata> {
  const { experiencia } = await params;
  const exp = getExperience(experiencia);
  if (!exp) return { title: "Longevidad — Reviá" };
  return {
    title: `${exp.name} — Reviá`,
    description: `${exp.name}: ${exp.summary} Unidad de bienestar y longevidad en Bogotá.`,
    alternates: { canonical: `/longevidad/${experiencia}` },
  };
}

const SESSION_STEPS = [
  { title: "Recepción y preparación", body: "Llegas, respiras y te preparas. El santuario está diseñado para bajar revoluciones desde el primer minuto." },
  { title: "La experiencia", body: "Vives la sesión guiada, con tiempos y parámetros ajustados a ti. Cero prisa, máxima presencia." },
  { title: "Integración", body: "Cerramos con un momento de transición para que el efecto se asiente y te lleves la calma contigo." },
];

export default async function ExperienciaPage({
  params,
}: {
  params: Promise<{ experiencia: string }>;
}) {
  const { experiencia } = await params;
  const exp = getExperience(experiencia);
  if (!exp) notFound();
  const faqItems = await getFaqs("longevidad");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Longevidad", path: "/longevidad" },
          { name: exp.name, path: `/longevidad/${experiencia}` },
        ])}
      />
      <SiteNav current="/longevidad" />
      <main id="contenido" style={{ background: "var(--revia-sky-50)" }}>
        <PageHero
          eyebrow="Santuario sensorial"
          title={exp.name}
          subtitle={exp.summary}
          tone="cool"
        />

        <ProseSection
          eyebrow="Qué es y por qué funciona"
          heading="La ciencia, en lenguaje humano."
          paragraphs={[
            exp.summary,
            "No es un lujo decorativo: es una herramienta con respaldo en la fisiología del descanso, la recuperación y el rendimiento. Activamos respuestas que tu cuerpo ya sabe dar.",
          ]}
          tone="cool"
        />

        <PillarGrid
          eyebrow="Cómo es la sesión"
          heading="Paso a paso, sin prisa."
          pillars={SESSION_STEPS}
          tone="cool"
        />

        <FAQ heading="Preguntas frecuentes." items={faqItems} tone="cool" />

        <ClosingCTA
          title={`Agenda tu sesión de ${exp.name}.`}
          body="Reserva tu espacio en el santuario y empieza a recuperar tu mejor versión."
          ctaLabel="Agendar sesión"
          href="/contacto?service=longevidad-bienestar"
          tone="cool"
        />
      </main>
      <Footer />
    </>
  );
}
