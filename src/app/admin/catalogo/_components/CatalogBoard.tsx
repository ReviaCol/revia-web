"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../_components/AdminShell";
import {
  PALETTES,
  parseBodyZones,
  type CategoryRow,
  type TreatmentRow,
  type Palette,
  type ActionResult,
  type ProtocolStep,
  type Technology,
  type FaqRow,
  type QAInput,
} from "../types";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  setCategoryOrder,
  createTreatment,
  updateTreatment,
  deleteTreatment,
  setTreatmentVisible,
  setTreatmentOrder,
  saveTreatmentFaqs,
} from "../actions";

/**
 * CatalogBoard — CRUD del catálogo de tratamientos y categorías.
 * Fase 1 (ADR 0014): categorías + tratamientos. Fase 4 (ADR 0018): contenido
 * rico por tratamiento (protocolo, para quién, tecnología) + FAQ por tratamiento
 * (tabla faqs, scope = treatment id). Workflow: edit-is-live + toggle `visible`.
 * Guardar dispara updateTag("catalog") y, para la FAQ, updateTag("site-content").
 */

type TreatmentInput = {
  categoryId: string;
  name: string;
  summary: string;
  outcome?: string;
  bodyZones: string[];
  visible: boolean;
  protocol?: ProtocolStep[] | null;
  candidate?: string[] | null;
  technology?: Technology | null;
};

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function CatalogBoard({
  initialCategories,
  initialTreatments,
  initialFaqs,
  userEmail,
  loadError,
}: {
  initialCategories: CategoryRow[];
  initialTreatments: TreatmentRow[];
  initialFaqs: FaqRow[];
  userEmail: string;
  loadError?: boolean;
}) {
  const router = useRouter();
  const [cats, setCats] = useState<CategoryRow[]>(initialCategories);
  const [treatments, setTreatments] = useState<TreatmentRow[]>(initialTreatments);
  const [faqs, setFaqs] = useState<FaqRow[]>(initialFaqs);
  const [errorMsg, setErrorMsg] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [pending, startTransition] = useTransition();

  const sortedCats = useMemo(
    () => [...cats].sort((a, b) => a.sort_order - b.sort_order),
    [cats],
  );

  function faqsOf(scope: string): QAInput[] {
    return faqs
      .filter((f) => f.scope === scope)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((f) => ({ question: f.question, answer: f.answer }));
  }
  function setScopeFaqs(scope: string, items: QAInput[]) {
    setFaqs((prev) => [
      ...prev.filter((f) => f.scope !== scope),
      ...items.map((it, i) => ({
        id: `local-${scope}-${i}`,
        scope,
        question: it.question,
        answer: it.answer,
        sort_order: i,
        visible: true,
      })),
    ]);
  }

  function run(action: () => Promise<ActionResult>, onOk?: () => void) {
    setErrorMsg("");
    startTransition(async () => {
      const res = await action();
      if (!res.ok) {
        setErrorMsg(res.error ?? "Algo salió mal. Intenta de nuevo.");
        router.refresh();
        return;
      }
      onOk?.();
    });
  }

  function handleCreateCategory(input: { name: string; palette: Palette; headline?: string }) {
    run(
      () => createCategory(input),
      () => {
        setCreatingCategory(false);
        router.refresh();
      },
    );
  }
  function handleUpdateCategory(id: string, patch: { name: string; palette: Palette; headline?: string }) {
    setCats((cs) =>
      cs.map((c) => (c.id === id ? { ...c, name: patch.name, palette: patch.palette, headline: patch.headline || null } : c)),
    );
    run(() => updateCategory(id, patch));
  }
  function handleDeleteCategory(id: string) {
    setCats((cs) => cs.filter((c) => c.id !== id));
    setTreatments((ts) => ts.filter((t) => t.category_id !== id));
    run(() => deleteCategory(id));
  }
  function handleMoveCategory(index: number, dir: -1 | 1) {
    const reordered = move(sortedCats, index, index + dir);
    if (reordered === sortedCats) return;
    setCats(reordered.map((c, i) => ({ ...c, sort_order: i })));
    run(() => setCategoryOrder(reordered.map((c) => c.id)));
  }

  function treatmentsOf(catId: string) {
    return treatments.filter((t) => t.category_id === catId).sort((a, b) => a.sort_order - b.sort_order);
  }
  function handleCreateTreatment(input: TreatmentInput, faqItems: QAInput[], done: () => void) {
    run(
      async () => {
        const res = await createTreatment(input);
        if (!res.ok) return res;
        if (res.id && faqItems.length) {
          const f = await saveTreatmentFaqs(res.id, faqItems);
          if (!f.ok) return f;
        }
        return res;
      },
      () => {
        done();
        router.refresh();
      },
    );
  }
  function handleUpdateTreatment(id: string, patch: TreatmentInput, faqItems: QAInput[], done: () => void) {
    setTreatments((ts) =>
      ts.map((t) =>
        t.id === id
          ? {
              ...t,
              category_id: patch.categoryId,
              name: patch.name,
              summary: patch.summary,
              outcome: patch.outcome || null,
              body_zones: patch.bodyZones,
              visible: patch.visible,
              protocol: patch.protocol ?? null,
              candidate: patch.candidate ?? null,
              technology: patch.technology ?? null,
            }
          : t,
      ),
    );
    setScopeFaqs(id, faqItems);
    run(async () => {
      const res = await updateTreatment(id, patch);
      if (!res.ok) return res;
      return saveTreatmentFaqs(id, faqItems);
    }, done);
  }
  function handleToggleVisible(id: string, visible: boolean) {
    setTreatments((ts) => ts.map((t) => (t.id === id ? { ...t, visible } : t)));
    run(() => setTreatmentVisible(id, visible));
  }
  function handleDeleteTreatment(id: string) {
    setTreatments((ts) => ts.filter((t) => t.id !== id));
    run(() => deleteTreatment(id));
  }
  function handleMoveTreatment(catId: string, index: number, dir: -1 | 1) {
    const list = treatmentsOf(catId);
    const reordered = move(list, index, index + dir);
    if (reordered === list) return;
    const orderById = new Map(reordered.map((t, i) => [t.id, i]));
    setTreatments((ts) =>
      ts.map((t) => (orderById.has(t.id) ? { ...t, sort_order: orderById.get(t.id)! } : t)),
    );
    run(() => setTreatmentOrder(reordered.map((t) => t.id)));
  }

  return (
    <AdminShell
      active="catalogo"
      userEmail={userEmail}
      busy={pending}
      title="Catálogo de tratamientos"
      subtitle="Crea, edita, reordena y muestra u oculta tratamientos y categorías. Los cambios se publican en el sitio al instante."
      action={
        creatingCategory ? undefined : (
          <button
            type="button"
            className="adm-btn adm-btn-primary adm-btn-lg"
            onClick={() => setCreatingCategory(true)}
          >
            <span style={{ fontSize: "17px", lineHeight: 1 }}>＋</span> Nueva categoría
          </button>
        )
      }
    >
      <div className="adm-note">
        <span aria-hidden="true">✳</span>
        <span>
          Regla de marca: todo es <strong>no invasivo</strong>. Evita mencionar
          cirugía, quirúrgico o post-operatorio en cualquier texto.
        </span>
      </div>

      {errorMsg && <div className="adm-alert adm-alert-err" role="alert">{errorMsg}</div>}
      {loadError && (
        <div className="adm-alert adm-alert-err">
          Hubo un problema al cargar el catálogo. Recarga la página.
        </div>
      )}

      {creatingCategory && (
        <div className="adm-cat">
          <p className="adm-form-title" style={{ marginBottom: "16px" }}>Nueva categoría</p>
          <CategoryForm
            disabled={pending}
            onSubmit={handleCreateCategory}
            onCancel={() => setCreatingCategory(false)}
          />
        </div>
      )}

      {sortedCats.map((cat, i) => (
        <CategorySection
          key={cat.id}
          cat={cat}
          index={i}
          total={sortedCats.length}
          cats={sortedCats}
          faqsOf={faqsOf}
          treatments={treatmentsOf(cat.id)}
          disabled={pending}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onMoveCategory={handleMoveCategory}
          onCreateTreatment={handleCreateTreatment}
          onUpdateTreatment={handleUpdateTreatment}
          onToggleVisible={handleToggleVisible}
          onDeleteTreatment={handleDeleteTreatment}
          onMoveTreatment={handleMoveTreatment}
        />
      ))}

      {!creatingCategory && (
        <button type="button" className="adm-add" onClick={() => setCreatingCategory(true)}>
          <span className="plus">＋</span> Nueva categoría
        </button>
      )}
    </AdminShell>
  );
}

/* ── sección de categoría ─────────────────────────────────────────────── */
function CategorySection({
  cat,
  index,
  total,
  cats,
  treatments,
  faqsOf,
  disabled,
  onUpdateCategory,
  onDeleteCategory,
  onMoveCategory,
  onCreateTreatment,
  onUpdateTreatment,
  onToggleVisible,
  onDeleteTreatment,
  onMoveTreatment,
}: {
  cat: CategoryRow;
  index: number;
  total: number;
  cats: CategoryRow[];
  treatments: TreatmentRow[];
  faqsOf: (scope: string) => QAInput[];
  disabled: boolean;
  onUpdateCategory: (id: string, patch: { name: string; palette: Palette; headline?: string }) => void;
  onDeleteCategory: (id: string) => void;
  onMoveCategory: (index: number, dir: -1 | 1) => void;
  onCreateTreatment: (input: TreatmentInput, faqs: QAInput[], done: () => void) => void;
  onUpdateTreatment: (id: string, patch: TreatmentInput, faqs: QAInput[], done: () => void) => void;
  onToggleVisible: (id: string, visible: boolean) => void;
  onDeleteTreatment: (id: string) => void;
  onMoveTreatment: (catId: string, index: number, dir: -1 | 1) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);

  return (
    <section className="adm-cat">
      {editing ? (
        <>
          <p className="adm-form-title" style={{ marginBottom: "16px" }}>Editar categoría</p>
          <CategoryForm
            initial={cat}
            disabled={disabled}
            onSubmit={(patch) => {
              onUpdateCategory(cat.id, patch);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </>
      ) : (
        <div className="adm-cat-head">
          <div>
            <div className="adm-cat-titlewrap">
              <h2 className="adm-cat-name">{cat.name}</h2>
              <span
                className="adm-pill"
                style={{ background: cat.palette === "warm" ? "var(--revia-amber-300)" : "var(--revia-sky-500)" }}
              >
                {cat.palette}
              </span>
            </div>
            {cat.headline && <p className="adm-cat-headline">“{cat.headline}”</p>}
            <p className="adm-cat-metaline">
              {cat.id} · {treatments.length} {treatments.length === 1 ? "tratamiento" : "tratamientos"}
            </p>
          </div>
          <div className="adm-actions">
            <button className="adm-btn adm-btn-primary" disabled={disabled} onClick={() => setCreating(true)}>
              <span aria-hidden="true" style={{ fontSize: "15px", lineHeight: 1 }}>＋</span> Tratamiento
            </button>
            <button className="adm-btn adm-btn-outline adm-ico" disabled={disabled || index === 0} onClick={() => onMoveCategory(index, -1)} aria-label="Subir categoría" title="Subir">↑</button>
            <button className="adm-btn adm-btn-outline adm-ico" disabled={disabled || index === total - 1} onClick={() => onMoveCategory(index, 1)} aria-label="Bajar categoría" title="Bajar">↓</button>
            <button className="adm-btn adm-btn-outline" disabled={disabled} onClick={() => setEditing(true)}>Editar</button>
            <ConfirmDelete disabled={disabled} label="Eliminar" warning="Se eliminan también sus tratamientos." onConfirm={() => onDeleteCategory(cat.id)} />
          </div>
        </div>
      )}

      {!editing && (
        <>
          {creating && (
            <div className="adm-form" style={{ marginTop: "20px" }}>
              <p className="adm-form-title">Nuevo tratamiento · {cat.name}</p>
              <TreatmentFields
                cats={cats}
                defaultCategoryId={cat.id}
                initialFaqs={[]}
                disabled={disabled}
                onSubmit={(input, faqs, done) => onCreateTreatment(input, faqs, () => { done(); setCreating(false); })}
                onCancel={() => setCreating(false)}
                submitLabel="Crear tratamiento"
              />
            </div>
          )}

          {treatments.length > 0 && (
            <div className="adm-tr-list">
              {treatments.map((t, i) => (
                <TreatmentItem
                  key={t.id}
                  treatment={t}
                  index={i}
                  total={treatments.length}
                  cats={cats}
                  initialFaqs={faqsOf(t.id)}
                  disabled={disabled}
                  onUpdate={onUpdateTreatment}
                  onToggleVisible={onToggleVisible}
                  onDelete={onDeleteTreatment}
                  onMove={(dir) => onMoveTreatment(cat.id, i, dir)}
                />
              ))}
            </div>
          )}

          {!creating && (
            <button type="button" className="adm-add" disabled={disabled} onClick={() => setCreating(true)}>
              <span className="plus">＋</span> Nuevo tratamiento en {cat.name}
            </button>
          )}
        </>
      )}
    </section>
  );
}

/* ── item de tratamiento ──────────────────────────────────────────────── */
function TreatmentItem({
  treatment,
  index,
  total,
  cats,
  initialFaqs,
  disabled,
  onUpdate,
  onToggleVisible,
  onDelete,
  onMove,
}: {
  treatment: TreatmentRow;
  index: number;
  total: number;
  cats: CategoryRow[];
  initialFaqs: QAInput[];
  disabled: boolean;
  onUpdate: (id: string, patch: TreatmentInput, faqs: QAInput[], done: () => void) => void;
  onToggleVisible: (id: string, visible: boolean) => void;
  onDelete: (id: string) => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [editing, setEditing] = useState(false);
  const t = treatment;

  const richCount =
    (t.protocol?.length ? 1 : 0) +
    (t.candidate?.length ? 1 : 0) +
    (t.technology ? 1 : 0) +
    (initialFaqs.length ? 1 : 0);

  if (editing) {
    return (
      <div className="adm-tr">
        <div className="adm-form" style={{ width: "100%" }}>
          <p className="adm-form-title">Editar tratamiento</p>
          <TreatmentFields
            cats={cats}
            initial={t}
            initialFaqs={initialFaqs}
            disabled={disabled}
            onSubmit={(patch, faqs, done) => onUpdate(t.id, patch, faqs, () => { done(); setEditing(false); })}
            onCancel={() => setEditing(false)}
            submitLabel="Guardar cambios"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`adm-tr${t.visible ? "" : " is-hidden"}`}>
      <div className="adm-tr-body">
        <p className="adm-tr-name">
          {t.name}
          {!t.visible && <span className="adm-tag">Oculto</span>}
          {richCount > 0 && (
            <span className="adm-tag" style={{ background: "var(--revia-sky-500)", color: "#fff" }}>
              Ficha {richCount}/4
            </span>
          )}
        </p>
        {t.summary && <p className="adm-tr-sum">{t.summary}</p>}
        {t.body_zones.length > 0 && <p className="adm-tr-zones">{t.body_zones.join(" · ")}</p>}
      </div>
      <div className="adm-actions">
        <button
          type="button"
          className={`adm-toggle ${t.visible ? "adm-toggle-on" : "adm-toggle-off"}`}
          aria-pressed={t.visible}
          disabled={disabled}
          onClick={() => onToggleVisible(t.id, !t.visible)}
          title={t.visible ? "Visible en el sitio — clic para ocultar" : "Oculto — clic para mostrar"}
        >
          <span className="dot" aria-hidden="true" />
          {t.visible ? "Visible" : "Oculto"}
        </button>
        <button className="adm-btn adm-btn-outline adm-ico" disabled={disabled || index === 0} onClick={() => onMove(-1)} aria-label="Subir" title="Subir">↑</button>
        <button className="adm-btn adm-btn-outline adm-ico" disabled={disabled || index === total - 1} onClick={() => onMove(1)} aria-label="Bajar" title="Bajar">↓</button>
        <button className="adm-btn adm-btn-outline" disabled={disabled} onClick={() => setEditing(true)}>Editar</button>
        <ConfirmDelete disabled={disabled} label="Eliminar" onConfirm={() => onDelete(t.id)} />
      </div>
    </div>
  );
}

/* ── formularios ──────────────────────────────────────────────────────── */
function CategoryForm({
  initial,
  disabled,
  onSubmit,
  onCancel,
}: {
  initial?: CategoryRow;
  disabled: boolean;
  onSubmit: (patch: { name: string; palette: Palette; headline?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [palette, setPalette] = useState<Palette>(initial?.palette ?? "warm");
  const [headline, setHeadline] = useState(initial?.headline ?? "");

  return (
    <form
      className="adm-form"
      style={{ padding: 0, background: "transparent", border: "none" }}
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit({ name, palette, headline });
      }}
    >
      <div className="adm-field">
        <label>Nombre de la categoría</label>
        <input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ej: Rejuvenecimiento Facial" />
      </div>
      <div className="adm-row">
        <div className="adm-field" style={{ flex: "0 0 auto", minWidth: "180px" }}>
          <label>Paleta de color</label>
          <select className="adm-input" value={palette} onChange={(e) => setPalette(e.target.value as Palette)}>
            {PALETTES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <label>Titular (opcional)</label>
          <input className="adm-input" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Ej: Tu cabello, una obra médica de arte" />
        </div>
      </div>
      <div className="adm-form-actions">
        <button type="submit" className="adm-btn adm-btn-primary" disabled={disabled}>Guardar categoría</button>
        <button type="button" className="adm-btn adm-btn-ghost" disabled={disabled} onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

function TreatmentFields({
  cats,
  initial,
  initialFaqs,
  defaultCategoryId,
  disabled,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  cats: CategoryRow[];
  initial?: TreatmentRow;
  initialFaqs: QAInput[];
  defaultCategoryId?: string;
  disabled: boolean;
  onSubmit: (input: TreatmentInput, faqs: QAInput[], done: () => void) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? defaultCategoryId ?? cats[0]?.id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [outcome, setOutcome] = useState(initial?.outcome ?? "");
  const [zones, setZones] = useState((initial?.body_zones ?? []).join(", "));
  const [visible, setVisible] = useState(initial?.visible ?? true);

  // Contenido rico (Fase 4).
  const [protocol, setProtocol] = useState<ProtocolStep[]>(initial?.protocol ?? []);
  const [candidateText, setCandidateText] = useState((initial?.candidate ?? []).join("\n\n"));
  const [techLead, setTechLead] = useState(initial?.technology?.lead ?? "");
  const [techItems, setTechItems] = useState((initial?.technology?.items ?? []).join(", "));
  const [faqs, setFaqs] = useState<QAInput[]>(initialFaqs);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const candidate = candidateText.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
    const techItemsArr = techItems.split(",").map((s) => s.trim()).filter(Boolean);
    const technology: Technology | null =
      techLead.trim() || techItemsArr.length ? { lead: techLead.trim(), items: techItemsArr } : null;
    const protocolClean = protocol
      .map((s) => ({ title: s.title.trim(), body: s.body.trim() }))
      .filter((s) => s.title || s.body);
    const faqClean = faqs
      .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
      .filter((f) => f.question && f.answer);

    onSubmit(
      {
        categoryId,
        name,
        summary,
        outcome,
        bodyZones: parseBodyZones(zones),
        visible,
        protocol: protocolClean.length ? protocolClean : null,
        candidate: candidate.length ? candidate : null,
        technology,
      },
      faqClean,
      () => {
        if (!initial) {
          setName(""); setSummary(""); setOutcome(""); setZones(""); setVisible(true);
          setProtocol([]); setCandidateText(""); setTechLead(""); setTechItems(""); setFaqs([]);
        }
      },
    );
  }

  return (
    <form className="adm-form" style={{ padding: 0, background: "transparent", border: "none" }} onSubmit={submit}>
      <div className="adm-row">
        <div className="adm-field">
          <label>Nombre del tratamiento</label>
          <input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ej: Bioestimuladores de Colágeno" />
        </div>
        <div className="adm-field" style={{ flex: "0 0 auto", minWidth: "220px" }}>
          <label>Categoría</label>
          <select className="adm-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="adm-field">
        <label>Resumen</label>
        <textarea className="adm-input" rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Descripción breve del tratamiento (no invasivo)." />
      </div>
      <div className="adm-field">
        <label>Resultado esperado (opcional)</label>
        <input className="adm-input" value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="Ej: Piel más firme y uniforme." />
      </div>
      <div className="adm-field">
        <label>Zonas del cuerpo (opcional)</label>
        <input className="adm-input" value={zones} onChange={(e) => setZones(e.target.value)} placeholder="rostro-completo, cuello" />
        <p className="adm-hint">Sepáralas con comas. Se guardan en minúsculas y con guiones.</p>
      </div>

      {/* Contenido de la ficha (Fase 4) — colapsable para no saturar el form base. */}
      <details className="adm-field" style={{ border: "1px solid var(--revia-sky-200)", borderRadius: "10px", padding: "14px 16px" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>
          Contenido de la ficha — protocolo, para quién, tecnología y FAQ
        </summary>
        <p className="adm-hint" style={{ marginTop: "10px" }}>
          Si dejas una sección vacía, la ficha usa el texto genérico del sitio.
          Contenido clínico a validar con el equipo médico. No invasivo, sin inventar cifras.
        </p>

        <div className="adm-field" style={{ marginTop: "16px" }}>
          <label>Para quién (candidato ideal)</label>
          <textarea
            className="adm-input"
            rows={4}
            value={candidateText}
            onChange={(e) => setCandidateText(e.target.value)}
            placeholder={"Un párrafo por bloque, separados por una línea en blanco."}
          />
          <p className="adm-hint">Separa los párrafos con una línea en blanco.</p>
        </div>

        <div className="adm-field">
          <label>Tecnología usada</label>
          <textarea
            className="adm-input"
            rows={2}
            value={techLead}
            onChange={(e) => setTechLead(e.target.value)}
            placeholder="Frase introductoria sobre la tecnología no invasiva del tratamiento."
          />
          <input
            className="adm-input"
            style={{ marginTop: "8px" }}
            value={techItems}
            onChange={(e) => setTechItems(e.target.value)}
            placeholder="Equipos/técnicas separadas por comas (opcional)"
          />
        </div>

        <StepListEditor steps={protocol} onChange={setProtocol} disabled={disabled} />
        <FaqListEditor faqs={faqs} onChange={setFaqs} disabled={disabled} />
      </details>

      <label className="adm-check">
        <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
        Visible en el sitio
      </label>
      <div className="adm-form-actions">
        <button type="submit" className="adm-btn adm-btn-primary" disabled={disabled}>{submitLabel}</button>
        <button type="button" className="adm-btn adm-btn-ghost" disabled={disabled} onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

/* ── editor de pasos del protocolo ────────────────────────────────────── */
function StepListEditor({
  steps,
  onChange,
  disabled,
}: {
  steps: ProtocolStep[];
  onChange: (next: ProtocolStep[]) => void;
  disabled: boolean;
}) {
  function update(i: number, patch: Partial<ProtocolStep>) {
    onChange(steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  return (
    <div className="adm-field">
      <label>Protocolo (pasos)</label>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px", paddingLeft: "10px", borderLeft: "2px solid var(--revia-sky-200)" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              className="adm-input"
              value={s.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder={`Título del paso ${i + 1}`}
            />
            <button type="button" className="adm-btn adm-btn-outline adm-ico" disabled={disabled} onClick={() => onChange(steps.filter((_, idx) => idx !== i))} aria-label="Quitar paso" title="Quitar">✕</button>
          </div>
          <textarea
            className="adm-input"
            rows={2}
            value={s.body}
            onChange={(e) => update(i, { body: e.target.value })}
            placeholder="Descripción del paso"
          />
        </div>
      ))}
      <button type="button" className="adm-btn adm-btn-outline" disabled={disabled} onClick={() => onChange([...steps, { title: "", body: "" }])}>
        ＋ Añadir paso
      </button>
    </div>
  );
}

/* ── editor de FAQ por tratamiento ────────────────────────────────────── */
function FaqListEditor({
  faqs,
  onChange,
  disabled,
}: {
  faqs: QAInput[];
  onChange: (next: QAInput[]) => void;
  disabled: boolean;
}) {
  function update(i: number, patch: Partial<QAInput>) {
    onChange(faqs.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  }
  return (
    <div className="adm-field">
      <label>Preguntas frecuentes (por tratamiento)</label>
      {faqs.map((f, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px", paddingLeft: "10px", borderLeft: "2px solid var(--revia-sky-200)" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              className="adm-input"
              value={f.question}
              onChange={(e) => update(i, { question: e.target.value })}
              placeholder={`Pregunta ${i + 1}`}
            />
            <button type="button" className="adm-btn adm-btn-outline adm-ico" disabled={disabled} onClick={() => onChange(faqs.filter((_, idx) => idx !== i))} aria-label="Quitar pregunta" title="Quitar">✕</button>
          </div>
          <textarea
            className="adm-input"
            rows={2}
            value={f.answer}
            onChange={(e) => update(i, { answer: e.target.value })}
            placeholder="Respuesta honesta, sin inventar cifras clínicas."
          />
        </div>
      ))}
      <button type="button" className="adm-btn adm-btn-outline" disabled={disabled} onClick={() => onChange([...faqs, { question: "", answer: "" }])}>
        ＋ Añadir pregunta
      </button>
    </div>
  );
}

/* ── confirmar borrado (dos clics) ────────────────────────────────────── */
function ConfirmDelete({
  disabled,
  label,
  warning,
  onConfirm,
}: {
  disabled: boolean;
  label: string;
  warning?: string;
  onConfirm: () => void;
}) {
  const [armed, setArmed] = useState(false);
  if (armed) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {warning && <span style={{ fontSize: "12px", color: "var(--revia-coffee-700)" }}>{warning}</span>}
        <button type="button" className="adm-btn adm-btn-danger" disabled={disabled} onClick={() => { onConfirm(); setArmed(false); }}>
          Confirmar
        </button>
        <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setArmed(false)}>Cancelar</button>
      </span>
    );
  }
  return (
    <button type="button" className="adm-btn adm-btn-danger" disabled={disabled} onClick={() => setArmed(true)}>
      {label}
    </button>
  );
}
