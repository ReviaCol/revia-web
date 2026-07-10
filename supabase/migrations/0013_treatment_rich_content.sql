-- =============================================================================
-- Reviá Web — CMS Fase 4: contenido rico por tratamiento.
-- ADR: 03-decisions/0018-cms-fase4-contenido-rico-tratamiento.md
--
-- Cómo aplicar: pegar en el SQL Editor del proyecto Supabase de Reviá y ejecutar.
-- Idempotente (re-ejecutable). Correr ANTES que 0014_seed_treatment_rich_content.sql.
--
-- Añade tres columnas jsonb NULLABLE a public.treatments. Nulas = la ficha usa el
-- template genérico de siempre (fallback, sitio a prueba de fallas). La FAQ por
-- tratamiento NO vive aquí: reutiliza la tabla public.faqs (0010) con
-- scope = <treatment id>.
--
-- Forma de cada columna (contrato con lib/catalog.ts):
--   protocol   → [{ "title": text, "body": text }, ...]      (pasos → PillarGrid)
--   candidate  → ["párrafo", "párrafo", ...]                 (para quién → ProseSection)
--   technology → { "lead": text, "items": [text, ...] }      (tecnología → ProseSection + chips)
-- =============================================================================

alter table public.treatments add column if not exists protocol   jsonb;
alter table public.treatments add column if not exists candidate   jsonb;
alter table public.treatments add column if not exists technology  jsonb;

comment on column public.treatments.protocol   is 'Fase 4 (ADR 0018): pasos del protocolo [{title,body}]. NULL = template genérico.';
comment on column public.treatments.candidate  is 'Fase 4 (ADR 0018): "para quién" como párrafos [text]. NULL = template genérico.';
comment on column public.treatments.technology is 'Fase 4 (ADR 0018): tecnología {lead, items[]}. NULL = sección omitida.';

-- RLS: las columnas heredan las policies de public.treatments (0004). anon lee
-- solo tratamientos visibles; authenticated (panel) lee/escribe todo. Sin cambios.
