-- =============================================================================
-- Reviá Web — Booking con pago (vía HeySetter).
-- ADR: 03-decisions/0010-booking-pago-bold-recordatorios.md (adenda 2026-06-02)
--
-- Tabla independiente de `leads` (CRM). Source of truth del status = HeySetter;
-- esta tabla mantiene un espejo (`status_mirror`) + los punteros necesarios
-- para sobrevivir crashes y para el polling cron.
--
-- Cómo aplicar: pegar en el SQL Editor del proyecto Supabase del cliente.
-- Idempotente (re-ejecutable).
-- =============================================================================

-- 1) Enum del espejo de estado.
do $$
begin
  create type public.booking_status as enum
    ('pending_payment', 'paid', 'cancelled');
exception
  when duplicate_object then null;
end $$;

-- 2) Tabla principal.
create table if not exists public.bookings (
  id                    uuid primary key default gen_random_uuid(),
  token                 text not null unique,                  -- /reserva/[token] (20 chars URL-safe)
  heysetter_booking_id  text unique,                           -- uuid devuelto por HeySetter
  idempotency_key       text not null unique,                  -- UUID v4 enviado a HeySetter
  external_ref          text not null,                         -- = token (puente para HeySetter)
  category              text not null,                         -- 'rostro' | 'cuerpo' | 'capilar'
  name                  text not null,
  email                 text not null,
  phone                 text not null,                         -- formato E.164 (+57...)
  notes                 text,
  date                  date not null,                         -- YYYY-MM-DD (zona Bogotá)
  time                  text not null,                         -- 'HH:MM' (hora en punto)
  status_mirror         public.booking_status not null default 'pending_payment',
  calendar_event_id     text,                                  -- id del evento en Google Calendar
  payment_link          text,                                  -- devuelto por HeySetter
  amount_cop            integer not null,                      -- snapshot del monto al crear
  email_states_sent     jsonb not null default '[]'::jsonb,    -- ['pending','paid','cancelled']
  created_at            timestamptz not null default now(),
  expires_at            timestamptz not null,                  -- = created_at + 12h
  paid_at               timestamptz,
  cancelled_at          timestamptz,
  last_polled_at        timestamptz
);

-- 3) Índices.
create index if not exists bookings_token_idx         on public.bookings (token);
create index if not exists bookings_idem_idx          on public.bookings (idempotency_key);
create index if not exists bookings_status_idx        on public.bookings (status_mirror);
create index if not exists bookings_heysetter_idx     on public.bookings (heysetter_booking_id);
create index if not exists bookings_pending_poll_idx  on public.bookings (status_mirror, last_polled_at)
  where status_mirror = 'pending_payment';

-- 4) RPC: append idempotente a `email_states_sent`.
--    Evita race conditions entre cron y client-poll en /reserva/[token].
create or replace function public.append_booking_email(p_id uuid, p_kind text)
returns void
language sql
as $$
  update public.bookings
  set email_states_sent = email_states_sent || to_jsonb(p_kind)
  where id = p_id
    and not (email_states_sent @> to_jsonb(p_kind));
$$;

-- 5) RLS — Row Level Security.
-- Sin policies = anon + authenticated denegados. Solo `service_role` (server-side
-- route handlers) accede. Mismo patrón que la tabla `leads`.
alter table public.bookings enable row level security;
