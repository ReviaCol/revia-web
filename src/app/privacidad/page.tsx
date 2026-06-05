import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { Footer } from "@/components/layout/Footer";
import { LegalDoc } from "@/components/page/LegalDoc";

export const metadata: Metadata = {
  title: "Política de privacidad — Reviá",
  alternates: { canonical: "/privacidad" },
  description:
    "Política de tratamiento de datos personales de Reviá - Belleza y Vitalidad, conforme a la Ley 1581 de 2012 (Colombia).",
};

export default function PrivacidadPage() {
  return (
    <>
      <SiteNav />
      <main id="contenido">
        <LegalDoc
          eyebrow="Legal"
          title="Política de privacidad."
          updated="2026-05-20"
          intro="En Reviá - Belleza y Vitalidad protegemos tus datos personales conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia. Esta política describe cómo recolectamos, usamos y protegemos tu información."
          blocks={[
            {
              heading: "Responsable del tratamiento",
              paragraphs: [
                "Reviá - Belleza y Vitalidad, con domicilio en Cra 16 # 86B-52, Bogotá, Colombia, es responsable del tratamiento de los datos personales que nos compartes.",
                "Para cualquier solicitud relacionada con tus datos, puedes escribirnos a dra.gonzalez@revia.com.co o al +57 318 827 9094.",
              ],
            },
            {
              heading: "Qué datos recolectamos",
              paragraphs: [
                "Recolectamos los datos que nos proporcionas voluntariamente a través de nuestro formulario de contacto: nombre, correo electrónico, número de WhatsApp, servicio de interés y el mensaje que decidas enviarnos.",
                "No recolectamos datos sensibles a través del sitio web. Cualquier información clínica se maneja exclusivamente dentro de la consulta médica, bajo confidencialidad profesional.",
              ],
            },
            {
              heading: "Para qué usamos tus datos",
              paragraphs: [
                "Usamos tus datos únicamente para responder a tu solicitud, agendar tu consulta y mantener contigo una comunicación relacionada con los servicios que solicitaste.",
                "No vendemos ni compartimos tus datos con terceros para fines publicitarios.",
              ],
            },
            {
              heading: "Tus derechos (Habeas Data)",
              paragraphs: [
                "Como titular de los datos tienes derecho a conocer, actualizar, rectificar y suprimir tu información, así como a revocar la autorización otorgada para su tratamiento.",
                "Para ejercer estos derechos, escríbenos a dra.gonzalez@revia.com.co indicando tu solicitud. Atenderemos tu petición en los plazos previstos por la ley.",
              ],
            },
            {
              heading: "Vigencia",
              paragraphs: [
                "Esta política rige a partir de su publicación y puede actualizarse. Cualquier cambio sustancial se reflejará en esta misma página.",
              ],
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
