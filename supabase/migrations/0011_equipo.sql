-- =============================================================================
-- Reviá Web — CMS Fase 2 · Equipo: especialidades (visible) + médicos (oculto).
-- ADR: 03-decisions/0016-cms-fase2-hero-faqs-equipo.md
--
-- Pegar en el SQL Editor de Supabase y ejecutar. Idempotente.
--
--   public.specialties   → lista de ESPECIALIDADES de /nosotros#equipo (EN VIVO).
--                          Es lo único de "equipo" que el sitio muestra hoy
--                          (sin nombres, por el caveat legal — marca nueva Reviá).
--   public.team_members  → tarjetas de médicos (nombre, credenciales, cita, foto).
--                          CMS listo pero NO renderizado: se activa en Fase 3 cuando
--                          haya nombres/fotos reales. photo_url es texto por ahora
--                          (Supabase Storage = scope de Fase 3).
-- =============================================================================

-- ── Especialidades (visible) ─────────────────────────────────────────────────
create table if not exists public.specialties (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  sort_order  int  not null default 0,
  visible     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Médicos (oculto hasta Fase 3) ────────────────────────────────────────────
create table if not exists public.team_members (
  id          text primary key,
  name        text not null,
  specialty   text not null default '',
  credentials text[] not null default '{}',
  quote       text,
  photo_url   text,
  visible     boolean not null default true,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists specialties_set_updated_at on public.specialties;
create trigger specialties_set_updated_at
  before update on public.specialties
  for each row execute function public.set_updated_at();

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

alter table public.specialties  enable row level security;
alter table public.team_members enable row level security;

drop policy if exists "specialties_select_public" on public.specialties;
create policy "specialties_select_public" on public.specialties
  for select using (visible = true);
drop policy if exists "specialties_select_authenticated" on public.specialties;
create policy "specialties_select_authenticated" on public.specialties
  for select to authenticated using (true);
drop policy if exists "specialties_write_authenticated" on public.specialties;
create policy "specialties_write_authenticated" on public.specialties
  for all to authenticated using (true) with check (true);

drop policy if exists "team_members_select_public" on public.team_members;
create policy "team_members_select_public" on public.team_members
  for select using (visible = true);
drop policy if exists "team_members_select_authenticated" on public.team_members;
create policy "team_members_select_authenticated" on public.team_members
  for select to authenticated using (true);
drop policy if exists "team_members_write_authenticated" on public.team_members;
create policy "team_members_write_authenticated" on public.team_members
  for all to authenticated using (true) with check (true);

-- ── Seed especialidades (brand-system.md §9.3) ───────────────────────────────
insert into public.specialties (name, sort_order) values
  ('Dermatólogos', 0),
  ('Médicos estéticos', 1),
  ('Nutricionistas', 2),
  ('Especialistas en medicina regenerativa', 3),
  ('Tricólogos', 4),
  ('Especialistas en bienestar y longevidad', 5)
on conflict (name) do nothing;

-- ── Seed médicos (placeholders de team.ts; NO se renderizan aún) ──────────────
insert into public.team_members (id, name, specialty, credentials, quote, photo_url, sort_order) values
  ('miembro-01', 'Dra. [Nombre]', 'Medicina Estética · Regenerativa',
   array['Universidad Nacional de Colombia','Sociedad Colombiana de Medicina Estética'],
   'No buscamos cambiarte. Buscamos revelar lo que ya eres.', null, 0),
  ('miembro-02', 'Dr. [Nombre]', 'Dermatología · Bioestimulación',
   array['Universidad Nacional de Colombia','Asociación Colombiana de Dermatología'],
   'La piel cuenta una historia. Mi trabajo es ayudarla a contarla mejor.', null, 1),
  ('miembro-03', 'Dra. [Nombre]', 'Nutrición · Longevidad',
   array['Universidad Nacional de Colombia','Especialización en Nutrición Clínica'],
   'La vitalidad empieza en la célula. La acompañamos desde dentro.', null, 2),
  ('miembro-04', 'Dr. [Nombre]', 'Medicina Regenerativa · Bienestar',
   array['Universidad Nacional de Colombia','Formación en Medicina Regenerativa'],
   'Activamos procesos que tu cuerpo ya conoce. Solo le damos la señal.', null, 3)
on conflict (id) do nothing;
