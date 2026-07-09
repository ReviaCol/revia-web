"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminShell } from "./AdminShell";
import {
  LEAD_ESTADOS,
  ESTADO_LABEL,
  ESTADO_COLOR,
  servicioLabel,
  type Lead,
  type LeadEstado,
} from "@/lib/leads";

/**
 * LeadsBoard — gestión de leads del CRM interno. Rediseño 2026-07-09: usa
 * AdminShell (chrome + estilos compartidos con el catálogo). Lista filtrable por
 * estado; permite cambiar el estado y editar notas internas. Las escrituras pasan
 * por RLS (rol authenticated) con la sesión del usuario.
 */

type Filter = LeadEstado | "todos";

const dateFmt = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
});

function waLink(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function LeadsBoard({
  initialLeads,
  userEmail,
  loadError,
}: {
  initialLeads: Lead[];
  userEmail: string;
  loadError?: boolean;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState<Filter>("todos");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: leads.length };
    for (const e of LEAD_ESTADOS) c[e] = 0;
    for (const l of leads) c[l.estado] = (c[l.estado] ?? 0) + 1;
    return c;
  }, [leads]);

  const visible = useMemo(
    () => (filter === "todos" ? leads : leads.filter((l) => l.estado === filter)),
    [leads, filter],
  );

  async function changeEstado(id: string, estado: LeadEstado) {
    const prev = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, estado } : l)));
    setErrorMsg("");
    setSaving(true);
    const { error } = await supabase.from("leads").update({ estado }).eq("id", id);
    setSaving(false);
    if (error) {
      setLeads(prev);
      setErrorMsg("No pudimos actualizar el estado. Intenta de nuevo.");
    }
  }

  async function saveNotas(id: string, notas: string) {
    const prev = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, notas } : l)));
    setErrorMsg("");
    setSaving(true);
    const { error } = await supabase.from("leads").update({ notas }).eq("id", id);
    setSaving(false);
    if (error) {
      setLeads(prev);
      setErrorMsg("No pudimos guardar la nota. Intenta de nuevo.");
    }
  }

  return (
    <AdminShell
      active="leads"
      userEmail={userEmail}
      busy={saving}
      title="Leads"
      subtitle="Solicitudes de contacto del sitio. Cambia el estado del pipeline y agrega notas internas."
    >
      <div className="adm-filters">
        {(["todos", ...LEAD_ESTADOS] as Filter[]).map((f) => {
          const active = filter === f;
          const label = f === "todos" ? "Todos" : ESTADO_LABEL[f];
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={`adm-filter${active ? " is-active" : ""}`}
            >
              {label} ({counts[f] ?? 0})
            </button>
          );
        })}
      </div>

      {errorMsg && <div className="adm-alert adm-alert-err" role="alert">{errorMsg}</div>}
      {loadError && (
        <div className="adm-alert adm-alert-err">
          Hubo un problema al cargar los leads. Recarga la página.
        </div>
      )}

      {visible.length === 0 ? (
        <p className="adm-empty">
          {leads.length === 0
            ? "Aún no hay leads. Cuando alguien envíe el formulario de contacto, aparecerá aquí."
            : "No hay leads en este estado."}
        </p>
      ) : (
        <div>
          {visible.map((lead) => (
            <section className="adm-cat" key={lead.id}>
              <div className="adm-lead-top">
                <div>
                  <h2 className="adm-lead-name">{lead.nombre}</h2>
                  <p className="adm-lead-contact">
                    <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    {lead.whatsapp && (
                      <>
                        {" · "}
                        <a href={waLink(lead.whatsapp)} target="_blank" rel="noopener noreferrer">
                          {lead.whatsapp}
                        </a>
                      </>
                    )}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="adm-estado" style={{ background: ESTADO_COLOR[lead.estado] }}>
                    {ESTADO_LABEL[lead.estado]}
                  </span>
                  <p className="adm-lead-date">{dateFmt.format(new Date(lead.created_at))}</p>
                </div>
              </div>

              <p className="adm-lead-interes">
                Interés: <strong style={{ fontWeight: 600, color: "var(--revia-coffee-900)" }}>{servicioLabel(lead.servicio)}</strong>
              </p>

              {lead.mensaje && <p className="adm-lead-msg">{lead.mensaje}</p>}

              <div className="adm-lead-controls">
                <div className="adm-field" style={{ minWidth: "180px" }}>
                  <label htmlFor={`estado-${lead.id}`}>Estado</label>
                  <select
                    id={`estado-${lead.id}`}
                    className="adm-input"
                    value={lead.estado}
                    onChange={(e) => changeEstado(lead.id, e.target.value as LeadEstado)}
                    style={{ width: "auto" }}
                  >
                    {LEAD_ESTADOS.map((e) => (
                      <option key={e} value={e}>{ESTADO_LABEL[e]}</option>
                    ))}
                  </select>
                </div>

                <NotesEditor
                  id={lead.id}
                  initial={lead.notas ?? ""}
                  onSave={(notas) => saveNotas(lead.id, notas)}
                />
              </div>
            </section>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

/** Editor de notas internas por lead, con estado local + guardado explícito. */
function NotesEditor({
  id,
  initial,
  onSave,
}: {
  id: string;
  initial: string;
  onSave: (notas: string) => Promise<void> | void;
}) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(false);
  const dirty = value !== initial;

  async function handleSave() {
    await onSave(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="adm-field" style={{ flex: 1, minWidth: "240px" }}>
      <label htmlFor={`notas-${id}`}>Notas internas</label>
      <textarea
        id={`notas-${id}`}
        className="adm-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={2}
        placeholder="Seguimiento, contexto…"
      />
      <div style={{ marginTop: "10px" }}>
        <button
          type="button"
          className="adm-btn adm-btn-outline"
          onClick={handleSave}
          disabled={!dirty}
        >
          {saved ? "Guardado ✓" : "Guardar nota"}
        </button>
      </div>
    </div>
  );
}
