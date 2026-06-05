"use client";

import { useState } from "react";

/**
 * ContactFormDesign — port del <form class="form"> del mockup Claude Design.
 * Mantiene la lógica de POST a /api/contact (Supabase CRM).
 */

export type ServiceOption = { id: string; name: string };

type Status = "idle" | "submitting" | "success" | "error";

export function ContactFormDesign({
  services,
  initialService,
}: {
  services: ServiceOption[];
  initialService?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  const matchedInitial =
    services.find((s) => s.id === initialService)?.id ?? "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMsg("");

    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      nombre: String(form.get("nombre") ?? ""),
      email: String(form.get("email") ?? ""),
      whatsapp: String(form.get("telefono") ?? ""),
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
      setMsg(
        "Hemos recibido tu mensaje. Te respondemos en menos de 24 horas."
      );
      formEl.reset();
    } catch (err) {
      setStatus("error");
      setMsg(
        err instanceof Error
          ? err.message
          : "No pudimos enviar tu mensaje. Escríbenos por WhatsApp."
      );
    }
  }

  return (
    <form
      className="form"
      onSubmit={handleSubmit}
      noValidate
      id="leadForm"
    >
      <div className="field">
        <label htmlFor="f-nombre">Nombre completo</label>
        <input
          id="f-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="f-email">Correo electrónico</label>
        <input
          id="f-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="f-tel">Teléfono / WhatsApp</label>
        <input id="f-tel" name="telefono" type="tel" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="f-servicio">¿Qué te interesa?</label>
        <select
          id="f-servicio"
          name="servicio"
          defaultValue={matchedInitial}
        >
          <option value="">Selecciona un universo</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-msg">Cuéntanos qué buscas revelar</label>
        <textarea id="f-msg" name="mensaje" />
      </div>
      <button
        className="submit"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Enviando…" : "Enviar solicitud"}
      </button>
      <p
        className="form-note"
        id="formMsg"
        role="status"
        aria-live="polite"
        style={{
          color:
            status === "error"
              ? "var(--terra)"
              : status === "success"
              ? "var(--turq-deep)"
              : "var(--ink-500)",
        }}
      >
        {msg}
      </p>
    </form>
  );
}
