import type { Metadata, Viewport } from "next";
import { Jost, Manrope } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { medicalClinicJsonLd } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "./design.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext"],
  weight: ["200", "300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reviá — Belleza y Vitalidad",
  description:
    "Tu belleza ya existe. Espera ser revelada. Centro de medicina estética, regenerativa y bienestar en Bogotá. Tratamientos no invasivos.",
  metadataBase: new URL("https://revia.com.co"),
  openGraph: {
    title: "Reviá — Belleza y Vitalidad",
    description: "Tu belleza ya existe. Espera ser revelada.",
    type: "website",
    locale: "es_CO",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Reviá — Tu belleza ya existe. Espera ser revelada.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reviá — Belleza y Vitalidad",
    description: "Tu belleza ya existe. Espera ser revelada.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF6F1" },
    { media: "(prefers-color-scheme: dark)", color: "#59413C" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CO"
      className={`${jost.variable} ${manrope.variable} antialiased`}
    >
      <body>
        <a href="#contenido" className="skip-link">Saltar al contenido</a>
        <JsonLd data={medicalClinicJsonLd()} />
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
