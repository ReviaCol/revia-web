import type { NextConfig } from "next";

/**
 * Configuracion de Next + headers de seguridad para produccion.
 *
 * - poweredByHeader: false -> no exponer X-Powered-By: Next.js.
 * - compress: true -> compresion Brotli/gzip.
 * - reactStrictMode: true -> catch render bugs en dev.
 * - headers() -> endurecimiento minimo razonable para una web publica.
 *
 * CSP NO se declara aqui: Tailwind v4 + next/font + react-three requieren
 * ajustes que rompen facil. Se deja para un ADR de hardening post-launch.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

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
