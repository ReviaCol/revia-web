-- =============================================================================
-- Reviá Web — CMS Fase 4: SEED de contenido rico por tratamiento.
-- ADR: 03-decisions/0018-cms-fase4-contenido-rico-tratamiento.md
--
-- Pegar en el SQL Editor de Supabase y ejecutar DESPUÉS de 0013. Idempotente.
--
-- CONTENIDO = PLACEHOLDER individualizado por tratamiento, derivado de su propio
-- summary/outcome ya aprobados (sin inventar cifras, dispositivos ni claims).
-- Andres + equipo médico deben VALIDAR/reemplazar desde /admin/catalogo.
--
-- Los UPDATE solo tocan filas con la columna aún NULL: re-ejecutar NO pisa
-- ediciones ya hechas en el panel. Las FAQ usan ON CONFLICT DO NOTHING.
-- =============================================================================

-- ── Rejuvenecimiento Corporal (no-invasivos-corporal) ─────────────────────────────
update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Protocolo Anti-Celulitis, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Técnicas no invasivas para reducir la apariencia de la celulitis y acumulaciones de grasa. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y cuidamos que el resultado se asiente: Piel más firme y uniforme."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Protocolo Anti-Celulitis es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: muslos, gluteos, abdomen.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Protocolo Anti-Celulitis se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'anti-celulitis';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Moldeado Corporal, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Combinación de tecnologías para reducir grasa localizada. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y ajustamos lo necesario. Los mejores resultados se cultivan, no se fuerzan."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Moldeado Corporal es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: abdomen, flancos, espalda.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Moldeado Corporal se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'moldeado-corporal';

-- ── Rejuvenecimiento Facial (no-invasivos-facial) ─────────────────────────────
update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Limpieza Facial, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Mantén tu piel sana y libre de impurezas. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y ajustamos lo necesario. Los mejores resultados se cultivan, no se fuerzan."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Limpieza Facial es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: rostro completo.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Limpieza Facial se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'limpieza-facial';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Bioenzimas y Enzimas Recombinantes, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Reafirman piel del rostro y cuello, reducen grasa en papada. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y ajustamos lo necesario. Los mejores resultados se cultivan, no se fuerzan."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Bioenzimas y Enzimas Recombinantes es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: papada, cuello.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Bioenzimas y Enzimas Recombinantes se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'bioenzimas';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Terapia Biológica, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Sueros intravenosos con vitaminas y minerales. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y ajustamos lo necesario. Los mejores resultados se cultivan, no se fuerzan."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Terapia Biológica es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: sistemico.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Terapia Biológica se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'terapia-biologica';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Toxina Botulínica, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Relaja músculos faciales para eliminar arrugas sin comprometer expresión. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y ajustamos lo necesario. Los mejores resultados se cultivan, no se fuerzan."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Toxina Botulínica es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: frente, entrecejo, patas de gallo.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Toxina Botulínica se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'toxina-botulinica';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Toxina Anti-Sudoración, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Bloquea glándulas sudoríparas para controlar sudoración excesiva. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y ajustamos lo necesario. Los mejores resultados se cultivan, no se fuerzan."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Toxina Anti-Sudoración es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: axilas, manos.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Toxina Anti-Sudoración se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'toxina-anti-sudoracion';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Ácido Hialurónico, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Relleno facial seguro que corrige surcos profundos y rejuvenece labios. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y ajustamos lo necesario. Los mejores resultados se cultivan, no se fuerzan."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Ácido Hialurónico es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: labios, surcos naso, ojeras.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Ácido Hialurónico se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'acido-hialuronico';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Bioestimuladores de Colágeno, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Estimulan el colágeno natural rejuveneciendo la piel. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y ajustamos lo necesario. Los mejores resultados se cultivan, no se fuerzan."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Bioestimuladores de Colágeno es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: rostro completo.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Bioestimuladores de Colágeno se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'bioestimuladores';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Rejuvenecimiento Facial 360, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Mejora textura, elimina flacidez, manchas, arrugas e imperfecciones. Luce 10 años más joven, de forma no invasiva. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y ajustamos lo necesario. Los mejores resultados se cultivan, no se fuerzan."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Rejuvenecimiento Facial 360 es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: rostro completo.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Rejuvenecimiento Facial 360 se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'rejuvenecimiento-360';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Radiofrecuencia Fraccionada, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Reafirma rostro y cuello. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y ajustamos lo necesario. Los mejores resultados se cultivan, no se fuerzan."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Radiofrecuencia Fraccionada es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: rostro completo, cuello.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Radiofrecuencia Fraccionada se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'radiofrecuencia-fraccionada';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Blefaroplastia No Invasiva, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Elimina exceso de piel en párpados, reduce arrugas y reafirma contorno de ojos. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y ajustamos lo necesario. Los mejores resultados se cultivan, no se fuerzan."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Blefaroplastia No Invasiva es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: parpados.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Blefaroplastia No Invasiva se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'blefaroplastia-no-invasiva';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Plasma Rico en Plaquetas, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Inyección intradérmica de factores de crecimiento que restaura vitalidad cutánea. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y ajustamos lo necesario. Los mejores resultados se cultivan, no se fuerzan."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Plasma Rico en Plaquetas es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: rostro completo, cuello, manos, cuero cabelludo.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Plasma Rico en Plaquetas se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'prp';

-- ── Unidad Capilar (implante-capilar) ─────────────────────────────
update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Reviá NUTRI-FOL, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Mesoterapia multivitamínica intensiva que nutre el folículo en profundidad y da soporte metabólico y hormonal al cuero cabelludo. Un tratamiento no invasivo, pensado para caída severa o crónica. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y cuidamos que el resultado se asiente: Un ciclo de crecimiento más fuerte, desde la raíz."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Reviá NUTRI-FOL es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: cuero cabelludo.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Reviá NUTRI-FOL se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'nutri-fol';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Plasma Rico Potenciado (PRP), escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Plasma rico potenciado con factores de crecimiento de tu propia sangre. Mejora la vascularización del cuero cabelludo y estimula la regeneración natural del folículo, en un protocolo personalizado y no invasivo. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y cuidamos que el resultado se asiente: Regeneración natural, escrita en tu propia biología."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Plasma Rico Potenciado (PRP) es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: cuero cabelludo.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Plasma Rico Potenciado (PRP) se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'prp-capilar';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Reviá FOLI-ACTIV, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Terapia lumínica médica (LLLT) que estimula la microcirculación del cuero cabelludo y activa el metabolismo del folículo. No invasiva, potencia los resultados de los demás tratamientos capilares. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y cuidamos que el resultado se asiente: Más irrigación y energía para cada folículo."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Reviá FOLI-ACTIV es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: cuero cabelludo.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Reviá FOLI-ACTIV se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'foli-activ';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Reviá PLASMA-BOOST, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Plasma rico en plaquetas de alta concentración que estimula la irrigación del folículo y reactiva su fase de crecimiento. Mejora la calidad y el grosor del cabello y frena la caída activa. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y cuidamos que el resultado se asiente: Cabello más grueso y una caída que se detiene."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Reviá PLASMA-BOOST es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: cuero cabelludo.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Reviá PLASMA-BOOST se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'plasma-boost';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Reviá REGEN-EX, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "PRP potenciado con exosomas y células madre (Tecnología MTC) para reactivar folículos miniaturizados y potenciar la regeneración celular. Indicado en caída moderada a avanzada. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y cuidamos que el resultado se asiente: Densidad y vitalidad devueltas al cabello."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Reviá REGEN-EX es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: cuero cabelludo.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Reviá REGEN-EX se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'regen-ex';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Técnica DHI y Zafiro, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Implante capilar directo (DHI) con micropuntas de zafiro: colocación folículo a folículo que respeta el ángulo, la dirección y la densidad natural. Cero dolor, cero cicatrices visibles y técnica sin rasurado disponible. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y cuidamos que el resultado se asiente: Una línea capilar que se ve —y se siente— tuya."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Técnica DHI y Zafiro es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: cuero cabelludo.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Técnica DHI y Zafiro se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'dhi-zafiro';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Micro-injerto Capilar F.U.E., escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Redistribución folicular unidad por unidad con técnica F.U.E.: microimplante pelo a pelo con diseño personalizado según tus rasgos, apoyo de cámara hiperbárica y acompañamiento post-procedimiento. Ambulatorio y no invasivo. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y cuidamos que el resultado se asiente: Cobertura natural, diseñada a la medida de tu rostro."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Micro-injerto Capilar F.U.E. es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: cuero cabelludo.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Micro-injerto Capilar F.U.E. se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'microinjerto-fue';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Densificación Capilar Non-Shaven, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Densificación capilar con técnica F.U.E. Non-Shaven, sin rapar: microimplante selectivo y preciso pensado para mujeres que buscan discreción total y continuidad en su vida profesional y social. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y cuidamos que el resultado se asiente: Más densidad, sin que nadie note el proceso."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Densificación Capilar Non-Shaven es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: cuero cabelludo.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Densificación Capilar Non-Shaven se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'densificacion-non-shaven';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Restauración de Barba, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Microimplante folicular para corregir zonas despobladas de la barba con definición estética y un resultado simétrico y natural. Procedimiento ambulatorio y no invasivo. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y cuidamos que el resultado se asiente: Una barba densa y homogénea, con tu propio vello."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Restauración de Barba es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: barba.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Restauración de Barba se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'restauracion-barba';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Valoración personalizada", "body": "Antes de iniciar Restauración de Cejas, escuchamos tu objetivo y evaluamos tu caso. Ningún protocolo empieza sin entenderte primero."}, {"title": "El tratamiento", "body": "Diseño personalizado y microimplante pelo a pelo para recuperar el marco de la mirada, respetando la angulación natural de cada ceja. Aplicamos la técnica con precisión y tiempos pensados para tu comodidad, de forma no invasiva."}, {"title": "Seguimiento", "body": "Acompañamos tu evolución y cuidamos que el resultado se asiente: Cejas definidas que enmarcan tu expresión."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Restauración de Cejas es ideal para quien busca un resultado natural y sostenido y prefiere un camino no invasivo. Trabaja especialmente sobre: cejas.", "En tu valoración te diremos con honestidad si es el camino indicado para ti o si otro protocolo se ajusta mejor a tu objetivo. La transparencia es parte del cuidado."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Restauración de Cejas se realiza con tecnología médica no invasiva. En tu valoración detallamos los equipos y protocolos específicos que se ajustan a tu caso.", "items": []}'::jsonb)
where id = 'restauracion-cejas';

-- ── Unidad de Bienestar, Nutrición Sostenible y Longevidad (longevidad-bienestar) ─────────────────────────────
update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Recepción y preparación", "body": "Llegas, respiras y te preparas para Neuro-Reset con EXOMIND. El santuario está diseñado para bajar revoluciones desde el primer minuto."}, {"title": "La experiencia", "body": "Estimulación magnética transcraneal. Sesiones de 25 min sin dolor, sin agujas, sin recuperación. Reduce ansiedad, mejora sueño profundo, eleva claridad mental. Vives la sesión guiada, con tiempos y parámetros ajustados a ti."}, {"title": "Integración", "body": "Cerramos con un momento de transición para que el efecto se asiente y te lleves la calma contigo."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Neuro-Reset con EXOMIND es para quien quiere recuperar energía, claridad y equilibrio sin procedimientos invasivos.", "En tu evaluación de longevidad definimos si es la experiencia indicada para ti o si otra se ajusta mejor a tu momento. Con honestidad, siempre."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Neuro-Reset con EXOMIND combina tecnología y protocolos de bienestar no invasivos, con parámetros ajustados a ti. Te explicamos los detalles en tu evaluación.", "items": []}'::jsonb)
where id = 'exomind';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Recepción y preparación", "body": "Llegas, respiras y te preparas para Circuito de Contraste (Fuego y Hielo). El santuario está diseñado para bajar revoluciones desde el primer minuto."}, {"title": "La experiencia", "body": "Sauna seco + cold plunges. Potencia dopamina y resiliencia. Vives la sesión guiada, con tiempos y parámetros ajustados a ti."}, {"title": "Integración", "body": "Cerramos con un momento de transición para que el efecto se asiente y te lleves la calma contigo."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Circuito de Contraste (Fuego y Hielo) es para quien quiere recuperar energía, claridad y equilibrio sin procedimientos invasivos.", "En tu evaluación de longevidad definimos si es la experiencia indicada para ti o si otra se ajusta mejor a tu momento. Con honestidad, siempre."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Circuito de Contraste (Fuego y Hielo) combina tecnología y protocolos de bienestar no invasivos, con parámetros ajustados a ti. Te explicamos los detalles en tu evaluación.", "items": []}'::jsonb)
where id = 'fuego-y-hielo';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Recepción y preparación", "body": "Llegas, respiras y te preparas para Cápsulas de Flotación. El santuario está diseñado para bajar revoluciones desde el primer minuto."}, {"title": "La experiencia", "body": "Agua ultrasaturada con sales de Epsom. Apaga el cortisol. Vives la sesión guiada, con tiempos y parámetros ajustados a ti."}, {"title": "Integración", "body": "Cerramos con un momento de transición para que el efecto se asiente y te lleves la calma contigo."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Cápsulas de Flotación es para quien quiere recuperar energía, claridad y equilibrio sin procedimientos invasivos.", "En tu evaluación de longevidad definimos si es la experiencia indicada para ti o si otra se ajusta mejor a tu momento. Con honestidad, siempre."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Cápsulas de Flotación combina tecnología y protocolos de bienestar no invasivos, con parámetros ajustados a ti. Te explicamos los detalles en tu evaluación.", "items": []}'::jsonb)
where id = 'flotacion';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Recepción y preparación", "body": "Llegas, respiras y te preparas para Medicina Regenerativa con Exilis. El santuario está diseñado para bajar revoluciones desde el primer minuto."}, {"title": "La experiencia", "body": "Terapias biológicas con exosomas + equipos de última generación. Vives la sesión guiada, con tiempos y parámetros ajustados a ti."}, {"title": "Integración", "body": "Cerramos con un momento de transición para que el efecto se asiente y te lleves la calma contigo."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Medicina Regenerativa con Exilis es para quien quiere recuperar energía, claridad y equilibrio sin procedimientos invasivos.", "En tu evaluación de longevidad definimos si es la experiencia indicada para ti o si otra se ajusta mejor a tu momento. Con honestidad, siempre."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Medicina Regenerativa con Exilis combina tecnología y protocolos de bienestar no invasivos, con parámetros ajustados a ti. Te explicamos los detalles en tu evaluación.", "items": []}'::jsonb)
where id = 'exilis';

update public.treatments set
  protocol   = coalesce(protocol,   '[{"title": "Recepción y preparación", "body": "Llegas, respiras y te preparas para Caminadoras Subacuáticas. El santuario está diseñado para bajar revoluciones desde el primer minuto."}, {"title": "La experiencia", "body": "Resistencia del agua, protección articular al 100%. Vives la sesión guiada, con tiempos y parámetros ajustados a ti."}, {"title": "Integración", "body": "Cerramos con un momento de transición para que el efecto se asiente y te lleves la calma contigo."}]'::jsonb),
  candidate  = coalesce(candidate,  '["Caminadoras Subacuáticas es para quien quiere recuperar energía, claridad y equilibrio sin procedimientos invasivos.", "En tu evaluación de longevidad definimos si es la experiencia indicada para ti o si otra se ajusta mejor a tu momento. Con honestidad, siempre."]'::jsonb),
  technology = coalesce(technology, '{"lead": "Caminadoras Subacuáticas combina tecnología y protocolos de bienestar no invasivos, con parámetros ajustados a ti. Te explicamos los detalles en tu evaluación.", "items": []}'::jsonb)
where id = 'caminadoras-subacuaticas';

-- ── FAQ por tratamiento (tabla faqs, scope = <treatment id>) ─────────────────
insert into public.faqs (scope, question, answer, sort_order) values
  ('anti-celulitis', '¿Protocolo Anti-Celulitis es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('anti-celulitis', '¿Cuántas sesiones de Protocolo Anti-Celulitis necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('anti-celulitis', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('moldeado-corporal', '¿Moldeado Corporal es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('moldeado-corporal', '¿Cuántas sesiones de Moldeado Corporal necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('moldeado-corporal', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('limpieza-facial', '¿Limpieza Facial es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('limpieza-facial', '¿Cuántas sesiones de Limpieza Facial necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('limpieza-facial', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('bioenzimas', '¿Bioenzimas y Enzimas Recombinantes es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('bioenzimas', '¿Cuántas sesiones de Bioenzimas y Enzimas Recombinantes necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('bioenzimas', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('terapia-biologica', '¿Terapia Biológica es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('terapia-biologica', '¿Cuántas sesiones de Terapia Biológica necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('terapia-biologica', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('toxina-botulinica', '¿Toxina Botulínica es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('toxina-botulinica', '¿Cuántas sesiones de Toxina Botulínica necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('toxina-botulinica', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('toxina-anti-sudoracion', '¿Toxina Anti-Sudoración es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('toxina-anti-sudoracion', '¿Cuántas sesiones de Toxina Anti-Sudoración necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('toxina-anti-sudoracion', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('acido-hialuronico', '¿Ácido Hialurónico es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('acido-hialuronico', '¿Cuántas sesiones de Ácido Hialurónico necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('acido-hialuronico', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('bioestimuladores', '¿Bioestimuladores de Colágeno es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('bioestimuladores', '¿Cuántas sesiones de Bioestimuladores de Colágeno necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('bioestimuladores', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('rejuvenecimiento-360', '¿Rejuvenecimiento Facial 360 es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('rejuvenecimiento-360', '¿Cuántas sesiones de Rejuvenecimiento Facial 360 necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('rejuvenecimiento-360', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('radiofrecuencia-fraccionada', '¿Radiofrecuencia Fraccionada es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('radiofrecuencia-fraccionada', '¿Cuántas sesiones de Radiofrecuencia Fraccionada necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('radiofrecuencia-fraccionada', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('blefaroplastia-no-invasiva', '¿Blefaroplastia No Invasiva es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('blefaroplastia-no-invasiva', '¿Cuántas sesiones de Blefaroplastia No Invasiva necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('blefaroplastia-no-invasiva', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('prp', '¿Plasma Rico en Plaquetas es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('prp', '¿Cuántas sesiones de Plasma Rico en Plaquetas necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('prp', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('nutri-fol', '¿Reviá NUTRI-FOL es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('nutri-fol', '¿Cuántas sesiones de Reviá NUTRI-FOL necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('nutri-fol', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('prp-capilar', '¿Plasma Rico Potenciado (PRP) es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('prp-capilar', '¿Cuántas sesiones de Plasma Rico Potenciado (PRP) necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('prp-capilar', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('foli-activ', '¿Reviá FOLI-ACTIV es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('foli-activ', '¿Cuántas sesiones de Reviá FOLI-ACTIV necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('foli-activ', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('plasma-boost', '¿Reviá PLASMA-BOOST es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('plasma-boost', '¿Cuántas sesiones de Reviá PLASMA-BOOST necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('plasma-boost', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('regen-ex', '¿Reviá REGEN-EX es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('regen-ex', '¿Cuántas sesiones de Reviá REGEN-EX necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('regen-ex', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('dhi-zafiro', '¿Técnica DHI y Zafiro es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('dhi-zafiro', '¿Cuántas sesiones de Técnica DHI y Zafiro necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('dhi-zafiro', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('microinjerto-fue', '¿Micro-injerto Capilar F.U.E. es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('microinjerto-fue', '¿Cuántas sesiones de Micro-injerto Capilar F.U.E. necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('microinjerto-fue', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('densificacion-non-shaven', '¿Densificación Capilar Non-Shaven es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('densificacion-non-shaven', '¿Cuántas sesiones de Densificación Capilar Non-Shaven necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('densificacion-non-shaven', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('restauracion-barba', '¿Restauración de Barba es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('restauracion-barba', '¿Cuántas sesiones de Restauración de Barba necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('restauracion-barba', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('restauracion-cejas', '¿Restauración de Cejas es un tratamiento no invasivo?', 'Sí. Como todos nuestros protocolos, trabajamos activando los procesos que tu propio cuerpo ya conoce, sin procedimientos invasivos.', 0),
  ('restauracion-cejas', '¿Cuántas sesiones de Restauración de Cejas necesito?', 'Depende de tu caso y tu objetivo. Lo definimos juntos en la valoración inicial, con expectativas honestas.', 1),
  ('restauracion-cejas', '¿Hay tiempo de recuperación?', 'La mayoría de nuestros tratamientos permiten retomar tu día con normalidad. Te explicamos los cuidados específicos según tu caso.', 2),
  ('exomind', '¿Neuro-Reset con EXOMIND requiere preparación previa?', 'Muy poca. Te damos indicaciones simples al agendar para que aproveches la sesión al máximo.', 0),
  ('exomind', '¿Con qué frecuencia se recomienda Neuro-Reset con EXOMIND?', 'Depende de tu objetivo. Lo definimos en tu evaluación de longevidad, con un plan realista y sostenible.', 1),
  ('exomind', '¿Es para mí?', 'Si buscas recuperar energía, claridad y equilibrio sin procedimientos invasivos, es muy probable que sí. Te lo confirmamos con honestidad.', 2),
  ('fuego-y-hielo', '¿Circuito de Contraste (Fuego y Hielo) requiere preparación previa?', 'Muy poca. Te damos indicaciones simples al agendar para que aproveches la sesión al máximo.', 0),
  ('fuego-y-hielo', '¿Con qué frecuencia se recomienda Circuito de Contraste (Fuego y Hielo)?', 'Depende de tu objetivo. Lo definimos en tu evaluación de longevidad, con un plan realista y sostenible.', 1),
  ('fuego-y-hielo', '¿Es para mí?', 'Si buscas recuperar energía, claridad y equilibrio sin procedimientos invasivos, es muy probable que sí. Te lo confirmamos con honestidad.', 2),
  ('flotacion', '¿Cápsulas de Flotación requiere preparación previa?', 'Muy poca. Te damos indicaciones simples al agendar para que aproveches la sesión al máximo.', 0),
  ('flotacion', '¿Con qué frecuencia se recomienda Cápsulas de Flotación?', 'Depende de tu objetivo. Lo definimos en tu evaluación de longevidad, con un plan realista y sostenible.', 1),
  ('flotacion', '¿Es para mí?', 'Si buscas recuperar energía, claridad y equilibrio sin procedimientos invasivos, es muy probable que sí. Te lo confirmamos con honestidad.', 2),
  ('exilis', '¿Medicina Regenerativa con Exilis requiere preparación previa?', 'Muy poca. Te damos indicaciones simples al agendar para que aproveches la sesión al máximo.', 0),
  ('exilis', '¿Con qué frecuencia se recomienda Medicina Regenerativa con Exilis?', 'Depende de tu objetivo. Lo definimos en tu evaluación de longevidad, con un plan realista y sostenible.', 1),
  ('exilis', '¿Es para mí?', 'Si buscas recuperar energía, claridad y equilibrio sin procedimientos invasivos, es muy probable que sí. Te lo confirmamos con honestidad.', 2),
  ('caminadoras-subacuaticas', '¿Caminadoras Subacuáticas requiere preparación previa?', 'Muy poca. Te damos indicaciones simples al agendar para que aproveches la sesión al máximo.', 0),
  ('caminadoras-subacuaticas', '¿Con qué frecuencia se recomienda Caminadoras Subacuáticas?', 'Depende de tu objetivo. Lo definimos en tu evaluación de longevidad, con un plan realista y sostenible.', 1),
  ('caminadoras-subacuaticas', '¿Es para mí?', 'Si buscas recuperar energía, claridad y equilibrio sin procedimientos invasivos, es muy probable que sí. Te lo confirmamos con honestidad.', 2)
on conflict (scope, question) do nothing;
