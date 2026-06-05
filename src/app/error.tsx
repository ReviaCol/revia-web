"use client";

import Link from "next/link";

/**
 * Error boundary de la app (App Router). Client component obligatorio.
 * Estado de marca, sin nav/footer (que podrían ser la fuente del error).
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main
      id="contenido"
      className="relative z-[2] flex flex-col justify-center"
      style={{
        padding: "var(--hero-y-top) var(--gutter) var(--section-y)",
        minHeight: "100vh",
        background: "var(--revia-cream-50)",
      }}
    >
      <p
        className="font-body inline-flex items-center text-coffee-700 m-0 mb-8 uppercase"
        style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px" }}
      >
        <span aria-hidden="true" className="block bg-accent" style={{ width: "28px", height: "1px" }} />
        Algo se interrumpió
      </p>
      <h1
        className="font-display font-medium text-coffee-900 m-0"
        style={{ fontSize: "var(--text-display-lg)", lineHeight: 1.1, letterSpacing: "-0.014em", maxWidth: "16ch" }}
      >
        Tuvimos un inconveniente.
      </h1>
      <p
        className="font-body text-coffee-700 m-0 mt-6"
        style={{ fontSize: "17px", lineHeight: 1.6, maxWidth: "46ch" }}
      >
        Vuelve a intentarlo en un momento. Si persiste, escríbenos y lo resolvemos contigo.
      </p>
      <div className="mt-10 flex items-center gap-6">
        <button
          type="button"
          onClick={reset}
          className="group inline-flex items-center gap-3 bg-coffee-900 text-cream-50 px-8 py-4 transition-all duration-500 ease-out hover:bg-coffee-700 hover:-translate-y-0.5"
          style={{ fontSize: "14px", letterSpacing: "0.08em" }}
        >
          <span className="uppercase">Reintentar</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center font-body uppercase text-coffee-900"
          style={{ fontSize: "14px", letterSpacing: "0.08em" }}
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
