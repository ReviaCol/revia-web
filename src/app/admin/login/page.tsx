import type { Metadata } from "next";
import { LoginForm } from "./_components/LoginForm";

export const metadata: Metadata = {
  title: "Acceso — Panel Reviá",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main id="contenido"
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--revia-cream-50)", padding: "var(--gutter)" }}
    >
      <div className="w-full" style={{ maxWidth: "380px" }}>
        <p
          className="font-display lowercase m-0 mb-2"
          style={{ fontSize: "26px", letterSpacing: "-0.01em", color: "var(--revia-marron-inst)" }}
        >
          reviá
        </p>
        <p
          className="font-body uppercase m-0 mb-9"
          style={{ fontSize: "11px", letterSpacing: "0.2em", color: "var(--revia-coffee-700)" }}
        >
          Panel interno
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
