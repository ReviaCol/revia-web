-- =============================================================================
-- Reviá Web — CMS Fase 2 · Seed del singleton de contacto y horarios.
-- ADR: 03-decisions/0015-cms-fase2-contacto-horarios.md
--
-- Cómo aplicar: correr DESPUÉS de 0006_site_contact.sql. Idempotente (on conflict
-- do nothing): re-ejecutar NO pisa ediciones hechas desde /admin.
--
-- Valores = fuente viva de contacto `src/lib/contact.ts` (actualizada 2026-06-04)
-- y horario espejo de BUSINESS_HOURS (src/lib/booking.ts).
--
-- NOTA: `phone` y `whatsapp` guardan el TEXTO DE DISPLAY. El read-layer deriva
-- los dígitos para wa.me / tel: quitando lo no numérico.
--
-- ⚠️ Si ya corriste una versión anterior de este seed (valores viejos), corre
-- además 0008_fix_site_contact_values.sql para corregir la fila existente.
-- =============================================================================

insert into public.site_contact
  (id, phone, whatsapp, email, street_address, address_locality, address_region, address_country, instagram_url, maps_url)
values
  ('default',
   '+57 310 343 8833',
   '+57 311 561 9394',
   'admin@revia.com.co',
   'Cra 16 # 86B-52',
   'Bogotá',
   'Bogotá D.C.',
   'CO',
   'https://instagram.com/reviatratamientossincirugia',
   null)
on conflict (id) do nothing;

-- Horario display, espejo de BUSINESS_HOURS (booking.ts):
--   Dom cerrado · Lun–Vie 7:00–19:00 (420–1140) · Sáb 7:00–14:00 (420–840).
insert into public.site_hours (weekday, closed, open_min, close_min) values
  (0, true,  null, null),   -- Domingo
  (1, false, 420, 1140),    -- Lunes
  (2, false, 420, 1140),    -- Martes
  (3, false, 420, 1140),    -- Miércoles
  (4, false, 420, 1140),    -- Jueves
  (5, false, 420, 1140),    -- Viernes
  (6, false, 420, 840)      -- Sábado
on conflict (weekday) do nothing;
