-- =============================================================================
-- Reviá Web — CMS Fase 3 · Storage de fotos de médicos + ocultar placeholders.
-- ADR: 03-decisions/0017-cms-fase3-equipo-storage.md
--
-- Pegar en el SQL Editor de Supabase y ejecutar. Idempotente.
--
--   1. Bucket `team-photos` → PÚBLICO en lectura (para servir con next/image sin
--      firmar URLs), escritura solo `authenticated` (panel /admin).
--   2. Policies RLS sobre storage.objects acotadas al bucket.
--   3. Ocultar los placeholders sembrados en 0011 (Dra. [Nombre]) → visible=false,
--      para que el render de Fase 3 NO muestre nada hasta que haya datos reales.
-- =============================================================================

-- ── 1. Bucket ────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('team-photos', 'team-photos', true)
on conflict (id) do update set public = excluded.public;

-- ── 2. Policies sobre storage.objects (acotadas al bucket team-photos) ────────
-- Lectura pública: cualquiera puede ver las fotos del equipo (son institucionales).
drop policy if exists "team_photos_public_read" on storage.objects;
create policy "team_photos_public_read" on storage.objects
  for select using (bucket_id = 'team-photos');

-- Escritura solo para usuarios autenticados (equipo/cliente logueado en /admin).
drop policy if exists "team_photos_auth_insert" on storage.objects;
create policy "team_photos_auth_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'team-photos');

drop policy if exists "team_photos_auth_update" on storage.objects;
create policy "team_photos_auth_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'team-photos')
  with check (bucket_id = 'team-photos');

drop policy if exists "team_photos_auth_delete" on storage.objects;
create policy "team_photos_auth_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'team-photos');

-- ── 3. Ocultar placeholders (no publicar "Dra. [Nombre]") ────────────────────
-- Se dejan en la tabla (editables en /admin) pero visible=false → el sitio no los
-- muestra. Andres los reemplaza por datos reales y marca "Visible" para publicar.
update public.team_members
set visible = false
where id in ('miembro-01', 'miembro-02', 'miembro-03', 'miembro-04')
   or name ilike '%[nombre]%';
