"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../_components/AdminShell";
import {
  minToTime,
  timeToMin,
  type ActionResult,
  type ContactRow,
  type HourRow,
} from "../types";
import { updateSiteContact, updateSiteHours } from "../actions";

/**
 * ContactBoard — edición de contacto y horario de atención (CMS Fase 2, ADR 0015).
 * Dos bloques: datos de contacto (1 fila singleton) y horario (7 días). Cada
 * guardado dispara updateTag("site-content") en la server action → el sitio se
 * refresca solo. El horario aquí es SOLO display; no cambia la agenda de reservas.
 */

const WEEKDAYS = [
  { wd: 1, label: "Lunes" },
  { wd: 2, label: "Martes" },
  { wd: 3, label: "Miércoles" },
  { wd: 4, label: "Jueves" },
  { wd: 5, label: "Viernes" },
  { wd: 6, label: "Sábado" },
  { wd: 0, label: "Domingo" },
];

function fillHours(rows: HourRow[]): HourRow[] {
  const byDay = new Map(rows.map((r) => [r.weekday, r]));
  return WEEKDAYS.map(
    ({ wd }) =>
      byDay.get(wd) ?? { weekday: wd, closed: true, open_min: null, close_min: null },
  );
}

export function ContactBoard({
  initialContact,
  initialHours,
  userEmail,
  loadError,
}: {
  initialContact: ContactRow;
  initialHours: HourRow[];
  userEmail: string;
  loadError?: boolean;
}) {
  const router = useRouter();
  const [c, setC] = useState<ContactRow>(initialContact);
  const [hours, setHours] = useState<HourRow[]>(fillHours(initialHours));
  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<ActionResult>, okText: string) {
    setErrorMsg("");
    setOkMsg("");
    startTransition(async () => {
      const res = await action();
      if (!res.ok) {
        setErrorMsg(res.error ?? "Algo salió mal. Intenta de nuevo.");
        router.refresh();
        return;
      }
      setOkMsg(okText);
      router.refresh();
    });
  }

  function saveContact() {
    run(
      () =>
        updateSiteContact({
          phone: c.phone,
          whatsapp: c.whatsapp,
          email: c.email,
          street_address: c.street_address,
          address_locality: c.address_locality,
          address_region: c.address_region,
          address_country: c.address_country,
          instagram_url: c.instagram_url ?? "",
          maps_url: c.maps_url ?? "",
        }),
      "Contacto guardado. El sitio ya está actualizado.",
    );
  }

  function saveHours() {
    run(() => updateSiteHours(hours), "Horario guardado. El sitio ya está actualizado.");
  }

  function field(key: keyof ContactRow, value: string) {
    setC((prev) => ({ ...prev, [key]: value }));
  }

  function setHour(wd: number, patch: Partial<HourRow>) {
    setHours((prev) => prev.map((h) => (h.weekday === wd ? { ...h, ...patch } : h)));
  }

  return (
    <AdminShell
      active="contacto"
      userEmail={userEmail}
      busy={pending}
      title="Contacto y horarios"
      subtitle="Teléfonos, WhatsApp, email, dirección y horario de atención. Los cambios se publican al instante en la web."
    >
      {loadError && (
        <div className="adm-alert adm-alert-err">
          No se pudo leer de la base. Revisa que las migraciones 0006–0008 estén corridas.
        </div>
      )}
      {errorMsg && <div className="adm-alert adm-alert-err">{errorMsg}</div>}
      {okMsg && (
        <div className="adm-note" role="status">
          <span>✓ {okMsg}</span>
        </div>
      )}

      {/* ── Datos de contacto ─────────────────────────────────────────── */}
      <div className="adm-form" style={{ marginBottom: 32 }}>
        <h2 className="adm-form-title">Datos de contacto</h2>

        <div className="adm-row">
          <div className="adm-field">
            <label htmlFor="c-phone">Teléfono (llamadas)</label>
            <input
              id="c-phone"
              className="adm-input"
              value={c.phone}
              onChange={(e) => field("phone", e.target.value)}
              placeholder="+57 310 343 8833"
            />
            <p className="adm-hint">Como se muestra. El enlace de llamada usa solo los dígitos.</p>
          </div>
          <div className="adm-field">
            <label htmlFor="c-wa">WhatsApp</label>
            <input
              id="c-wa"
              className="adm-input"
              value={c.whatsapp}
              onChange={(e) => field("whatsapp", e.target.value)}
              placeholder="+57 311 561 9394"
            />
            <p className="adm-hint">El enlace de wa.me usa solo los dígitos.</p>
          </div>
        </div>

        <div className="adm-row">
          <div className="adm-field">
            <label htmlFor="c-email">Email</label>
            <input
              id="c-email"
              className="adm-input"
              value={c.email}
              onChange={(e) => field("email", e.target.value)}
              placeholder="admin@revia.com.co"
            />
          </div>
          <div className="adm-field">
            <label htmlFor="c-ig">Instagram (URL)</label>
            <input
              id="c-ig"
              className="adm-input"
              value={c.instagram_url ?? ""}
              onChange={(e) => field("instagram_url", e.target.value)}
              placeholder="https://instagram.com/reviatratamientossincirugia"
            />
            <p className="adm-hint">El @ se deriva del final de la URL.</p>
          </div>
        </div>

        <div className="adm-row">
          <div className="adm-field">
            <label htmlFor="c-street">Dirección</label>
            <input
              id="c-street"
              className="adm-input"
              value={c.street_address}
              onChange={(e) => field("street_address", e.target.value)}
              placeholder="Cra 16 # 86B-52"
            />
          </div>
          <div className="adm-field">
            <label htmlFor="c-city">Ciudad</label>
            <input
              id="c-city"
              className="adm-input"
              value={c.address_locality}
              onChange={(e) => field("address_locality", e.target.value)}
              placeholder="Bogotá"
            />
          </div>
        </div>

        <div className="adm-field">
          <label htmlFor="c-maps">Enlace de mapa (opcional)</label>
          <input
            id="c-maps"
            className="adm-input"
            value={c.maps_url ?? ""}
            onChange={(e) => field("maps_url", e.target.value)}
            placeholder="Se genera desde la dirección si lo dejas vacío."
          />
        </div>

        <div className="adm-form-actions">
          <button
            type="button"
            className="adm-btn adm-btn-primary adm-btn-lg"
            onClick={saveContact}
            disabled={pending}
          >
            Guardar contacto
          </button>
        </div>
      </div>

      {/* ── Horario de atención ───────────────────────────────────────── */}
      <div className="adm-form">
        <h2 className="adm-form-title">Horario de atención</h2>
        <div className="adm-note" style={{ marginBottom: 4 }}>
          <span>
            <strong>Solo para mostrar.</strong> Editar esto cambia el horario que ve el
            visitante, pero <strong>no</strong> cambia la disponibilidad real de reservas
            (esa se gestiona aparte). Manténlos en sync.
          </span>
        </div>

        {hours.map((h) => {
          const label = WEEKDAYS.find((w) => w.wd === h.weekday)?.label ?? "";
          return (
            <div
              key={h.weekday}
              className="adm-row"
              style={{ alignItems: "flex-end", gap: 16 }}
            >
              <div className="adm-field" style={{ maxWidth: 150, minWidth: 120 }}>
                <label>{label}</label>
                <label className="adm-check" style={{ marginTop: 4 }}>
                  <input
                    type="checkbox"
                    checked={h.closed}
                    onChange={(e) => setHour(h.weekday, { closed: e.target.checked })}
                  />
                  Cerrado
                </label>
              </div>
              <div className="adm-field" style={{ maxWidth: 180 }}>
                <label htmlFor={`open-${h.weekday}`}>Apertura</label>
                <input
                  id={`open-${h.weekday}`}
                  type="time"
                  className="adm-input"
                  disabled={h.closed}
                  value={minToTime(h.open_min)}
                  onChange={(e) => setHour(h.weekday, { open_min: timeToMin(e.target.value) })}
                />
              </div>
              <div className="adm-field" style={{ maxWidth: 180 }}>
                <label htmlFor={`close-${h.weekday}`}>Cierre</label>
                <input
                  id={`close-${h.weekday}`}
                  type="time"
                  className="adm-input"
                  disabled={h.closed}
                  value={minToTime(h.close_min)}
                  onChange={(e) => setHour(h.weekday, { close_min: timeToMin(e.target.value) })}
                />
              </div>
            </div>
          );
        })}

        <div className="adm-form-actions">
          <button
            type="button"
            className="adm-btn adm-btn-primary adm-btn-lg"
            onClick={saveHours}
            disabled={pending}
          >
            Guardar horario
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
