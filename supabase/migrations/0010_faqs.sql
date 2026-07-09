-- =============================================================================
-- Reviá Web — CMS Fase 2 · Singleton tipo lista: FAQs.
-- ADR: 03-decisions/0016-cms-fase2-hero-faqs-equipo.md
--
-- Pegar en el SQL Editor de Supabase y ejecutar. Idempotente.
--
-- Modelo: una fila por pregunta, agrupadas por `scope` (la página/sección que la
-- muestra). Orden por sort_order; ocultar sin borrar con visible.
--
-- Scopes sembrados:
--   'longevidad'        → /longevidad/[experiencia]  (EN VIVO: la página lee de la DB)
--   'implante-capilar'  → /implante-capilar          (SEMBRADO, rewire pendiente*)
-- * El archivo implante-capilar/page.tsx no se pudo rewirear en el entorno de
--   Claude por corrupción de lectura del folder montado; la data queda editable
--   en /admin y se cablea en un paso aparte (ver ADR 0016). Las FAQs por
--   tratamiento (/tratamientos/[slug]) son contenido de catálogo, no singleton.
-- =============================================================================

create table if not exists public.faqs (
  id          uuid primary key default gen_random_uuid(),
  scope       text not null,
  question    text not null,
  answer      text not null,
  sort_order  int  not null default 0,
  visible     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (scope, question)
);

create index if not exists faqs_scope_idx on public.faqs (scope, sort_order);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

alter table public.faqs enable row level security;

drop policy if exists "faqs_select_public" on public.faqs;
create policy "faqs_select_public" on public.faqs
  for select using (visible = true);

drop policy if exists "faqs_select_authenticated" on public.faqs;
create policy "faqs_select_authenticated" on public.faqs
  for select to authenticated using (true);

drop policy if exists "faqs_write_authenticated" on public.faqs;
create policy "faqs_write_authenticated" on public.faqs
  for all to authenticated using (true) with check (true);

-- ── Seed ─────────────────────────────────────────────────────────────────────
insert into public.faqs (scope, question, answer, sort_order) values
  ('longevidad', '¿Necesito preparación previa?', 'Muy poca. Te damos indicaciones simples al agendar para que aproveches la sesión al máximo.', 0),
  ('longevidad', '¿Con qué frecuencia se recomienda?', 'Depende de tu objetivo. Lo definimos en tu evaluación de longevidad, con un plan realista y sostenible.', 1),
  ('longevidad', '¿Es para mí?', 'Si buscas recuperar energía, claridad y equilibrio sin procedimientos invasivos, es muy probable que sí. Te lo confirmamos con honestidad.', 2),
  ('implante-capilar', '¿Es un proceso doloroso?', 'Aplicamos anestesia local para que la experiencia sea cómoda. La mayoría de las personas describe molestias mínimas durante y después del tratamiento.', 0),
  ('implante-capilar', '¿Cuándo veré resultados?', 'El cabello implantado suele caer en las primeras semanas (es esperado) y comienza a crecer de forma estable a partir del tercer o cuarto mes. El resultado pleno se aprecia entre los 9 y 12 meses.', 1),
  ('implante-capilar', '¿Necesito rasurarme la cabeza?', 'No necesariamente. Ofrecemos técnica sin rasurado (non-shaven) cuando tu caso lo permite, para que puedas retomar tu vida con discreción.', 2),
  ('implante-capilar', '¿El cabello implantado se vuelve a caer?', 'Los folículos implantados se toman de zonas resistentes a la caída, por lo que tienden a permanecer. Te explicamos con honestidad cómo cuidar el resto de tu cabello.', 3),
  ('implante-capilar', '¿Cuánto tiempo toma el tratamiento?', 'Distribuimos el proceso en dos días para tu comodidad, según la cantidad de folículos a implantar. Lo definimos contigo en la valoración.', 4)
on conflict (scope, question) do nothing;
