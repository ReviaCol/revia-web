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
import { SITE_URL, medicalProcedureJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import {
  CATEGORY_SLUG_TO_ID,
  getCategoryBySlug,
  getTreatmentBySlug,
} from "@/lib/treatments";

function humanizeZone(zone: string): string {
  return zone.replace(/-/g, " ");
}

export function generateStaticParams() {
  const params: { categoria: string; slug: string }[] = [];
  for (const categoria of Object.keys(CATEGORY_SLUG_TO_ID)) {
    const category = getCategoryBySlug(categoria);
    category?.treatments.forEach((t) => params.push({ categoria, slug: t.id }));
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string; slug: string }>;
}): Promise<Metadata> {
  const { categoria, slug } = await params;
  const found = getTreatmentBySlug(categoria, slug);
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
  const found = getTreatmentBySlug(categoria, slug);
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
          paragraphs={[
            "Este tratamiento es ideal para quienes buscan un resultado natural y sostenido, sin procedimientos invasivos.",
            "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado.",
          ]}
          tone="warm"
          background="var(--revia-cream-100)"
        />

        <PillarGrid
          eyebrow="El protocolo"
          heading="Cómo lo acompañamos."
          pillars={PROTOCOL}
        />

        <FAQ heading="Preguntas frecuentes." items={FAQ_ITEMS} />

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
