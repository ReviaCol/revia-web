"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../_components/AdminShell";
import { updateHomeContent, type ActionResult, type HomePatch } from "../actions";

/**
 * HomeBoard — edición del hero + manifiesto del home (CMS Fase 2, ADR 0016).
 * Convención de énfasis: *palabra* se muestra en itálica en el sitio.
 */
export function HomeBoard({
  initial,
  userEmail,
  loadError,
}: {
  initial: HomePatch;
  userEmail: string;
  loadError?: boolean;
}) {
  const router = useRouter();
  const [f, setF] = useState<HomePatch>(initial);
  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [pending, startTransition] = useTransition();

  function set(key: keyof HomePatch, value: string) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    setErrorMsg("");
    setOkMsg("");
    startTransition(async () => {
      const res: ActionResult = await updateHomeContent(f);
      if (!res.ok) {
        setErrorMsg(res.error ?? "Algo salió mal.");
        router.refresh();
        return;
      }
      setOkMsg("Home guardado. El sitio ya está actualizado.");
      router.refresh();
    });
  }

  return (
    <AdminShell
      active="home"
      userEmail={userEmail}
      busy={pending}
      title="Home — hero y manifiesto"
      subtitle="El titular, subtítulo y manifiesto de la portada. Envuelve una palabra en *asteriscos* para mostrarla en itálica."
    >
      {loadError && (
        <div className="adm-alert adm-alert-err">
          No se pudo leer de la base. Revisa que la migración 0009 esté corrida.
        </div>
      )}
      {errorMsg && <div className="adm-alert adm-alert-err">{errorMsg}</div>}
      {okMsg && (
        <div className="adm-note" role="status">
          <span>✓ {okMsg}</span>
        </div>
      )}

      <div className="adm-form" style={{ marginBottom: 32 }}>
        <h2 className="adm-form-title">Hero</h2>
        <div className="adm-field">
          <label htmlFor="h1">Titular — línea 1</label>
          <input id="h1" className="adm-input" value={f.hero_line1} onChange={(e) => set("hero_line1", e.target.value)} />
        </div>
        <div className="adm-field">
          <label htmlFor="h2">Titular — línea 2</label>
          <input id="h2" className="adm-input" value={f.hero_line2} onChange={(e) => set("hero_line2", e.target.value)} />
          <p className="adm-hint">Ej: <code>Espera ser *revelada*.</code> → “revelada” en itálica.</p>
        </div>
        <div className="adm-field">
          <label htmlFor="hs">Subtítulo</label>
          <textarea id="hs" className="adm-input" rows={2} value={f.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} />
        </div>
      </div>

      <div className="adm-form">
        <h2 className="adm-form-title">Manifiesto</h2>
        <div className="adm-field">
          <label htmlFor="me">Etiqueta (eyebrow)</label>
          <input id="me" className="adm-input" value={f.manifesto_eyebrow} onChange={(e) => set("manifesto_eyebrow", e.target.value)} />
        </div>
        <div className="adm-field">
          <label htmlFor="m1">Manifiesto — primera parte</label>
          <input id="m1" className="adm-input" value={f.manifesto_line1} onChange={(e) => set("manifesto_line1", e.target.value)} />
        </div>
        <div className="adm-field">
          <label htmlFor="m2">Manifiesto — segunda parte (destacada)</label>
          <textarea id="m2" className="adm-input" rows={2} value={f.manifesto_line2} onChange={(e) => set("manifesto_line2", e.target.value)} />
          <p className="adm-hint">Ej: <code>para revelarla en tu *mejor expresión*.</code></p>
        </div>
        <div className="adm-form-actions">
          <button type="button" className="adm-btn adm-btn-primary adm-btn-lg" onClick={save} disabled={pending}>
            Guardar home
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
