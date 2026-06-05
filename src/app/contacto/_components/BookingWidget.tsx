"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";
import {
  bookableDays,
  type BookableDay,
  type BookingCategory,
} from "@/lib/booking";

/**
 * BookingWidget — flujo de reserva Reviá (ADR 0009).
 *
 * Flujo: categoría (Rostro / Cuerpo / Capilar) → día → slots reales
 * (free/busy del calendario asociado a esa categoría) → datos → confirmación.
 *
 * Cream-branded; acentos turquesa; fallback cálido a WhatsApp si el sistema no
 * está disponible para esa categoría.
 *
 * Mapeo categoría → calendario (server-side, en booking.ts):
 *   rostro + cuerpo → calendario Dra. Bibiana
 *   capilar         → calendario Capilar
 */

const WHATSAPP =
  "https://wa.me/573188279094?text=" +
  encodeURIComponent("Hola Reviá, me gustaría agendar una consulta de valoración.");

type Status = "idle" | "loading" | "submitting";

type CategoryOption = {
  id: BookingCategory;
  title: string;
  sub: string;
};

const CATEGORIES: CategoryOption[] = [
  { id: "rostro", title: "Rostro", sub: "Rejuvenecimiento facial" },
  { id: "cuerpo", title: "Cuerpo", sub: "Rejuvenecimiento corporal" },
  { id: "capilar", title: "Capilar", sub: "Implante capilar" },
];

const PAGE_SIZE = 7; // días visibles por página en el selector de fecha

export function BookingWidget({ onClose }: { onClose?: () => void }) {
  // Traemos TODOS los días hábiles dentro de la ventana (≤ 30 días = ~25 hábiles)
  // y paginamos de a PAGE_SIZE para evitar scroll horizontal.
  const allDays = useMemo<BookableDay[]>(() => bookableDays(40), []);
  const [pageStart, setPageStart] = useState(0);
  const [category, setCategory] = useState<BookingCategory | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [time, setTime] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const visibleDays = allDays.slice(pageStart, pageStart + PAGE_SIZE);
  const canPrev = pageStart > 0;
  const canNext = pageStart + PAGE_SIZE < allDays.length;

  function pickCategory(c: BookingCategory) {
    setCategory(c);
    setDate(null);
    setSlots(null);
    setTime(null);
    setError(null);
    setConfigured(true);
  }

  async function pickDate(d: string) {
    if (!category) return;
    setDate(d);
    setTime(null);
    setSlots(null);
    setError(null);
    setStatus("loading");
    try {
      const res = await fetch(
        `/api/booking/availability?date=${d}&category=${category}`,
        { cache: "no-store" },
      );
      const data = (await res.json()) as { configured?: boolean; slots?: string[]; error?: string };
      setConfigured(data.configured !== false);
      setSlots(data.slots ?? []);
      if (data.error) setError(data.error);
    } catch {
      setSlots([]);
      setError("No se pudo consultar la disponibilidad.");
    } finally {
      setStatus("idle");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!category || !date || !time) return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ category, name, email, phone, date, time, notes }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        token?: string;
        paymentLink?: string;
        trackingLink?: string;
        expiresAt?: string;
        whenLabel?: string;
        error?: string;
      };
      if (
        res.ok &&
        data.ok === true &&
        data.token &&
        data.paymentLink &&
        data.trackingLink &&
        data.expiresAt &&
        data.whenLabel
      ) {
        setConfirmation({
          token: data.token,
          paymentLink: data.paymentLink,
          trackingLink: data.trackingLink,
          expiresAt: data.expiresAt,
          whenLabel: data.whenLabel,
        });
      } else {
        setError(data.error ?? "No se pudo completar la reserva.");
      }
    } catch {
      setError("No se pudo completar la reserva. Intenta de nuevo o escríbenos por WhatsApp.");
    } finally {
      setStatus("idle");
    }
  }

  const reveal = {
    initial: { opacity: 0, y: 10, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: duration.medium, ease: easing.outExpo },
  };

  // — Pantalla post-reserva: pendiente de pago (ADR 0010) —
  if (confirmation !== null) {
    return <PendingPaymentCard data={confirmation} onClose={onClose} />;
  }

  return (
    <div>
      <p
        className="font-body inline-flex items-center text-coffee-700 m-0 mb-3 uppercase"
        style={{ fontSize: "11px", letterSpacing: "0.28em", gap: "12px" }}
      >
        <span aria-hidden="true" className="block bg-accent" style={{ width: "24px", height: "1px" }} />
        Agendar valoración
      </p>
      <h3 className="font-display text-coffee-900 m-0 mb-6" style={{ fontSize: "clamp(24px, 3vw, 30px)", lineHeight: 1.15, fontWeight: 400 }}>
        Elige tu <em className="font-display" style={{ fontStyle: "italic", color: "var(--revia-turquesa-700)" }}>momento</em>.
      </h3>

      {/* Paso 1 — Categoría */}
      <fieldset className="m-0 p-0 border-0" style={{ minWidth: 0 }}>
        <legend className="font-body uppercase text-coffee-500 mb-3" style={{ fontSize: "10px", letterSpacing: "0.16em" }}>
          1 · ¿Qué te interesa?
        </legend>
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => pickCategory(c.id)}
                aria-pressed={active}
                className="text-left border transition-colors duration-300"
                style={{
                  padding: "14px 12px",
                  borderColor: active ? "var(--revia-turquesa-700)" : "rgba(89,65,60,0.18)",
                  background: active ? "var(--revia-turquesa-700)" : "transparent",
                  color: active ? "var(--revia-cream-50)" : "var(--revia-coffee-900)",
                }}
              >
                <span className="block font-display" style={{ fontSize: "18px", lineHeight: 1.15, fontWeight: 400 }}>
                  {c.title}
                </span>
                <span className="block font-body mt-1" style={{ fontSize: "11px", lineHeight: 1.4, opacity: active ? 0.9 : 0.7 }}>
                  {c.sub}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Paso 2 — Día (paginado 7 días por página, sin scroll horizontal) */}
      {category ? (
        <motion.fieldset {...reveal} className="m-0 p-0 border-0 mt-6" style={{ minWidth: 0 }}>
          <div className="flex items-baseline justify-between mb-3">
            <legend className="font-body uppercase text-coffee-500" style={{ fontSize: "10px", letterSpacing: "0.16em" }}>
              2 · Día
            </legend>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPageStart((p) => Math.max(0, p - PAGE_SIZE))}
                disabled={!canPrev}
                aria-label="Días anteriores"
                className="font-body uppercase transition-opacity"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  color: canPrev ? "var(--revia-coffee-700)" : "var(--revia-coffee-500)",
                  opacity: canPrev ? 1 : 0.4,
                  cursor: canPrev ? "pointer" : "not-allowed",
                }}
              >
                ← Antes
              </button>
              <button
                type="button"
                onClick={() => setPageStart((p) => Math.min(allDays.length - PAGE_SIZE, p + PAGE_SIZE))}
                disabled={!canNext}
                aria-label="Días siguientes"
                className="font-body uppercase transition-opacity"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  color: canNext ? "var(--revia-coffee-700)" : "var(--revia-coffee-500)",
                  opacity: canNext ? 1 : 0.4,
                  cursor: canNext ? "pointer" : "not-allowed",
                }}
              >
                Después →
              </button>
            </div>
          </div>
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${PAGE_SIZE}, minmax(0, 1fr))` }}
          >
            {visibleDays.map((d) => {
              const active = date === d.dateISO;
              return (
                <button
                  key={d.dateISO}
                  type="button"
                  onClick={() => pickDate(d.dateISO)}
                  aria-pressed={active}
                  className="border text-center transition-colors duration-300"
                  style={{
                    padding: "10px 4px",
                    borderColor: active ? "var(--revia-turquesa-700)" : "rgba(89,65,60,0.18)",
                    background: active ? "var(--revia-turquesa-700)" : "transparent",
                    color: active ? "var(--revia-cream-50)" : "var(--revia-coffee-900)",
                  }}
                >
                  <span className="block font-body uppercase" style={{ fontSize: "9px", letterSpacing: "0.14em", opacity: 0.8 }}>{d.weekdayShort}</span>
                  <span className="block font-display" style={{ fontSize: "20px", lineHeight: 1.1 }}>{d.dayNum}</span>
                  <span className="block font-body" style={{ fontSize: "9px", opacity: 0.8 }}>{d.monthShort}</span>
                </button>
              );
            })}
          </div>
        </motion.fieldset>
      ) : null}

      {/* Paso 3 — Hora */}
      {category && date ? (
        <motion.fieldset {...reveal} className="m-0 p-0 border-0 mt-6" style={{ minWidth: 0 }}>
          <legend className="font-body uppercase text-coffee-500 mb-3" style={{ fontSize: "10px", letterSpacing: "0.16em" }}>
            3 · Hora
          </legend>
          {status === "loading" ? (
            <p className="font-body text-coffee-700 m-0" style={{ fontSize: "14px" }}>Consultando disponibilidad…</p>
          ) : !configured ? (
            <p className="font-body text-coffee-700 m-0" style={{ fontSize: "14px", lineHeight: 1.6 }}>
              El agendamiento en línea estará disponible muy pronto. Mientras tanto,{" "}
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--revia-turquesa-700)" }}>
                escríbenos por WhatsApp
              </a>{" "}y reservamos tu valoración.
            </p>
          ) : slots && slots.length === 0 ? (
            <p className="font-body text-coffee-700 m-0" style={{ fontSize: "14px", lineHeight: 1.6 }}>
              No quedan horarios libres ese día. Prueba con otra fecha.
            </p>
          ) : (
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))" }}>
              {slots?.map((s) => {
                const active = time === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTime(s)}
                    aria-pressed={active}
                    className="border font-body transition-colors duration-300"
                    style={{
                      padding: "10px 6px", fontSize: "13px",
                      borderColor: active ? "var(--revia-turquesa-700)" : "rgba(89,65,60,0.18)",
                      background: active ? "var(--revia-turquesa-700)" : "transparent",
                      color: active ? "var(--revia-cream-50)" : "var(--revia-coffee-900)",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </motion.fieldset>
      ) : null}

      {/* Paso 4 — Datos */}
      {category && date && time ? (
        <motion.form {...reveal} onSubmit={submit} className="mt-6 grid gap-4">
          <legend className="font-body uppercase text-coffee-500" style={{ fontSize: "10px", letterSpacing: "0.16em" }}>
            4 · Tus datos
          </legend>
          <Field id="bk-name" label="Nombre" value={name} onChange={setName} required autoComplete="name" />
          <Field id="bk-email" label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" />
          <Field id="bk-phone" label="Teléfono" type="tel" value={phone} onChange={setPhone} required autoComplete="tel" />
          <div className="grid gap-1.5">
            <label htmlFor="bk-notes" className="font-body uppercase text-coffee-700" style={{ fontSize: "10px", letterSpacing: "0.14em" }}>
              Notas (opcional)
            </label>
            <textarea
              id="bk-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="font-body bg-transparent border text-coffee-900"
              style={{ padding: "10px 12px", fontSize: "14px", borderColor: "rgba(89,65,60,0.2)", resize: "vertical" }}
            />
          </div>

          {error ? (
            <p className="font-body m-0" style={{ fontSize: "13px", color: "var(--revia-coffee-500)" }} role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center justify-center gap-3 bg-coffee-900 text-cream-50 px-6 py-4 font-body uppercase transition-all duration-500 ease-out hover:-translate-y-0.5 disabled:opacity-60"
            style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em" }}
          >
            {status === "submitting" ? "Reservando…" : "Confirmar reserva"}
            <span aria-hidden="true">→</span>
          </button>
        </motion.form>
      ) : null}
    </div>
  );
}

type Confirmation = {
  token: string;
  paymentLink: string;
  trackingLink: string;
  expiresAt: string;   // ISO timestamptz
  whenLabel: string;
};

/**
 * Pantalla post-reserva — el paciente acaba de confirmar pero todavía tiene
 * que pagar. Muestra: countdown vivo a las 12h, CTA "Pagar ahora" → Bold via
 * HeySetter, link discreto a /reserva/[token] para volver al estado.
 */
function PendingPaymentCard({
  data,
  onClose,
}: {
  data: Confirmation;
  onClose?: () => void;
}) {
  // Misma config de reveal que el resto del widget — local para evitar
  // arrastrar el type readonly de easing.outExpo a la firma del prop.
  const reveal = {
    initial: { opacity: 0, y: 10, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: duration.medium, ease: easing.outExpo },
  };
  const expiresMs = useMemo(() => new Date(data.expiresAt).getTime(), [data.expiresAt]);
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  const remainingMs = Math.max(0, expiresMs - now);
  const hours = Math.floor(remainingMs / 3_600_000);
  const minutes = Math.floor((remainingMs % 3_600_000) / 60_000);
  const countdownText =
    remainingMs === 0
      ? "el plazo expiró"
      : hours >= 1
        ? `${hours}h ${minutes}m`
        : `${minutes} min`;

  return (
    <motion.div {...reveal} style={{ padding: "4px 2px" }}>
      <p
        className="font-body inline-flex items-center text-coffee-700 m-0 mb-3 uppercase"
        style={{ fontSize: "11px", letterSpacing: "0.28em", gap: "12px" }}
      >
        <span
          aria-hidden="true"
          className="block"
          style={{ width: "24px", height: "1px", background: "var(--revia-coffee-500)" }}
        />
        Reserva pendiente de pago
      </p>
      <h3
        className="font-display text-coffee-900 m-0 mb-4"
        style={{ fontSize: "clamp(24px, 3vw, 30px)", lineHeight: 1.15, fontWeight: 400 }}
      >
        Reservamos tu <em className="font-display" style={{ fontStyle: "italic", color: "var(--revia-turquesa-700)" }}>momento</em>.
      </h3>

      <p
        className="font-body text-coffee-900 m-0 mb-2"
        style={{ fontSize: "15px", lineHeight: 1.5 }}
      >
        {data.whenLabel}
      </p>
      <p
        className="font-body text-coffee-700 m-0 mb-6"
        style={{ fontSize: "14px", lineHeight: 1.65 }}
      >
        Para confirmar tu reserva, completa el pago. Tu slot te espera durante {countdownText}.
      </p>

      <a
        href={data.paymentLink}
        className="inline-flex items-center justify-center gap-3 bg-coffee-900 text-cream-50 px-6 py-4 font-body uppercase transition-all duration-500 ease-out hover:-translate-y-0.5"
        style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textDecoration: "none" }}
      >
        Pagar ahora
        <span aria-hidden="true">→</span>
      </a>

      <p
        className="font-body m-0 mt-5"
        style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--revia-coffee-700)" }}
      >
        También puedes{" "}
        <a
          href={data.trackingLink}
          className="underline"
          style={{ color: "var(--revia-turquesa-700)" }}
        >
          ver el estado de tu reserva
        </a>{" "}
        cuando quieras.
      </p>

      <p
        className="font-body m-0 mt-3"
        style={{ fontSize: "12px", lineHeight: 1.6, color: "var(--revia-coffee-500)" }}
      >
        Si algo no funciona, escríbenos por{" "}
        <a
          href="https://wa.me/573188279094"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: "var(--revia-turquesa-700)" }}
        >
          WhatsApp
        </a>{" "}
        y te ayudamos.
      </p>

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="mt-7 font-body uppercase text-coffee-700 hover:text-coffee-900 transition-colors"
          style={{ fontSize: "11px", letterSpacing: "0.14em", background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          Cerrar
        </button>
      ) : null}
    </motion.div>
  );
}

function Field({
  id, label, value, onChange, type = "text", required, autoComplete,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; autoComplete?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="font-body uppercase text-coffee-700" style={{ fontSize: "10px", letterSpacing: "0.14em" }}>
        {label}{required ? " *" : ""}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="font-body bg-transparent border text-coffee-900"
        style={{ padding: "10px 12px", fontSize: "14px", borderColor: "rgba(89,65,60,0.2)" }}
      />
    </div>
  );
}
