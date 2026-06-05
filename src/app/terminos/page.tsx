import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { Footer } from "@/components/layout/Footer";
import { LegalDoc } from "@/components/page/LegalDoc";

export const metadata: Metadata = {
  title: "Términos y condiciones — Reviá",
  alternates: { canonical: "/terminos" },
  description:
    "Términos y condiciones de uso del sitio web de Reviá - Belleza y Vitalidad.",
};

export default function TerminosPage() {
  return (
    <>
      <SiteNav />
      <main id="contenido">
        <LegalDoc
          eyebrow="Legal"
          title="Términos y condiciones."
          updated="2026-05-20"
          intro="Al navegar y utilizar el sitio web de Reviá - Belleza y Vitalidad aceptas los siguientes términos y condiciones de uso."
          blocks={[
            {
              heading: "Uso del sitio",
              paragraphs: [
                "Este sitio tiene fines informativos y de contacto. El contenido se ofrece de buena fe para ayudarte a conocer nuestros servicios y filosofía.",
                "Te comprometes a usar el sitio de forma lícita y a no realizar acciones que afecten su funcionamiento o seguridad.",
              ],
            },
            {
              heading: "Propiedad intelectual",
              paragraphs: [
                "La marca Reviá, su identidad visual, textos, imágenes y demás contenidos del sitio son propiedad de Reviá - Belleza y Vitalidad o se usan con autorización. No está permitida su reproducción sin consentimiento previo.",
              ],
            },
            {
              heading: "Servicios y disponibilidad",
              paragraphs: [
                "La información sobre tratamientos es de carácter general. La indicación, el alcance y los resultados de cualquier tratamiento se determinan únicamente en una valoración médica individual.",
                "Nos reservamos el derecho de modificar o actualizar la información de servicios sin previo aviso.",
              ],
            },
            {
              heading: "Limitación de responsabilidad",
              paragraphs: [
                "Reviá no se hace responsable por decisiones tomadas únicamente con base en la información del sitio sin una consulta profesional previa. Consulta siempre con nuestro equipo médico.",
              ],
            },
            {
              heading: "Contacto",
              paragraphs: [
                "Para preguntas sobre estos términos, escríbenos a dra.gonzalez@revia.com.co o al +57 318 827 9094.",
              ],
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
