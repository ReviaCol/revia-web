import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/page/PageHero";
import { ClosingCTA } from "@/components/page/ClosingCTA";
import { TierCards } from "./_components/TierCards";

export const metadata: Metadata = {
  title: "Membresías VIP — Reviá",
  alternates: { canonical: "/longevidad/membresias" },
  description:
    "Tu salud, tu mayor ventaja competitiva. Membresías de longevidad y bienestar en Bogotá: Salud Funcional, Recuperación Ejecutiva y Biohacker Élite.",
};

export default function MembresiasPage() {
  return (
    <>
      <SiteNav current="/longevidad" />
      <main id="contenido" style={{ background: "var(--revia-sky-50)" }}>
        <PageHero
          eyebrow="Membresías VIP"
          title="Tu salud, tu mayor ventaja competitiva."
          accent="mayor ventaja competitiva"
          subtitle="Tres tiers aspiracionales para hacer de tu vitalidad un hábito sostenido. No son planes de gimnasio: son acompañamiento de longevidad."
          tone="cool"
        />

        <TierCards />

        <ClosingCTA
          title="Hablemos de tu membresía."
          body="Te ayudamos a elegir el tier que se ajusta a tu momento y tus objetivos."
          ctaLabel="Conversar sobre membresías"
          href="/contacto?service=longevidad-bienestar"
          tone="cool"
        />
      </main>
      <Footer />
    </>
  );
}
