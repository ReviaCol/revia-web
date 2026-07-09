"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../_components/AdminShell";
import { parseCredentials, type ActionResult, type MemberRow, type SpecialtyRow } from "../types";
import {
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
  setSpecialtyVisible,
  setSpecialtyOrder,
  createMember,
  updateMember,
  deleteMember,
  setMemberVisible,
} from "../actions";

/**
 * EquipoBoard — dos bloques (CMS Fase 2, ADR 0016):
 *  1. Especialidades — VISIBLE en /nosotros#equipo.
 *  2. Médicos — CMS oculto (se renderiza en Fase 3, cuando haya nombres/fotos reales).
 * Renderiza desde props (server) y refresca tras cada mutación.
 */
export function EquipoBoard({
  specialties,
  members,
  userEmail,
  loadError,
}: {
  specialties: SpecialtyRow[];
  members: MemberRow[];
  userEmail: string;
  loadError?: boolean;
}) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [pending, startTransition] = useTransition();

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

  const specs = [...specialties].sort((a, b) => a.sort_order - b.sort_order);
  const mems = [...members].sort((a, b) => a.sort_order - b.sort_order);

  function moveSpec(id: string, dir: -1 | 1) {
    const idx = specs.findIndex((s) => s.id === id);
    const to = idx + dir;
    if (to < 0 || to >= specs.length) return;
    const ids = specs.map((s) => s.id);
    [ids[idx], ids[to]] = [ids[to], ids[idx]];
    run(() => setSpecialtyOrder(ids));
  }

  return (
    <AdminShell
      active="equipo"
      userEmail={userEmail}
      busy={pending}
      title="Equipo"
      subtitle="Especialidades (visibles en Nosotros) y fichas de médicos (aún ocultas en el sitio)."
    >
      {loadError && (
        <div className="adm-alert adm-alert-err">
          No se pudo leer de la base. Revisa que la migración 0011 esté corrida.
        </div>
      )}
      {errorMsg && <div className="adm-alert adm-alert-err">{errorMsg}</div>}

      {/* ── Especialidades ─────────────────────────────────────────────── */}
      <div className="adm-cat">
        <div className="adm-cat-head">
          <div className="adm-cat-titlewrap">
            <h2 className="adm-cat-name">Especialidades</h2>
            <span className="adm-tag">En vivo · /nosotros#equipo</span>
          </div>
        </div>
        <p className="adm-cat-metaline">Lista de especialidades del equipo. Sin nombres propios.</p>

        <div className="adm-tr-list">
          {specs.length === 0 && <p className="adm-empty">Sin especialidades todavía.</p>}
          {specs.map((s, i) => (
            <SpecialtyItem
              key={s.id}
              spec={s}
              first={i === 0}
              last={i === specs.length - 1}
              pending={pending}
              onSave={(name) => run(() => updateSpecialty(s.id, name))}
              onToggle={() => run(() => setSpecialtyVisible(s.id, !s.visible))}
              onDelete={() => run(() => deleteSpecialty(s.id))}
              onUp={() => moveSpec(s.id, -1)}
              onDown={() => moveSpec(s.id, 1)}
            />
          ))}
        </div>

        <AddSpecialty pending={pending} onAdd={(name) => run(() => createSpecialty(name))} />
      </div>

      {/* ── Médicos ────────────────────────────────────────────────────── */}
      <div className="adm-cat">
        <div className="adm-cat-head">
          <div className="adm-cat-titlewrap">
            <h2 className="adm-cat-name">Médicos</h2>
            <span className="adm-tag" style={{ color: "var(--revia-coffee-500)" }}>Oculto (Fase 3)</span>
          </div>
        </div>
        <div className="adm-note" style={{ marginTop: 14 }}>
          <span>
            <strong>Aún no se muestran en el sitio.</strong> Se activan cuando haya nombres y
            fotos reales. La foto se pega como URL por ahora (Supabase Storage llega en Fase 3).
            No inventes nombres/credenciales ni menciones cirugía.
          </span>
        </div>

        <div className="adm-tr-list">
          {mems.length === 0 && <p className="adm-empty">Sin médicos todavía.</p>}
          {mems.map((m) => (
            <MemberItem
              key={m.id}
              member={m}
              pending={pending}
              onSave={(patch) => run(() => updateMember(m.id, patch))}
              onToggle={() => run(() => setMemberVisible(m.id, !m.visible))}
              onDelete={() => run(() => deleteMember(m.id))}
            />
          ))}
        </div>

        <AddMember pending={pending} onAdd={(patch) => run(() => createMember(patch))} />
      </div>
    </AdminShell>
  );
}

function SpecialtyItem({
  spec,
  first,
  last,
  pending,
  onSave,
  onToggle,
  onDelete,
  onUp,
  onDown,
}: {
  spec: SpecialtyRow;
  first: boolean;
  last: boolean;
  pending: boolean;
  onSave: (name: string) => void;
  onToggle: () => void;
  onDelete: () => void;
  onUp: () => void;
  onDown: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(spec.name);

  return (
    <div className={`adm-tr${spec.visible ? "" : " is-hidden"}`}>
      <div className="adm-tr-body">
        {editing ? (
          <input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} />
        ) : (
          <p className="adm-tr-name">
            {spec.name}
            {!spec.visible && <span className="adm-tag">Oculta</span>}
          </p>
        )}
      </div>
      <div className="adm-actions">
        {editing ? (
          <>
            <button className="adm-btn adm-btn-primary" disabled={pending} onClick={() => { onSave(name); setEditing(false); }}>Guardar</button>
            <button className="adm-btn adm-btn-ghost" disabled={pending} onClick={() => { setName(spec.name); setEditing(false); }}>Cancelar</button>
          </>
        ) : (
          <>
            <button className="adm-btn adm-btn-ghost adm-ico" disabled={pending || first} onClick={onUp} aria-label="Subir">↑</button>
            <button className="adm-btn adm-btn-ghost adm-ico" disabled={pending || last} onClick={onDown} aria-label="Bajar">↓</button>
            <button className="adm-btn adm-btn-outline" disabled={pending} onClick={() => setEditing(true)}>Editar</button>
            <button className={`adm-toggle ${spec.visible ? "adm-toggle-on" : "adm-toggle-off"}`} disabled={pending} onClick={onToggle}>
              <span className="dot" />{spec.visible ? "Visible" : "Oculta"}
            </button>
            <button className="adm-btn adm-btn-danger" disabled={pending} onClick={onDelete}>Eliminar</button>
          </>
        )}
      </div>
    </div>
  );
}

type MemberPatch = { name: string; specialty: string; credentials: string[]; quote: string; photoUrl: string };

function MemberFields({
  init,
  onChange,
}: {
  init: MemberRow | null;
  onChange: (p: MemberPatch) => void;
}) {
  const [name, setName] = useState(init?.name ?? "");
  const [specialty, setSpecialty] = useState(init?.specialty ?? "");
  const [creds, setCreds] = useState((init?.credentials ?? []).join(", "));
  const [quote, setQuote] = useState(init?.quote ?? "");
  const [photo, setPhoto] = useState(init?.photo_url ?? "");

  function emit(next: Partial<{ name: string; specialty: string; creds: string; quote: string; photo: string }>) {
    const v = { name, specialty, creds, quote, photo, ...next };
    onChange({
      name: v.name,
      specialty: v.specialty,
      credentials: parseCredentials(v.creds),
      quote: v.quote,
      photoUrl: v.photo,
    });
  }

  return (
    <div className="adm-form" style={{ width: "100%" }}>
      <div className="adm-row">
        <div className="adm-field">
          <label>Nombre</label>
          <input className="adm-input" value={name} onChange={(e) => { setName(e.target.value); emit({ name: e.target.value }); }} />
        </div>
        <div className="adm-field">
          <label>Especialidad</label>
          <input className="adm-input" value={specialty} onChange={(e) => { setSpecialty(e.target.value); emit({ specialty: e.target.value }); }} />
        </div>
      </div>
      <div className="adm-field">
        <label>Credenciales (separadas por coma)</label>
        <input className="adm-input" value={creds} onChange={(e) => { setCreds(e.target.value); emit({ creds: e.target.value }); }} />
      </div>
      <div className="adm-field">
        <label>Cita</label>
        <textarea className="adm-input" rows={2} value={quote} onChange={(e) => { setQuote(e.target.value); emit({ quote: e.target.value }); }} />
      </div>
      <div className="adm-field">
        <label>Foto (URL, opcional)</label>
        <input className="adm-input" value={photo} onChange={(e) => { setPhoto(e.target.value); emit({ photo: e.target.value }); }} />
      </div>
    </div>
  );
}

function MemberItem({
  member,
  pending,
  onSave,
  onToggle,
  onDelete,
}: {
  member: MemberRow;
  pending: boolean;
  onSave: (patch: MemberPatch) => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [patch, setPatch] = useState<MemberPatch>({
    name: member.name,
    specialty: member.specialty,
    credentials: member.credentials,
    quote: member.quote ?? "",
    photoUrl: member.photo_url ?? "",
  });

  if (editing) {
    return (
      <div className="adm-tr">
        <MemberFields init={member} onChange={setPatch} />
        <div className="adm-form-actions" style={{ width: "100%" }}>
          <button className="adm-btn adm-btn-primary" disabled={pending} onClick={() => { onSave(patch); setEditing(false); }}>Guardar</button>
          <button className="adm-btn adm-btn-ghost" disabled={pending} onClick={() => setEditing(false)}>Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`adm-tr${member.visible ? "" : " is-hidden"}`}>
      <div className="adm-tr-body">
        <p className="adm-tr-name">
          {member.name}
          {!member.visible && <span className="adm-tag">Oculta</span>}
        </p>
        <p className="adm-tr-sum">{member.specialty}</p>
        {member.credentials.length > 0 && <p className="adm-tr-zones">{member.credentials.join(" · ")}</p>}
        {member.quote && <p className="adm-tr-sum" style={{ fontStyle: "italic" }}>&ldquo;{member.quote}&rdquo;</p>}
      </div>
      <div className="adm-actions">
        <button className="adm-btn adm-btn-outline" disabled={pending} onClick={() => setEditing(true)}>Editar</button>
        <button className={`adm-toggle ${member.visible ? "adm-toggle-on" : "adm-toggle-off"}`} disabled={pending} onClick={onToggle}>
          <span className="dot" />{member.visible ? "Visible" : "Oculta"}
        </button>
        <button className="adm-btn adm-btn-danger" disabled={pending} onClick={onDelete}>Eliminar</button>
      </div>
    </div>
  );
}

function AddSpecialty({ pending, onAdd }: { pending: boolean; onAdd: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  if (!open) {
    return (
      <button className="adm-add" onClick={() => setOpen(true)}>
        <span className="plus">+</span> Añadir especialidad
      </button>
    );
  }
  return (
    <div className="adm-form" style={{ marginTop: 24 }}>
      <div className="adm-field">
        <label>Especialidad</label>
        <input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="adm-form-actions">
        <button className="adm-btn adm-btn-primary" disabled={pending} onClick={() => { onAdd(name); setName(""); setOpen(false); }}>Añadir</button>
        <button className="adm-btn adm-btn-ghost" disabled={pending} onClick={() => setOpen(false)}>Cancelar</button>
      </div>
    </div>
  );
}

function AddMember({ pending, onAdd }: { pending: boolean; onAdd: (patch: MemberPatch) => void }) {
  const [open, setOpen] = useState(false);
  const [patch, setPatch] = useState<MemberPatch>({ name: "", specialty: "", credentials: [], quote: "", photoUrl: "" });
  if (!open) {
    return (
      <button className="adm-add" onClick={() => setOpen(true)}>
        <span className="plus">+</span> Añadir médico
      </button>
    );
  }
  return (
    <div style={{ marginTop: 24 }}>
      <MemberFields init={null} onChange={setPatch} />
      <div className="adm-form-actions" style={{ marginTop: 16 }}>
        <button className="adm-btn adm-btn-primary" disabled={pending} onClick={() => { onAdd(patch); setOpen(false); }}>Añadir</button>
        <button className="adm-btn adm-btn-ghost" disabled={pending} onClick={() => setOpen(false)}>Cancelar</button>
      </div>
    </div>
  );
}
