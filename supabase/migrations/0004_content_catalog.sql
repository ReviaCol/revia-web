-- =============================================================================
-- Reviá Web — CMS Fase 1: catálogo de tratamientos editable.
-- ADR: 03-decisions/0014-cms-admin-catalogo-supabase.md
--
-- Cómo aplicar: pegar en el SQL Editor del proyecto Supabase de Reviá y ejecutar.
-- Idempotente (re-ejecutable). Correr ANTES que 0005_seed_catalog.sql.
-- =============================================================================

-- Categorías del catálogo (id = slug estable, p.ej. 'implante-capilar').
create table if not exists public.categories (
  id          text primary key,
  name        text not null,
  palette     text not null default 'warm' check (palette in ('warm','cool')),
  headline    text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Tratamientos (id = slug estable, p.ej. 'nutri-fol').
create table if not exists public.treatments (
  id          text primary key,
  category_id text not null references public.categories(id) on update cascade on delete cascade,
  name        text not null,
  summary     text not null default '',
  outcome     text,
  body_zones  text[] not null default '{}',
  visible     boolean not null default true,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists treatments_category_idx on public.treatments (category_id, sort_order);

-- Trigger updated_at (la función set_updated_at ya existe desde 0001_leads.sql;
-- se re-crea idempotente por si esta migración corre aislada).
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists treatments_set_updated_at on public.treatments;
create trigger treatments_set_updated_at
  before update on public.treatments
  for each row execute function public.set_updated_at();

-- =============================================================================
-- RLS
-- - Lectura pública del sitio: anon lee solo tratamientos visibles; las
--   categorías se leen siempre. Usuarios autenticados (/admin) leen todo.
-- - Escritura: solo usuarios autenticados (equipo/cliente en /admin).
--   La service_role (server-side) bypassa RLS si se necesitara.
-- =============================================================================
alter table public.categories enable row level security;
alter table public.treatments enable row level security;

-- categories: lectura para todos (anon + authenticated)
drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public" on public.categories
  for select using (true);

-- categories: escritura para autenticados
drop policy if exists "categories_write_authenticated" on public.categories;
create policy "categories_write_authenticated" on public.categories
  for all to authenticated using (true) with check (true);

-- treatments: anon lee solo visibles
drop policy if exists "treatments_select_anon_visible" on public.treatments;
create policy "treatments_select_anon_visible" on public.treatments
  for select to anon using (visible = true);

-- treatments: authenticated lee y escribe todo (incluye ocultos, para el panel)
drop policy if exists "treatments_write_authenticated" on public.treatments;
create policy "treatments_write_authenticated" on public.treatments
  for all to authenticated using (true) with check (true);
