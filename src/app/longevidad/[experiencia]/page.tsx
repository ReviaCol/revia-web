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
import { getCategoryById } from "@/lib/catalog";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo";

const LONGEVIDAD_ID = "longevidad-bienestar";

async function getExperience(id: string) {
  const cat = await getCategoryById(LONGEVIDAD_ID);
  return cat?.treatments.find((t) => t.id === id);
}

// dynamicParams=true: experiencias nuevas creadas en /admin renderizan on-demand.
export const dynamicParams = true;

export async function generateStaticParams() {
  const cat = await getCategoryById(LONGEVIDAD_ID);
  return (cat?.treatments ?? []).map((t) => ({ experiencia: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ experiencia: string }>;
}): Promise<Metadata> {
  const { experiencia } = await params;
  const exp = await getExperience(experiencia);
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
  const exp = await getExperience(experiencia);
  if (!exp) notFound();

  // Fase 4 (ADR 0018): contenido rico editable con fallback al template.
  const candidateParas = exp.candidate ?? [
    `${exp.name} es para quien quiere recuperar energía, claridad y equilibrio sin procedimientos invasivos.`,
    "En tu evaluación de longevidad definimos si es la experiencia indicada para ti o si otra se ajusta mejor a tu momento. Con honestidad, siempre.",
  ];
  const sessionSteps = exp.protocol ?? SESSION_STEPS;
  const technology = exp.technology;
  const techParagraphs = technology
    ? [technology.lead, ...(technology.items.length > 0 ? [technology.items.join("  ·  ")] : [])]
    : [];

  // FAQ por experiencia (scope = experiencia); fallback a la FAQ de scope longevidad.
  const perExpFaq = await getFaqs(experiencia);
  const hasRealFaq = perExpFaq.length > 0;
  const faqItems = hasRealFaq ? perExpFaq : await getFaqs("longevidad");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Longevidad", path: "/longevidad" },
          { name: exp.name, path: `/longevidad/${experiencia}` },
        ])}
      />
      {hasRealFaq && <JsonLd data={faqPageJsonLd(faqItems)} />}
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

        <ProseSection
          eyebrow="Para quién"
          heading="¿Es para ti?"
          paragraphs={candidateParas}
          tone="cool"
        />

        {technology && (
          <ProseSection
            eyebrow="La tecnología"
            heading="Con qué la vivimos."
            paragraphs={techParagraphs}
            tone="cool"
          />
        )}

        <PillarGrid
          eyebrow="Cómo es la sesión"
          heading="Paso a paso, sin prisa."
          pillars={sessionSteps}
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
