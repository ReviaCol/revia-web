"use client";

import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";
import { BookingCta } from "./BookingCta";

/**
 * ContactChannels — columna derecha de /contacto.
 *
 * Tres vías visibles + mapa placeholder:
 *  - "Agendar consulta" (primario): abre el booking nativo de Reviá (Google
 *    Calendar API custom, 100% Reviá-branded) vía <BookingCta />. Ver ADR 0009.
 *  - WhatsApp Business (audiencia colombiana lo prefiere para primer contacto).
 *  - Llamar.
 *
 * Número placeholder: +57 318 827 9094 (Andres confirma/reemplaza).
 */

// wa.me con mensaje pre-llenado para agendar.
const WHATSAPP_NUMBER = "573188279094";
const QUESTION_MSG = "Hola Reviá, tengo una pregunta sobre sus tratamientos.";
const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

export function ContactChannels() {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={baseTransition}
    >
      <p
        className="font-body inline-flex items-center text-coffee-700 m-0 mb-7 uppercase"
        style={{ fontSize: "11px", letterSpacing: "0.28em", gap: "14px" }}
      >
        <span aria-hidden="true" className="block bg-accent" style={{ width: "28px", height: "1px" }} />
        Vías directas
      </p>

      {/* Agendar consulta — primario: booking nativo Reviá (Google Calendar, ADR 0009) */}
      <BookingCta />

      {/* WhatsApp + Llamar — secundarios */}
      <div className="grid gap-3 mt-3">
        <a
          href={waLink(QUESTION_MSG)}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex justify-between items-center bg-transparent text-coffee-900 border border-coffee-900/20 px-6 py-4 transition-all duration-500 ease-out hover:border-coffee-900 hover:-translate-y-0.5"
        >
          <div>
            <div
              className="font-body uppercase"
              style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em" }}
            >
              WhatsApp
            </div>
            <div className="font-body mt-1.5" style={{ fontSize: "11px", opacity: 0.7 }}>
              +57 318 827 9094
            </div>
          </div>
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-out group-hover:translate-x-2"
          >
            →
          </span>
        </a>

        <a
          href="tel:+573188279094"
          className="group flex justify-between items-center bg-transparent text-coffee-900 border border-coffee-900/20 px-6 py-4 transition-all duration-500 ease-out hover:border-coffee-900 hover:-translate-y-0.5"
        >
          <div>
            <div
              className="font-body uppercase"
              style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em" }}
            >
              Llamar
            </div>
            <div className="font-body mt-1.5" style={{ fontSize: "11px", opacity: 0.7 }}>
              +57 318 827 9094
            </div>
          </div>
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-out group-hover:translate-x-2"
          >
            →
          </span>
        </a>
      </div>

      {/* Ubicación + mapa placeholder */}
      <div className="mt-12">
        <p
          className="font-body inline-flex items-center text-coffee-700 m-0 mb-6 uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.28em", gap: "14px" }}
        >
          <span aria-hidden="true" className="block bg-accent" style={{ width: "28px", height: "1px" }} />
          Visitar
        </p>

        <p
          className="font-display text-coffee-900 m-0 mb-6"
          style={{ fontSize: "22px", lineHeight: 1.3 }}
        >
          Cra 16 # 86B-52
          <br />
          Bogotá, Colombia
        </p>

        {/* Mapa placeholder — TODO: Mapbox custom style cream/terracotta (debt.md) */}
        <div
          className="relative aspect-[4/3] border"
          style={{
            background: "var(--revia-cream-100)",
            borderColor: "rgba(89, 65, 60, 0.12)",
          }}
          role="img"
          aria-label="Ubicación de Reviá en Bogotá (placeholder de mapa)"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(89, 65, 60,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(89, 65, 60,0.06) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "var(--revia-terracotta-500)",
              boxShadow: "0 0 0 6px rgba(140, 81, 59, 0.18)",
            }}
          />
          <div
            className="absolute font-body uppercase text-coffee-500"
            style={{
              bottom: "12px",
              left: "12px",
              fontSize: "9px",
              letterSpacing: "0.2em",
              fontWeight: 500,
            }}
          >
            Mapa interactivo próximamente
          </div>
        </div>
      </div>
    </motion.div>
  );
}
