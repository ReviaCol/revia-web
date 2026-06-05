import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/page/PageHero";
import { PillarGrid } from "@/components/page/PillarGrid";
import { ClosingCTA } from "@/components/page/ClosingCTA";

export const metadata: Metadata = {
  title: "Antienvejecimiento — Reviá",
  alternates: { canonical: "/antienvejecimiento" },
  description:
    "Un programa holístico para revertir el desgaste celular: desintoxicación, vitamina C, terapia NAD, células madre y exosomas. Medicina regenerativa no invasiva en Bogotá.",
};

const PHASES = [
  { title: "Desintoxicación", body: "Preparamos el terreno. Reducimos la carga tóxica para que el organismo responda mejor a cada terapia." },
  { title: "Aporte nutricional", body: "Reponemos lo que el desgaste agota: micronutrientes y soporte metabólico de base." },
  { title: "Vitamina C", body: "Antioxidante de alta concentración para protección y reparación de los tejidos." },
  { title: "Terapia NAD", body: "Reactivamos la energía celular y los mecanismos de reparación del ADN." },
  { title: "Células madre + exosomas", body: "Señales regenerativas que potencian procesos que tu cuerpo ya conoce." },
];

const COMPONENTS = [
  { title: "Vitamina C de alta concentración", body: "Antioxidante potente que protege la célula del estrés oxidativo y apoya la síntesis de colágeno." },
  { title: "NAD", body: "Nicotinamida Adenina Dinucleótido: combustible de la energía celular y la reparación del material genético." },
  { title: "Células madre", body: "Potencial regenerativo dirigido a la reparación de tejidos, procesado en laboratorios propios." },
  { title: "Exosomas", body: "Vesículas que transmiten señales de rejuvenecimiento entre células. Comunicación, no sustitución." },
];

const RESULTS = [
  { title: "Lo que cambia", body: "Más energía, mejor calidad de piel y una sensación de vitalidad sostenida. No una transformación radical: una recuperación auténtica." },
  { title: "En cuánto tiempo", body: "El programa es progresivo. Los primeros cambios se sienten en semanas; el efecto regenerativo se consolida en meses." },
  { title: "Mantenimiento", body: "La longevidad es un hábito, no un evento. Diseñamos contigo un plan de mantenimiento realista." },
];

export default function AntienvejecimientoPage() {
  return (
    <>
      <SiteNav current="/tratamientos" />
      <main id="contenido" style={{ background: "var(--revia-sky-50)" }}>
        <PageHero
          eyebrow="Programa antienvejecimiento"
          title="Revertir el desgaste, célula a célula."
          accent="célula a célula"
          subtitle="Un programa regenerativo integral que activa los mecanismos que tu biología ya posee. Holístico, progresivo y enteramente no invasivo."
          tone="cool"
        />
        <PillarGrid
          eyebrow="Las fases del programa"
          heading="Un camino, en cinco movimientos."
          pillars={PHASES}
          tone="cool"
        />
        <PillarGrid
          eyebrow="Cada componente"
          heading="La ciencia detrás del programa."
          pillars={COMPONENTS}
          tone="cool"
        />
        <PillarGrid
          eyebrow="Resultados esperados"
          heading="Honestos sobre lo que puedes esperar."
          pillars={RESULTS}
          tone="cool"
        />
        <ClosingCTA
          title="Inicia tu programa antienvejecimiento."
          body="Empieza con una evaluación que mira tu biología completa, no solo tu reflejo."
          ctaLabel="Iniciar mi programa"
          href="/contacto?service=antienvejecimiento"
          tone="cool"
        />
      </main>
      <Footer />
    </>
  );
}
