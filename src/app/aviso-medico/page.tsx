import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { Footer } from "@/components/layout/Footer";
import { LegalDoc } from "@/components/page/LegalDoc";

export const metadata: Metadata = {
  title: "Aviso médico — Reviá",
  alternates: { canonical: "/aviso-medico" },
  description:
    "La información del sitio de Reviá es educativa y no reemplaza una consulta médica profesional.",
};

export default function AvisoMedicoPage() {
  return (
    <>
      <SiteNav />
      <main id="contenido">
        <LegalDoc
          eyebrow="Legal"
          title="Aviso médico."
          updated="2026-05-20"
          intro="La información publicada en este sitio tiene un propósito educativo e informativo. No constituye un diagnóstico ni una recomendación médica personalizada."
          blocks={[
            {
              heading: "No reemplaza una consulta",
              paragraphs: [
                "Ningún contenido de este sitio reemplaza la valoración de un profesional de la salud. Cada cuerpo es distinto: la indicación de cualquier tratamiento se define únicamente en una consulta médica individual.",
              ],
            },
            {
              heading: "Resultados individuales",
              paragraphs: [
                "Los resultados de los tratamientos varían según cada persona, su biología y su adherencia a las indicaciones. No garantizamos resultados idénticos para todos los casos y evitamos cualquier promesa de transformación radical.",
              ],
            },
            {
              heading: "Naturaleza de nuestros tratamientos",
              paragraphs: [
                "Todos los tratamientos de Reviá son no invasivos. Trabajamos activando los procesos que tu propio cuerpo ya conoce, con tecnología de precisión y rigor médico.",
              ],
            },
            {
              heading: "Ante una urgencia",
              paragraphs: [
                "Si experimentas una urgencia de salud, acude al servicio de emergencias más cercano o comunícate con la línea de atención correspondiente. Este sitio no está diseñado para atender emergencias.",
              ],
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
