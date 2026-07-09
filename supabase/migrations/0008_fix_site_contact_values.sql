-- =============================================================================
-- Reviá Web — CMS Fase 2 · Corrección de valores del singleton de contacto.
-- ADR: 03-decisions/0015-cms-fase2-contacto-horarios.md
--
-- Por qué: el seed 0007 se sembró con los valores viejos de `BUSINESS` (seo.ts) /
-- ContactChannels.tsx. La fuente VIVA de contacto es `src/lib/contact.ts`
-- (actualizada 2026-06-04 con los números reales de operación). Esta migración
-- alinea la fila ya sembrada con esos valores. Correr UNA vez tras 0006/0007.
--
-- Semántica de columnas (aclaración): `phone` y `whatsapp` guardan el TEXTO DE
-- DISPLAY (lo que se muestra). El read-layer (lib/site-content.ts) deriva los
-- dígitos para wa.me / tel: quitando lo no numérico. Así el editor teclea un
-- solo campo legible por canal.
-- =============================================================================

update public.site_contact set
  phone            = '+57 310 343 8833',                             -- llamadas
  whatsapp         = '+57 311 561 9394',                             -- WhatsApp (display)
  email            = 'admin@revia.com.co',
  street_address   = 'Cra 16 # 86B-52',
  address_locality = 'Bogotá',
  address_region   = 'Bogotá D.C.',
  address_country  = 'CO',
  instagram_url    = 'https://instagram.com/reviatratamientossincirugia'
where id = 'default';

-- Verificación:
--   select phone, whatsapp, email, instagram_url from public.site_contact;
