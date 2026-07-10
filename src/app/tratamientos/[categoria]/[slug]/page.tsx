import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/layout/SiteNav";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/page/PageHero";
import { ProseSection } from "@/components/page/ProseSection";
import { PillarGrid } from "@/components/page/PillarGrid";
import { FAQ } from "@/components/page/FAQ";
import { ClosingCTA } from "@/components/page/ClosingCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFaqs } from "@/lib/faqs";
import { SITE_URL, medicalProcedureJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo";
import { getTreatmentBySlug, getTreatmentParams } from "@/lib/catalog";

function humanizeZone(zone: string): string {
  return zone.replace(/-/g, " ");
}

// Catálogo desde Supabase (con fallback al JSON). dynamicParams=true permite que
// tratamientos nuevos creados en /admin rendericen on-demand sin rebuild.
export const dynamicParams = true;

export async function generateStaticParams() {
  return getTreatmentParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string; slug: string }>;
}): Promise<Metadata> {
  const { categoria, slug } = await params;
  const found = await getTreatmentBySlug(categoria, slug);
  if (!found) return { title: "Tratamiento — Reviá" };
  return {
    title: `${found.treatment.name} — Reviá`,
    description: `${found.treatment.name}: ${found.treatment.summary} Tratamiento no invasivo en Bogotá.`,
    alternates: { canonical: `/tratamientos/${categoria}/${slug}` },
  };
}

const PROTOCOL = [
  { title: "Valoración personalizada", body: "Escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero." },
  { title: "El tratamiento", body: "Aplicamos la técnica con precisión y tiempos pensados para tu comodidad. Cero invasión, máximo cuidado." },
  { title: "Seguimiento", body: "Acompañamos tu evolución y ajustamos lo necesario. Los mejores resultados se cultivan, no se fuerzan." },
];

const FAQ_ITEMS = [
  { q: "¿Es un tratamiento no invasivo?", a: "Sí. Todos nuestros protocolos son no invasivos: trabajamos activando los procesos que tu propio cuerpo ya conoce." },
  { q: "¿Cuántas sesiones necesito?", a: "Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas." },
  { q: "¿Hay tiempo de recuperación?", a: "La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según el protocolo." },
];

export default async function TratamientoDetallePage({
  params,
}: {
  params: Promise<{ categoria: string; slug: string }>;
}) {
  const { categoria, slug } = await params;
  const found = await getTreatmentBySlug(categoria, slug);
  if (!found) notFound();

  const { category, treatment } = found;

  const quePeople: string[] = [
    treatment.summary,
    "Cada protocolo se diseña sobre tu biología, no contra ella: potenciamos mecanismos que tus células ya poseen para revelar un resultado natural.",
  ];
  if (treatment.outcome) {
    quePeople.push(`Resultado esperado: ${treatment.outcome}`);
  }
  if (treatment.bodyZones && treatment.bodyZones.length > 0) {
    quePeople.push(`Zonas de aplicación: ${treatment.bodyZones.map(humanizeZone).join(", ")}.`);
  }

  const procedureUrl = `${SITE_URL}/tratamientos/${categoria}/${slug}`;

  // Fase 4 (ADR 0018): contenido rico editable con fallback al template genérico.
  const candidateParas = treatment.candidate ?? [
    "Este tratamiento es ideal para quienes buscan un resultado natural y sostenido, sin procedimientos invasivos.",
    "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado.",
  ];
  const protocolPillars = treatment.protocol ?? PROTOCOL;
  const technology = treatment.technology;
  const techParagraphs = technology
    ? [technology.lead, ...(technology.items.length > 0 ? [technology.items.join("  ·  ")] : [])]
    : [];

  // FAQ por tratamiento (faqs scope = slug). Sin filas propias → FAQ genérica.
  // El FAQPage JSON-LD solo se emite con FAQ real (no sobre el template duplicado).
  const faqFromDb = await getFaqs(slug);
  const hasRealFaq = faqFromDb.length > 0;
  const faqItems = hasRealFaq ? faqFromDb : FAQ_ITEMS;

  return (
    <>
      <JsonLd data={medicalProcedureJsonLd(treatment, category, procedureUrl)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Tratamientos", path: "/tratamientos" },
          { name: category.name, path: `/tratamientos/${categoria}` },
          { name: treatment.name, path: `/tratamientos/${categoria}/${slug}` },
        ])}
      />
      {hasRealFaq && <JsonLd data={faqPageJsonLd(faqItems)} />}
      <SiteNav current="/tratamientos" />
      <main id="contenido">
        <PageHero
          eyebrow={category.name}
          title={treatment.name}
          subtitle={treatment.outcome ?? treatment.summary}
          tone="warm"
        />

        <ProseSection
          eyebrow="Qué es y cómo funciona"
          heading="La biología detrás del tratamiento."
          paragraphs={quePeople}
          tone="warm"
        />

        <ProseSection
          eyebrow="Para quién"
          heading="¿Es para ti?"
          paragraphs={candidateParas}
          tone="warm"
          background="var(--revia-cream-100)"
        />

        {technology && (
          <ProseSection
            eyebrow="La tecnología"
            heading="Con qué lo hacemos."
            paragraphs={techParagraphs}
            tone="warm"
          />
        )}

        <PillarGrid
          eyebrow="El protocolo"
          heading="Cómo lo acompañamos."
          pillars={protocolPillars}
        />

        <FAQ heading="Preguntas frecuentes." items={faqItems} />

        <ClosingCTA
          title={`Inicia tu consulta para ${treatment.name}.`}
          body="Cuéntanos qué buscas revelar y diseñamos tu protocolo personalizado."
          ctaLabel="Iniciar mi consulta"
          href={`/contacto?service=${category.id}`}
          tone="warm"
        />
      </main>
      <Footer />
    </>
  );
}
