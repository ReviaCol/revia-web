import Link from "next/link";
import { SiteNav } from "@/components/layout/SiteNav";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Página no encontrada — Reviá" };

export default function NotFound() {
  return (
    <>
      <SiteNav current="/" />
      <main
        id="contenido"
        className="relative z-[2] flex flex-col justify-center"
        style={{ padding: "var(--hero-y-top) var(--gutter) var(--section-y)", minHeight: "68vh" }}
      >
        <p
          className="font-body inline-flex items-center text-coffee-700 m-0 mb-8 uppercase"
          style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px" }}
        >
          <span aria-hidden="true" className="block bg-accent" style={{ width: "28px", height: "1px" }} />
          Error 404
        </p>
        <h1
          className="font-display font-medium text-coffee-900 m-0"
          style={{ fontSize: "var(--text-display-lg)", lineHeight: 1.1, letterSpacing: "-0.014em", maxWidth: "16ch" }}
        >
          Esta página aún no se ha revelado.
        </h1>
        <p
          className="font-body text-coffee-700 m-0 mt-6"
          style={{ fontSize: "17px", lineHeight: 1.6, maxWidth: "46ch" }}
        >
          El enlace que buscas no existe o cambió de lugar. Volvamos a un punto conocido.
        </p>
        <div className="mt-10">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 bg-coffee-900 text-cream-50 px-8 py-4 transition-all duration-500 ease-out hover:bg-coffee-700 hover:-translate-y-0.5"
            style={{ fontSize: "14px", letterSpacing: "0.08em" }}
          >
            <span className="uppercase">Volver al inicio</span>
            <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
