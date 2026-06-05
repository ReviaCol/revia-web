import type { MetadataRoute } from "next";
import {
  SITE_URL,
  categorySlugs,
  longevidadExperienceUrls,
  treatmentUrls,
} from "@/lib/seo";

/**
 * sitemap.xml — generado en build. Enumera rutas estáticas + dinámicas
 * (subcategorías, fichas de tratamiento, experiencias de longevidad).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/filosofia",
    "/tratamientos",
    "/equipo",
    "/contacto",
    "/implante-capilar",
    "/antienvejecimiento",
    "/longevidad",
    "/longevidad/membresias",
    "/privacidad",
    "/terminos",
    "/aviso-medico",
  ];

  const categoryPaths = categorySlugs().map((s) => `/tratamientos/${s}`);
  const dynamicPaths = [...treatmentUrls(), ...longevidadExperienceUrls()];
  const all = [...staticPaths, ...categoryPaths, ...dynamicPaths];
  const lastModified = new Date();

  return all.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
  }));
}
