-- =============================================================================
-- Reviá Web — CMS Fase 2 · Singleton: home (hero + manifiesto).
-- ADR: 03-decisions/0016-cms-fase2-hero-faqs-equipo.md
--
-- Pegar en el SQL Editor de Supabase y ejecutar. Idempotente. Correr 0009 (schema)
-- y luego el seed incluido al final.
--
-- Convención de énfasis: en los campos de texto, *palabra* se renderiza en itálica
-- (equivalente a <em>). Los saltos se manejan por línea (line1/line2). Así el
-- editor controla el copy manteniendo la jerarquía visual de marca.
-- =============================================================================

create table if not exists public.home_content (
  id                 text primary key default 'default' check (id = 'default'),
  hero_line1         text not null,
  hero_line2         text not null,   -- soporta *énfasis*
  hero_subtitle      text not null,
  manifesto_eyebrow  text not null default 'Manifiesto',
  manifesto_line1    text not null,
  manifesto_line2    text not null,   -- soporta *énfasis*
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists home_content_set_updated_at on public.home_content;
create trigger home_content_set_updated_at
  before update on public.home_content
  for each row execute function public.set_updated_at();

alter table public.home_content enable row level security;

drop policy if exists "home_content_select_public" on public.home_content;
create policy "home_content_select_public" on public.home_content
  for select using (true);

drop policy if exists "home_content_write_authenticated" on public.home_content;
create policy "home_content_write_authenticated" on public.home_content
  for all to authenticated using (true) with check (true);

-- ── Seed (valores actuales del home) ─────────────────────────────────────────
insert into public.home_content
  (id, hero_line1, hero_line2, hero_subtitle, manifesto_eyebrow, manifesto_line1, manifesto_line2)
values
  ('default',
   'Tu belleza ya existe.',
   'Espera ser *revelada*.',
   'Medicina estética y regenerativa no invasiva. Activamos lo que tu biología ya conoce.',
   'Manifiesto',
   'Buscamos tu verdadera esencia',
   'para revelarla en tu *mejor expresión*.')
on conflict (id) do nothing;
