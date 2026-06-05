"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LEAD_ESTADOS,
  ESTADO_LABEL,
  ESTADO_COLOR,
  servicioLabel,
  type Lead,
  type LeadEstado,
} from "@/lib/leads";

/**
 * LeadsBoard — panel de gestión de leads del CRM interno.
 * Lista filtrable por estado; permite cambiar el estado y editar notas internas.
 * Las escrituras pasan por RLS (rol authenticated) con la sesión del usuario.
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
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState<Filter>("todos");
  const [errorMsg, setErrorMsg] = useState("");

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
    const { error } = await supabase.from("leads").update({ estado }).eq("id", id);
    if (error) {
      setLeads(prev);
      setErrorMsg("No pudimos actualizar el estado. Intenta de nuevo.");
    }
  }

  async function saveNotas(id: string, notas: string) {
    const prev = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, notas } : l)));
    setErrorMsg("");
    const { error } = await supabase.from("leads").update({ notas }).eq("id", id);
    if (error) {
      setLeads(prev);
      setErrorMsg("No pudimos guardar la nota. Intenta de nuevo.");
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main id="contenido" style={{ background: "var(--revia-cream-50)", minHeight: "100vh" }}>
      <header
        className="flex items-center justify-between flex-wrap gap-4"
        style={{ padding: "28px var(--gutter)", borderBottom: "1px solid rgba(89, 65, 60,0.12)" }}
      >
        <div>
          <span
            className="font-display lowercase"
            style={{ fontSize: "22px", letterSpacing: "-0.01em", color: "var(--revia-marron-inst)" }}
          >
            reviá
          </span>
          <span
            className="font-body uppercase ml-3"
            style={{ fontSize: "11px", letterSpacing: "0.2em", color: "var(--revia-coffee-700)" }}
          >
            Leads
          </span>
        </div>
        <div className="flex items-center gap-5">
          <span className="font-body text-coffee-700" style={{ fontSize: "13px" }}>
            {userEmail}
          </span>
          <button
            type="button"
            onClick={logout}
            className="font-body uppercase text-coffee-700 hover:text-coffee-900 transition-colors duration-200"
            style={{ fontSize: "11px", letterSpacing: "0.14em" }}
          >
            Salir
          </button>
        </div>
      </header>

      <div style={{ padding: "32px var(--gutter) 80px" }}>
        {/* Filtros por estado */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["todos", ...LEAD_ESTADOS] as Filter[]).map((f) => {
            const active = filter === f;
            const label = f === "todos" ? "Todos" : ESTADO_LABEL[f];
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className="font-body uppercase transition-colors duration-200"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: `1px solid ${active ? "var(--revia-coffee-900)" : "rgba(89, 65, 60,0.18)"}`,
                  background: active ? "var(--revia-coffee-900)" : "transparent",
                  color: active ? "var(--revia-cream-50)" : "var(--revia-coffee-700)",
                }}
              >
                {label} ({counts[f] ?? 0})
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <p role="alert" className="font-body mb-6" style={{ fontSize: "13px", color: "var(--revia-terracotta-600)" }}>
            {errorMsg}
          </p>
        )}

        {loadError && (
          <p className="font-body mb-6" style={{ fontSize: "13px", color: "var(--revia-terracotta-600)" }}>
            Hubo un problema al cargar los leads. Recarga la página.
          </p>
        )}

        {visible.length === 0 ? (
          <p className="font-body text-coffee-700" style={{ fontSize: "15px" }}>
            {leads.length === 0
              ? "Aún no hay leads. Cuando alguien envíe el formulario de contacto, aparecerá aquí."
              : "No hay leads en este estado."}
          </p>
        ) : (
          <ul className="list-none m-0 p-0 grid gap-5">
            {visible.map((lead) => (
              <li
                key={lead.id}
                style={{
                  background: "var(--revia-cream-100)",
                  border: "1px solid rgba(89, 65, 60,0.12)",
                  borderRadius: "3px",
                  padding: "22px 24px",
                }}
              >
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-display m-0" style={{ fontSize: "20px", lineHeight: 1.2, color: "var(--revia-coffee-900)" }}>
                      {lead.nombre}
                    </p>
                    <p className="font-body m-0 mt-1" style={{ fontSize: "13px", color: "var(--revia-coffee-700)" }}>
                      <a href={`mailto:${lead.email}`} className="text-coffee-700 hover:text-coffee-900">
                        {lead.email}
                      </a>
                      {lead.whatsapp && (
                        <>
                          {" · "}
                          <a href={waLink(lead.whatsapp)} target="_blank" rel="noopener noreferrer" className="text-coffee-700 hover:text-coffee-900">
                            {lead.whatsapp}
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className="font-body uppercase inline-block"
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.12em",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        color: "var(--revia-coffee-900)",
                        background: ESTADO_COLOR[lead.estado],
                      }}
                    >
                      {ESTADO_LABEL[lead.estado]}
                    </span>
                    <p className="font-body m-0 mt-2" style={{ fontSize: "12px", color: "var(--revia-coffee-500)" }}>
                      {dateFmt.format(new Date(lead.created_at))}
                    </p>
                  </div>
                </div>

                <p className="font-body m-0 mt-3" style={{ fontSize: "13px", color: "var(--revia-coffee-700)" }}>
                  Interés: <strong style={{ fontWeight: 600 }}>{servicioLabel(lead.servicio)}</strong>
                </p>

                {lead.mensaje && (
                  <p
                    className="font-body m-0 mt-3"
                    style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--revia-coffee-900)", whiteSpace: "pre-wrap" }}
                  >
                    {lead.mensaje}
                  </p>
                )}

                <div className="flex flex-wrap items-end gap-x-8 gap-y-4 mt-5">
                  <div>
                    <label htmlFor={`estado-${lead.id}`} className="font-body uppercase block mb-1" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "var(--revia-coffee-700)" }}>
                      Estado
                    </label>
                    <select
                      id={`estado-${lead.id}`}
                      value={lead.estado}
                      onChange={(e) => changeEstado(lead.id, e.target.value as LeadEstado)}
                      className="font-body bg-transparent border border-coffee-900/20 text-coffee-900 px-3 py-2 cursor-pointer"
                      style={{ fontSize: "14px", borderRadius: "2px" }}
                    >
                      {LEAD_ESTADOS.map((e) => (
                        <option key={e} value={e}>
                          {ESTADO_LABEL[e]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <NotesEditor
                    id={lead.id}
                    initial={lead.notas ?? ""}
                    onSave={(notas) => saveNotas(lead.id, notas)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
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
    <div className="flex-1" style={{ minWidth: "220px" }}>
      <label htmlFor={`notas-${id}`} className="font-body uppercase block mb-1" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "var(--revia-coffee-700)" }}>
        Notas internas
      </label>
      <textarea
        id={`notas-${id}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={2}
        placeholder="Seguimiento, contexto…"
        className="font-body w-full bg-transparent border border-coffee-900/20 text-coffee-900 px-3 py-2 resize-y placeholder:text-coffee-500"
        style={{ fontSize: "14px", borderRadius: "2px" }}
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={!dirty}
        className="font-body uppercase mt-2 text-coffee-700 hover:text-coffee-900 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ fontSize: "11px", letterSpacing: "0.12em" }}
      >
        {saved ? "Guardado ✓" : "Guardar nota"}
      </button>
    </div>
  );
}
