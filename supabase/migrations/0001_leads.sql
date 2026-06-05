-- =============================================================================
-- Reviá Web — CRM interno: tabla de leads del formulario de contacto.
-- ADR: 03-decisions/0004-crm-interno-supabase.md
--
-- Cómo aplicar: pega este archivo en el SQL Editor del proyecto Supabase del
-- CLIENTE y ejecútalo. Es idempotente (se puede correr más de una vez).
-- =============================================================================

-- Enum del pipeline de estados del lead.
do $$
begin
  create type public.lead_estado as enum
    ('nuevo', 'contactado', 'agendado', 'paciente', 'descartado');
exception
  when duplicate_object then null;
end $$;

-- Tabla principal.
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  nombre      text not null,
  email       text not null,
  whatsapp    text,
  servicio    text,                 -- id de categoría de treatments.json (puede ser null)
  mensaje     text,
  estado      public.lead_estado not null default 'nuevo',
  fuente      text not null default 'web',
  notas       text                  -- notas internas del equipo (panel /admin)
);

create index if not exists leads_estado_idx     on public.leads (estado);
create index if not exists leads_created_at_idx  on public.leads (created_at desc);

-- Trigger: mantener updated_at al día en cada UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- =============================================================================
-- RLS — Row Level Security
-- - El público (anon) NO puede leer ni escribir.
-- - La inserción desde el formulario pasa por /api/contact con la service_role
--   key, que BYPASSA RLS (no necesita policy).
-- - El panel /admin usará usuarios autenticados (rol 'authenticated').
-- =============================================================================
alter table public.leads enable row level security;

-- Lectura para usuarios autenticados (panel /admin).
drop policy if exists "leads_select_authenticated" on public.leads;
create policy "leads_select_authenticated" on public.leads
  for select to authenticated using (true);

-- Actualización (cambiar estado, agregar notas) para usuarios autenticados.
drop policy if exists "leads_update_authenticated" on public.leads;
create policy "leads_update_authenticated" on public.leads
  for update to authenticated using (true) with check (true);

-- Nota: NO se crea policy para 'anon'. Cualquier inserción pública debe pasar por
-- el route handler server-side con service_role. Cualquier usuario autenticado
-- puede ver todos los leads (hoy solo habrá admins); si en el futuro se agregan
-- logins de otra audiencia, acotar estas policies.
