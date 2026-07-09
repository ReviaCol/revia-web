-- =============================================================================
-- Reviá Web — CMS Fase 1: SEED del catálogo (estado actual de treatments.json).
-- ADR: 03-decisions/0014-cms-admin-catalogo-supabase.md
--
-- Cómo aplicar: correr DESPUÉS de 0004_content_catalog.sql.
-- Idempotente: on conflict actualiza el contenido pero NO pisa `visible`
-- (para no revertir los toggles de mostrar/ocultar hechos desde /admin).
-- =============================================================================

-- Categorías
insert into public.categories (id, name, palette, headline, sort_order) values
  ('no-invasivos-corporal', 'Rejuvenecimiento Corporal', 'warm', null, 0),
  ('no-invasivos-facial', 'Rejuvenecimiento Facial', 'warm', null, 1),
  ('implante-capilar', 'Unidad Capilar', 'warm', 'Tu cabello, una obra médica de arte', 2),
  ('antienvejecimiento', 'Programa Antienvejecimiento', 'cool', null, 3),
  ('longevidad-bienestar', 'Unidad de Bienestar, Nutrición Sostenible y Longevidad', 'cool', 'Redefiniendo tu edad biológica', 4),
  ('complementarios', 'Programas Complementarios', 'cool', null, 5)
on conflict (id) do update set
  name = excluded.name,
  palette = excluded.palette,
  headline = excluded.headline,
  sort_order = excluded.sort_order;

-- Tratamientos
insert into public.treatments (id, category_id, name, summary, outcome, body_zones, sort_order) values
  ('anti-celulitis', 'no-invasivos-corporal', 'Protocolo Anti-Celulitis', 'Técnicas no invasivas para reducir la apariencia de la celulitis y acumulaciones de grasa.', 'Piel más firme y uniforme.', array['muslos', 'gluteos', 'abdomen']::text[], 0),
  ('moldeado-corporal', 'no-invasivos-corporal', 'Moldeado Corporal', 'Combinación de tecnologías para reducir grasa localizada.', null, array['abdomen', 'flancos', 'espalda']::text[], 1),
  ('limpieza-facial', 'no-invasivos-facial', 'Limpieza Facial', 'Mantén tu piel sana y libre de impurezas.', null, array['rostro-completo']::text[], 0),
  ('bioenzimas', 'no-invasivos-facial', 'Bioenzimas y Enzimas Recombinantes', 'Reafirman piel del rostro y cuello, reducen grasa en papada.', null, array['papada', 'cuello']::text[], 1),
  ('terapia-biologica', 'no-invasivos-facial', 'Terapia Biológica', 'Sueros intravenosos con vitaminas y minerales.', null, array['sistemico']::text[], 2),
  ('toxina-botulinica', 'no-invasivos-facial', 'Toxina Botulínica', 'Relaja músculos faciales para eliminar arrugas sin comprometer expresión.', null, array['frente', 'entrecejo', 'patas-de-gallo']::text[], 3),
  ('toxina-anti-sudoracion', 'no-invasivos-facial', 'Toxina Anti-Sudoración', 'Bloquea glándulas sudoríparas para controlar sudoración excesiva.', null, array['axilas', 'manos']::text[], 4),
  ('acido-hialuronico', 'no-invasivos-facial', 'Ácido Hialurónico', 'Relleno facial seguro que corrige surcos profundos y rejuvenece labios.', null, array['labios', 'surcos-naso', 'ojeras']::text[], 5),
  ('bioestimuladores', 'no-invasivos-facial', 'Bioestimuladores de Colágeno', 'Estimulan el colágeno natural rejuveneciendo la piel.', null, array['rostro-completo']::text[], 6),
  ('rejuvenecimiento-360', 'no-invasivos-facial', 'Rejuvenecimiento Facial 360', 'Mejora textura, elimina flacidez, manchas, arrugas e imperfecciones. Luce 10 años más joven, de forma no invasiva.', null, array['rostro-completo']::text[], 7),
  ('radiofrecuencia-fraccionada', 'no-invasivos-facial', 'Radiofrecuencia Fraccionada', 'Reafirma rostro y cuello.', null, array['rostro-completo', 'cuello']::text[], 8),
  ('blefaroplastia-no-invasiva', 'no-invasivos-facial', 'Blefaroplastia No Invasiva', 'Elimina exceso de piel en párpados, reduce arrugas y reafirma contorno de ojos.', null, array['parpados']::text[], 9),
  ('prp', 'no-invasivos-facial', 'Plasma Rico en Plaquetas', 'Inyección intradérmica de factores de crecimiento que restaura vitalidad cutánea.', null, array['rostro-completo', 'cuello', 'manos', 'cuero-cabelludo']::text[], 10),
  ('nutri-fol', 'implante-capilar', 'Reviá NUTRI-FOL', 'Mesoterapia multivitamínica intensiva que nutre el folículo en profundidad y da soporte metabólico y hormonal al cuero cabelludo. Un tratamiento no invasivo, pensado para caída severa o crónica.', 'Un ciclo de crecimiento más fuerte, desde la raíz.', array['cuero-cabelludo']::text[], 0),
  ('prp-capilar', 'implante-capilar', 'Plasma Rico Potenciado (PRP)', 'Plasma rico potenciado con factores de crecimiento de tu propia sangre. Mejora la vascularización del cuero cabelludo y estimula la regeneración natural del folículo, en un protocolo personalizado y no invasivo.', 'Regeneración natural, escrita en tu propia biología.', array['cuero-cabelludo']::text[], 1),
  ('foli-activ', 'implante-capilar', 'Reviá FOLI-ACTIV', 'Terapia lumínica médica (LLLT) que estimula la microcirculación del cuero cabelludo y activa el metabolismo del folículo. No invasiva, potencia los resultados de los demás tratamientos capilares.', 'Más irrigación y energía para cada folículo.', array['cuero-cabelludo']::text[], 2),
  ('plasma-boost', 'implante-capilar', 'Reviá PLASMA-BOOST', 'Plasma rico en plaquetas de alta concentración que estimula la irrigación del folículo y reactiva su fase de crecimiento. Mejora la calidad y el grosor del cabello y frena la caída activa.', 'Cabello más grueso y una caída que se detiene.', array['cuero-cabelludo']::text[], 3),
  ('regen-ex', 'implante-capilar', 'Reviá REGEN-EX', 'PRP potenciado con exosomas y células madre (Tecnología MTC) para reactivar folículos miniaturizados y potenciar la regeneración celular. Indicado en caída moderada a avanzada.', 'Densidad y vitalidad devueltas al cabello.', array['cuero-cabelludo']::text[], 4),
  ('dhi-zafiro', 'implante-capilar', 'Técnica DHI y Zafiro', 'Implante capilar directo (DHI) con micropuntas de zafiro: colocación folículo a folículo que respeta el ángulo, la dirección y la densidad natural. Cero dolor, cero cicatrices visibles y técnica sin rasurado disponible.', 'Una línea capilar que se ve —y se siente— tuya.', array['cuero-cabelludo']::text[], 5),
  ('microinjerto-fue', 'implante-capilar', 'Micro-injerto Capilar F.U.E.', 'Redistribución folicular unidad por unidad con técnica F.U.E.: microimplante pelo a pelo con diseño personalizado según tus rasgos, apoyo de cámara hiperbárica y acompañamiento post-procedimiento. Ambulatorio y no invasivo.', 'Cobertura natural, diseñada a la medida de tu rostro.', array['cuero-cabelludo']::text[], 6),
  ('densificacion-non-shaven', 'implante-capilar', 'Densificación Capilar Non-Shaven', 'Densificación capilar con técnica F.U.E. Non-Shaven, sin rapar: microimplante selectivo y preciso pensado para mujeres que buscan discreción total y continuidad en su vida profesional y social.', 'Más densidad, sin que nadie note el proceso.', array['cuero-cabelludo']::text[], 7),
  ('restauracion-barba', 'implante-capilar', 'Restauración de Barba', 'Microimplante folicular para corregir zonas despobladas de la barba con definición estética y un resultado simétrico y natural. Procedimiento ambulatorio y no invasivo.', 'Una barba densa y homogénea, con tu propio vello.', array['barba']::text[], 8),
  ('restauracion-cejas', 'implante-capilar', 'Restauración de Cejas', 'Diseño personalizado y microimplante pelo a pelo para recuperar el marco de la mirada, respetando la angulación natural de cada ceja.', 'Cejas definidas que enmarcan tu expresión.', array['cejas']::text[], 9),
  ('vitamina-c', 'antienvejecimiento', 'Terapia con Vitamina C de alta concentración', 'Antioxidante potente, protección y reparación tisular.', null, array['sistemico']::text[], 0),
  ('nad', 'antienvejecimiento', 'Terapia con NAD', 'Nicotinamida Adenina Dinucleótido. Producción de energía celular y reparación de ADN.', null, array['sistemico']::text[], 1),
  ('celulas-madre', 'antienvejecimiento', 'Células Madre', 'Potencial regenerativo para reparación tisular.', null, array['sistemico']::text[], 2),
  ('exosomas', 'antienvejecimiento', 'Exosomas', 'Señales de rejuvenecimiento al organismo.', null, array['sistemico', 'rostro-completo']::text[], 3),
  ('exomind', 'longevidad-bienestar', 'Neuro-Reset con EXOMIND', 'Estimulación magnética transcraneal. Sesiones de 25 min sin dolor, sin agujas, sin recuperación. Reduce ansiedad, mejora sueño profundo, eleva claridad mental.', null, array['sistemico']::text[], 0),
  ('fuego-y-hielo', 'longevidad-bienestar', 'Circuito de Contraste (Fuego y Hielo)', 'Sauna seco + cold plunges. Potencia dopamina y resiliencia.', null, array['sistemico']::text[], 1),
  ('flotacion', 'longevidad-bienestar', 'Cápsulas de Flotación', 'Agua ultrasaturada con sales de Epsom. Apaga el cortisol.', null, array['sistemico']::text[], 2),
  ('exilis', 'longevidad-bienestar', 'Medicina Regenerativa con Exilis', 'Terapias biológicas con exosomas + equipos de última generación.', null, array['rostro-completo']::text[], 3),
  ('caminadoras-subacuaticas', 'longevidad-bienestar', 'Caminadoras Subacuáticas', 'Resistencia del agua, protección articular al 100%.', null, array['sistemico']::text[], 4),
  ('vascular', 'complementarios', 'Portafolio Vascular en Estética', 'Diagnóstico y manejo de alteraciones vasculares por especialista en Cirugía Vascular y Angiología.', null, array['piernas']::text[], 0),
  ('sobrepeso', 'complementarios', 'Programa de Manejo de Sobrepeso y Obesidad', 'Equipo multidisciplinario para cambios sostenibles en estilo de vida.', null, array['sistemico']::text[], 1),
  ('sueno', 'complementarios', 'Programa de Sueño', 'Diagnóstico y manejo de alteraciones del sueño con expertos aliados.', null, array['sistemico']::text[], 2)
on conflict (id) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  summary = excluded.summary,
  outcome = excluded.outcome,
  body_zones = excluded.body_zones,
  sort_order = excluded.sort_order;
