import type { NextConfig } from "next";

/**
 * Configuracion de Next + headers de seguridad para produccion.
 *
 * - poweredByHeader: false -> no exponer X-Powered-By: Next.js.
 * - compress: true -> compresion Brotli/gzip.
 * - reactStrictMode: true -> catch render bugs en dev.
 * - images.remotePatterns -> permite servir fotos del bucket Supabase Storage
 *   (`team-photos`, CMS Fase 3 / ADR 0017) con next/image.
 * - headers() -> endurecimiento minimo razonable para una web publica.
 *
 * CSP NO se declara aqui: Tailwind v4 + next/font + react-three requieren
 * ajustes que rompen facil. Se deja para un ADR de hardening post-launch.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
