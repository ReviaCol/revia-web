import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** robots.txt — permite todo salvo /api y /admin, apunta al sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
