-- =============================================================================
-- Reviá Web — CMS Fase 2 · Singleton 1: contacto y horarios editables.
-- ADR: 03-decisions/0015-cms-fase2-contacto-horarios.md
--
-- Cómo aplicar: pegar en el SQL Editor del proyecto Supabase de Reviá y ejecutar.
-- Idempotente (re-ejecutable). Correr ANTES que 0007_seed_site_contact.sql.
--
-- Modelo:
--   public.site_contact  → 1 sola fila (singleton, id fijo 'default'): teléfono,
--                          WhatsApp, email, dirección, redes, URL de mapa.
--   public.site_hours    → 7 filas (una por día, weekday 0=Dom … 6=Sáb): horario
--                          de atención EDITABLE PARA MOSTRAR en el sitio.
--
-- ⚠️ IMPORTANTE — no confundir con el motor de reservas:
--   El horario que gobierna la disponibilidad real del booking sigue viviendo en
--   código: BUSINESS_HOURS en src/lib/booking.ts (numérico, source of truth de
--   agenda). site_hours es SOLO el horario que se muestra en /contacto, footer,
--   overlays, etc. Se siembra con los mismos valores para que arranquen sincronizados;
--   mantenerlos en sync es responsabilidad del editor (ver ADR 0015 → deuda).
-- =============================================================================

-- ── Contacto (singleton) ─────────────────────────────────────────────────────
create table if not exists public.site_contact (
  id                text primary key default 'default' check (id = 'default'),
  phone             text not null,               -- texto display (llamadas), p.ej. '+57 310 343 8833'
  whatsapp          text not null,               -- texto display, p.ej. '+57 311 561 9394' (read-layer deriva dígitos)
  email             text not null,
  street_address    text not null,               -- p.ej. 'Cra 16 # 86B-52'
  address_locality  text not null default 'Bogotá',
  address_region    text not null default 'Bogotá D.C.',
  address_country   text not null default 'CO',  -- ISO-3166-1 alpha-2
  instagram_url     text,
  maps_url          text,                         -- link a Google/Apple Maps (opcional)
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ── Horario de atención (display) ────────────────────────────────────────────
-- Minutos desde medianoche: 420 = 7:00, 1140 = 19:00. NULL cuando closed=true.
create table if not exists public.site_hours (
  weekday     smallint primary key check (weekday between 0 and 6),  -- 0=Dom … 6=Sáb
  closed      boolean not null default false,
  open_min    smallint check (open_min  between 0 and 1440),
  close_min   smallint check (close_min between 0 and 1440),
  updated_at  timestamptz not null default now(),
  -- Coherencia: si abre, debe tener apertura < cierre; si cierra, ambos NULL.
  constraint site_hours_range check (
    (closed = true  and open_min is null and close_min is null) or
    (closed = false and open_min is not null and close_min is not null and open_min < close_min)
  )
);

-- ── Trigger updated_at (función ya existe desde 0001_leads.sql; idempotente) ──
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists site_contact_set_updated_at on public.site_contact;
create trigger site_contact_set_updated_at
  before update on public.site_contact
  for each row execute function public.set_updated_at();

drop trigger if exists site_hours_set_updated_at on public.site_hours;
create trigger site_hours_set_updated_at
  before update on public.site_hours
  for each row execute function public.set_updated_at();

-- =============================================================================
-- RLS
-- - Lectura pública total: contacto y horarios son información pública del sitio
--   (anon y authenticated leen todo; no hay flag 'visible' aquí).
-- - Escritura: solo authenticated (equipo/cliente en /admin).
--   service_role (server-side) bypassa RLS si se necesitara.
-- =============================================================================
alter table public.site_contact enable row level security;
alter table public.site_hours   enable row level security;

drop policy if exists "site_contact_select_public" on public.site_contact;
create policy "site_contact_select_public" on public.site_contact
  for select using (true);

drop policy if exists "site_contact_write_authenticated" on public.site_contact;
create policy "site_contact_write_authenticated" on public.site_contact
  for all to authenticated using (true) with check (true);

drop policy if exists "site_hours_select_public" on public.site_hours;
create policy "site_hours_select_public" on public.site_hours
  for select using (true);

drop policy if exists "site_hours_write_authenticated" on public.site_hours;
create policy "site_hours_write_authenticated" on public.site_hours
  for all to authenticated using (true) with check (true);
