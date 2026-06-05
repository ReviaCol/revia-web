-- =============================================================================
-- Reviá Web — quitar el estado 'paciente' del pipeline de leads.
-- 'paciente' no aplica a un CRM de leads (un lead se agenda o se descarta).
-- Postgres no permite DROP VALUE en un enum, así que recreamos el tipo.
--
-- Cómo aplicar: pégalo en el SQL Editor del proyecto Supabase del cliente -> Run.
-- =============================================================================

-- 1) Reasignar filas existentes con 'paciente'. Las tratamos como 'agendado'
--    (eran leads que avanzaron). Cambia el destino si prefieres otro estado.
update public.leads set estado = 'agendado' where estado = 'paciente';

-- 2) Recrear el enum sin 'paciente'.
alter type public.lead_estado rename to lead_estado_old;
create type public.lead_estado as enum
  ('nuevo', 'contactado', 'agendado', 'descartado');

-- 3) Migrar la columna al nuevo tipo (quitando y reponiendo el default).
alter table public.leads
  alter column estado drop default,
  alter column estado type public.lead_estado
    using estado::text::public.lead_estado,
  alter column estado set default 'nuevo';

-- 4) Limpiar el tipo viejo.
drop type public.lead_estado_old;
