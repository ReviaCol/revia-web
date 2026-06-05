"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";

/**
 * ContactForm — formulario de contacto.
 *
 * POST a /api/contact, que persiste el lead en Supabase (CRM interno, ver
 * ADR 0004). Muestra un toast de confirmación cálido al enviar.
 *
 * Las opciones de "servicio de interés" se alimentan de las categorías de
 * treatments.json (pasadas como prop `services` desde el server component).
 */

export type ServiceOption = { id: string; name: string };

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  services,
  initialService,
}: {
  services: ServiceOption[];
  initialService?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Pre-selecciona el servicio si viene en la URL (?service=) y existe.
  const matchedInitial = services.find((s) => s.id === initialService)?.id ?? "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      nombre: String(form.get("nombre") ?? ""),
      email: String(form.get("email") ?? ""),
      whatsapp: String(form.get("whatsapp") ?? ""),
      servicio: String(form.get("servicio") ?? ""),
      mensaje: String(form.get("mensaje") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "No pudimos enviar tu mensaje.");
      }
      setStatus("success");
      formEl.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "No pudimos enviar tu mensaje.",
      );
    }
  }

  const fieldClass =
    "font-body w-full bg-transparent border-0 border-b border-coffee-900/20 text-coffee-900 px-0 py-3 text-[16px] outline-none transition-colors duration-200 focus:border-coffee-900 placeholder:text-coffee-500";
  const labelClass =
    "font-body uppercase text-coffee-700 mb-2 block";
  const labelStyle = { fontSize: "11px", letterSpacing: "0.18em", fontWeight: 500 } as const;

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate className="grid gap-7">
        <div>
          <label htmlFor="nombre" className={labelClass} style={labelStyle}>
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            autoComplete="name"
            placeholder="Tu nombre"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass} style={labelStyle}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className={labelClass} style={labelStyle}>
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            placeholder="+57 300 000 0000"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="servicio" className={labelClass} style={labelStyle}>
            Servicio de interés
          </label>
          <select
            id="servicio"
            name="servicio"
            defaultValue={matchedInitial}
            className={`${fieldClass} appearance-none cursor-pointer`}
          >
            <option value="">Selecciona una opción</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mensaje" className={labelClass} style={labelStyle}>
            Mensaje <span className="lowercase tracking-normal opacity-60">(opcional)</span>
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={4}
            placeholder="Cuéntanos qué buscas revelar."
            className={`${fieldClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex items-center justify-between gap-4 bg-coffee-900 text-cream-50 px-7 py-4 mt-2 transition-all duration-500 ease-out hover:bg-coffee-700 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          <span
            className="font-body uppercase"
            style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em" }}
          >
            {status === "submitting" ? "Enviando…" : "Enviar mensaje"}
          </span>
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-out group-hover:translate-x-2"
          >
            →
          </span>
        </button>
      </form>

      {/* Toast / confirmación */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            role="status"
            aria-live="polite"
            className="mt-7 px-6 py-5 border"
            style={{
              background: "var(--revia-cream-100)",
              borderColor: "rgba(89, 65, 60, 0.14)",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: duration.medium, ease: easing.outExpo }}
          >
            <p
              className="font-display text-coffee-900 m-0"
              style={{ fontSize: "20px", lineHeight: 1.35 }}
            >
              Hemos recibido tu mensaje.
            </p>
            <p
              className="font-body text-coffee-700 m-0 mt-2"
              style={{ fontSize: "14px", lineHeight: 1.6 }}
            >
              Te respondemos en menos de 24 horas, con el cuidado que mereces.
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            role="alert"
            aria-live="assertive"
            className="mt-7 px-6 py-5 border"
            style={{
              background: "var(--revia-cream-100)",
              borderColor: "rgba(140, 81, 59, 0.4)",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: duration.medium, ease: easing.outExpo }}
          >
            <p
              className="font-body text-coffee-900 m-0"
              style={{ fontSize: "14px", lineHeight: 1.6 }}
            >
              {errorMsg} Puedes escribirnos directamente por WhatsApp mientras
              tanto.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
