import {
  CATEGORY_ID_TO_SLUG,
  CATEGORY_SLUG_TO_ID,
  getCategoryById,
  getCategoryBySlug,
  type Category,
  type Treatment,
} from "@/lib/treatments";

/**
 * seo.ts — constantes y constructores de JSON-LD (schema.org) para Reviá.
 *
 * REGLA DURA: ninguna descripción de schema, alt-text o tipo médico puede
 * mencionar cirugía/quirúrgico ni reclamar trayectoria histórica (La Font).
 * Por eso medicalSpecialty NO incluye "PlasticSurgery": usamos Dermatology +
 * knowsAbout con tratamientos no invasivos.
 */

export const SITE_URL = "https://revia.com.co";

export const BUSINESS = {
  name: "Reviá - Belleza y Vitalidad",
  legalName: "Reviá - Belleza y Vitalidad",
  description:
    "Centro de medicina estética, regenerativa y bienestar en Bogotá. Tratamientos no invasivos.",
  telephone: "+57 310 343 8833",
  email: "admin@revia.com.co",
  streetAddress: "Cra 16 # 86B-52",
  addressLocality: "Bogotá",
  addressRegion: "Bogotá D.C.",
  addressCountry: "CO",
  instagram: "https://instagram.com/reviatratamientossincirugia",
} as const;

type Json = Record<string, unknown>;

/** MedicalClinic site-wide. Se renderiza en el layout (todas las páginas). */
export function medicalClinicJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${SITE_URL}/#clinic`,
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: SITE_URL,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    image: `${SITE_URL}/brand/revia-logo-terra-transparent.svg`,
    medicalSpecialty: "Dermatology",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      addressCountry: BUSINESS.addressCountry,
    },
    areaServed: { "@type": "City", name: "Bogotá" },
    sameAs: [BUSINESS.instagram],
    knowsAbout: [
      "Medicina estética no invasiva",
      "Medicina regenerativa",
      "Bioestimuladores de colágeno",
      "Plasma rico en plaquetas",
      "Implante capilar no invasivo",
      "Longevidad y bienestar",
    ],
  };
}

/** MedicalProcedure para una ficha de tratamiento. */
export function medicalProcedureJsonLd(
  treatment: Treatment,
  category: Category,
  url: string,
): Json {
  const json: Json = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: treatment.name,
    description: treatment.summary,
    url,
    // Todos los tratamientos son no invasivos (ley dura del proyecto).
    procedureType: "https://schema.org/NoninvasiveProcedure",
    category: category.name,
    provider: { "@id": `${SITE_URL}/#clinic` },
  };
  if (treatment.bodyZones && treatment.bodyZones.length > 0) {
    json.bodyLocation = treatment.bodyZones.map((z) => z.replace(/-/g, " "));
  }
  if (treatment.outcome) {
    json.expectedPrognosis = treatment.outcome;
  }
  return json;
}

/**
 * FAQPage JSON-LD (Fase 4, ADR 0018). Se emite en una ficha SOLO cuando hay FAQ
 * real por tratamiento — nunca sobre el template genérico duplicado, para no
 * marcar como FAQPage contenido repetido entre URLs.
 */
export function faqPageJsonLd(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

/** BreadcrumbList JSON-LD. `path` relativo (se prefija con SITE_URL). */
export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

/** Lista de URLs de tratamientos (corporal + facial) para sitemap. */
export function treatmentUrls(): string[] {
  const urls: string[] = [];
  for (const slug of Object.keys(CATEGORY_SLUG_TO_ID)) {
    const cat = getCategoryBySlug(slug);
    cat?.treatments.forEach((t) => urls.push(`/tratamientos/${slug}/${t.id}`));
  }
  return urls;
}

/** Lista de URLs de experiencias de longevidad para sitemap. */
export function longevidadExperienceUrls(): string[] {
  const cat = getCategoryById("longevidad-bienestar");
  return (cat?.treatments ?? []).map((t) => `/longevidad/${t.id}`);
}

/** Slugs de subcategoría (corporal, facial). */
export function categorySlugs(): string[] {
  return Object.keys(CATEGORY_SLUG_TO_ID);
}

export { CATEGORY_ID_TO_SLUG };
