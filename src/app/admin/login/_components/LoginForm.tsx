"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * LoginForm — autenticación del equipo con email + contraseña (Supabase Auth).
 * Los usuarios se crean desde el dashboard de Supabase (Authentication → Users).
 */
export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      setErrorMsg("No pudimos iniciar sesión. Revisa tus credenciales.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  const fieldClass =
    "font-body w-full bg-transparent border-0 border-b border-coffee-900/20 text-coffee-900 px-0 py-3 text-[16px] outline-none transition-colors duration-200 focus:border-coffee-900 placeholder:text-coffee-500";
  const labelStyle = { fontSize: "11px", letterSpacing: "0.18em", fontWeight: 500 } as const;

  return (
    <form onSubmit={handleSubmit} className="grid gap-7">
      <div>
        <label htmlFor="email" className="font-body uppercase text-coffee-700 mb-2 block" style={labelStyle}>
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="tu@revia.com.co" className={fieldClass} />
      </div>

      <div>
        <label htmlFor="password" className="font-body uppercase text-coffee-700 mb-2 block" style={labelStyle}>
          Contraseña
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className={fieldClass} />
      </div>

      {status === "error" && (
        <p role="alert" className="font-body m-0" style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--revia-terracotta-600)" }}>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex items-center justify-between gap-4 bg-coffee-900 text-cream-50 px-7 py-4 mt-1 transition-all duration-500 ease-out hover:bg-coffee-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="font-body uppercase" style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em" }}>
          {status === "submitting" ? "Entrando…" : "Entrar"}
        </span>
        <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-2">→</span>
      </button>
    </form>
  );
}
