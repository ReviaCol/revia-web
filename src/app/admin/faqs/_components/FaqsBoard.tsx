"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../_components/AdminShell";
import { SCOPE_META, scopeLabel, type ActionResult, type FaqRow } from "../types";
import {
  createFaq,
  updateFaq,
  deleteFaq,
  setFaqVisible,
  setFaqOrder,
} from "../actions";

/**
 * FaqsBoard — CRUD de FAQs por scope (CMS Fase 2, ADR 0016).
 * Renderiza directo desde props (server) y refresca tras cada mutación.
 */
export function FaqsBoard({
  faqs,
  userEmail,
  loadError,
}: {
  faqs: FaqRow[];
  userEmail: string;
  loadError?: boolean;
}) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Scopes = los presentes en data + los conocidos (para poder sembrar en vacíos).
  const scopes = useMemo(() => {
    const set = new Set<string>(Object.keys(SCOPE_META));
    faqs.forEach((f) => set.add(f.scope));
    return [...set].sort();
  }, [faqs]);

  function run(action: () => Promise<ActionResult>, onOk?: () => void) {
    setErrorMsg("");
    startTransition(async () => {
      const res = await action();
      if (!res.ok) {
        setErrorMsg(res.error ?? "Algo salió mal.");
        return;
      }
      onOk?.();
      router.refresh();
    });
  }

  function move(list: FaqRow[], id: string, dir: -1 | 1) {
    const idx = list.findIndex((f) => f.id === id);
    const to = idx + dir;
    if (to < 0 || to >= list.length) return;
    const ids = list.map((f) => f.id);
    [ids[idx], ids[to]] = [ids[to], ids[idx]];
    run(() => setFaqOrder(ids));
  }

  return (
    <AdminShell
      active="faqs"
      userEmail={userEmail}
      busy={pending}
      title="Preguntas frecuentes"
      subtitle="Edita las FAQs por sección. Los cambios se publican al instante en las páginas que ya leen de la base."
    >
      {loadError && (
        <div className="adm-alert adm-alert-err">
          No se pudo leer de la base. Revisa que la migración 0010 esté corrida.
        </div>
      )}
      {errorMsg && <div className="adm-alert adm-alert-err">{errorMsg}</div>}

      {scopes.map((scope) => {
        const items = faqs
          .filter((f) => f.scope === scope)
          .sort((a, b) => a.sort_order - b.sort_order);
        const meta = SCOPE_META[scope];
        return (
          <div className="adm-cat" key={scope}>
            <div className="adm-cat-head">
              <div className="adm-cat-titlewrap">
                <h2 className="adm-cat-name">{scopeLabel(scope)}</h2>
                <span
                  className="adm-tag"
                  style={{
                    color: meta?.live === false ? "var(--revia-terracotta-600)" : undefined,
                    borderColor: meta?.live === false ? "rgba(178,74,58,0.4)" : undefined,
                  }}
                >
                  {meta?.live === false ? "Pendiente de cablear" : "En vivo"}
                </span>
              </div>
            </div>
            {meta?.note && <p className="adm-cat-metaline">{meta.note}</p>}

            <div className="adm-tr-list">
              {items.length === 0 && <p className="adm-empty">Sin preguntas todavía.</p>}
              {items.map((f, i) => (
                <FaqItem
                  key={f.id}
                  faq={f}
                  first={i === 0}
                  last={i === items.length - 1}
                  editing={editingId === f.id}
                  pending={pending}
                  onEdit={() => setEditingId(f.id)}
                  onCancel={() => setEditingId(null)}
                  onSave={(q, a) =>
                    run(() => updateFaq(f.id, { question: q, answer: a }), () => setEditingId(null))
                  }
                  onToggle={() => run(() => setFaqVisible(f.id, !f.visible))}
                  onDelete={() => run(() => deleteFaq(f.id))}
                  onUp={() => move(items, f.id, -1)}
                  onDown={() => move(items, f.id, 1)}
                />
              ))}
            </div>

            <AddFaq scope={scope} pending={pending} onAdd={(q, a) => run(() => createFaq({ scope, question: q, answer: a }))} />
          </div>
        );
      })}
    </AdminShell>
  );
}

function FaqItem({
  faq,
  first,
  last,
  editing,
  pending,
  onEdit,
  onCancel,
  onSave,
  onToggle,
  onDelete,
  onUp,
  onDown,
}: {
  faq: FaqRow;
  first: boolean;
  last: boolean;
  editing: boolean;
  pending: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (q: string, a: string) => void;
  onToggle: () => void;
  onDelete: () => void;
  onUp: () => void;
  onDown: () => void;
}) {
  const [q, setQ] = useState(faq.question);
  const [a, setA] = useState(faq.answer);

  if (editing) {
    return (
      <div className="adm-tr">
        <div className="adm-form" style={{ width: "100%" }}>
          <div className="adm-field">
            <label>Pregunta</label>
            <input className="adm-input" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Respuesta</label>
            <textarea className="adm-input" rows={3} value={a} onChange={(e) => setA(e.target.value)} />
          </div>
          <div className="adm-form-actions">
            <button className="adm-btn adm-btn-primary" disabled={pending} onClick={() => onSave(q, a)}>
              Guardar
            </button>
            <button className="adm-btn adm-btn-ghost" disabled={pending} onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`adm-tr${faq.visible ? "" : " is-hidden"}`}>
      <div className="adm-tr-body">
        <p className="adm-tr-name">
          {faq.question}
          {!faq.visible && <span className="adm-tag">Oculta</span>}
        </p>
        <p className="adm-tr-sum">{faq.answer}</p>
      </div>
      <div className="adm-actions">
        <button className="adm-btn adm-btn-ghost adm-ico" disabled={pending || first} onClick={onUp} aria-label="Subir">↑</button>
        <button className="adm-btn adm-btn-ghost adm-ico" disabled={pending || last} onClick={onDown} aria-label="Bajar">↓</button>
        <button className="adm-btn adm-btn-outline" disabled={pending} onClick={onEdit}>Editar</button>
        <button
          className={`adm-toggle ${faq.visible ? "adm-toggle-on" : "adm-toggle-off"}`}
          disabled={pending}
          onClick={onToggle}
        >
          <span className="dot" />
          {faq.visible ? "Visible" : "Oculta"}
        </button>
        <button className="adm-btn adm-btn-danger" disabled={pending} onClick={onDelete}>Eliminar</button>
      </div>
    </div>
  );
}

function AddFaq({
  scope,
  pending,
  onAdd,
}: {
  scope: string;
  pending: boolean;
  onAdd: (q: string, a: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  if (!open) {
    return (
      <button className="adm-add" onClick={() => setOpen(true)}>
        <span className="plus">+</span> Añadir pregunta a “{scopeLabel(scope)}”
      </button>
    );
  }

  return (
    <div className="adm-form" style={{ marginTop: 24 }}>
      <div className="adm-field">
        <label>Pregunta</label>
        <input className="adm-input" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="adm-field">
        <label>Respuesta</label>
        <textarea className="adm-input" rows={3} value={a} onChange={(e) => setA(e.target.value)} />
      </div>
      <div className="adm-form-actions">
        <button
          className="adm-btn adm-btn-primary"
          disabled={pending}
          onClick={() => {
            onAdd(q, a);
            setQ("");
            setA("");
            setOpen(false);
          }}
        >
          Añadir
        </button>
        <button className="adm-btn adm-btn-ghost" disabled={pending} onClick={() => setOpen(false)}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
