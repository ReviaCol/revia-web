"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";
import { CONTACT } from "@/lib/contact";

/**
 * ContactCTA — sección 05 de la home.
 * Cierre con 3 vías de contacto: agendar, WhatsApp, llamar. CTA hacia /contacto.
 */

const CONTACT_OPTIONS = [
  {
    title: "Agendar consulta",
    sub: "Reserva en línea · 30 min",
    href: "/contacto",
    primary: true,
  },
  {
    title: "WhatsApp",
    sub: CONTACT.telDisplay,
    href: CONTACT.whatsappUrl,
    primary: false,
    external: true,
  },
  {
    title: "Llamar",
    sub: CONTACT.telDisplay,
    href: CONTACT.telHref,
    primary: false,
    external: true,
  },
] as const;

export function ContactCTA() {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <section
      id="contacto"
      aria-labelledby="contact-heading"
      className="relative z-[2]"
      style={{ padding: "var(--section-y) var(--gutter)" }}
    >
      <div className="home-split grid gap-14 items-start">
        <div className="max-w-[560px]">
          <motion.p
            className="font-body inline-flex items-center text-coffee-700 m-0 mb-9 uppercase"
            style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px" }}
            initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={baseTransition}
          >
            <span aria-hidden="true" className="block bg-accent" style={{ width: "28px", height: "1px" }} />
            Contacto
          </motion.p>

          <motion.h2
            id="contact-heading"
            className="font-display font-medium text-coffee-900 m-0"
            style={{
              fontSize: "clamp(40px, 5vw, 60px)",
              lineHeight: 1.05,
              letterSpacing: "-0.012em",
            }}
            initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.12 }}
          >
            El primer paso<br />es una conversación.
          </motion.h2>

          <motion.p
            className="font-body text-coffee-700 m-0 mt-6"
            style={{ fontSize: "16px", lineHeight: 1.6, maxWidth: "420px" }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...baseTransition, delay: 0.24 }}
          >
            Cuéntanos qué buscas revelar.
          </motion.p>

          <div className="flex flex-col gap-3 mt-10">
            {CONTACT_OPTIONS.map((opt, i) => {
              const isExternal = "external" in opt && opt.external;
              const className = `group flex justify-between items-center px-6 py-4 transition-all duration-500 ease-out hover:-translate-y-0.5 ${
                opt.primary
                  ? "bg-coffee-900 text-cream-50 hover:bg-coffee-700"
                  : "bg-transparent text-coffee-900 border border-coffee-900/20 hover:border-coffee-900"
              }`;
              const inner = (
                <>
                  <div>
                    <div
                      className="font-body uppercase"
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {opt.title}
                    </div>
                    <div
                      className="font-body mt-1.5"
                      style={{ fontSize: "11px", opacity: 0.7 }}
                    >
                      {opt.sub}
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-500 ease-out group-hover:translate-x-2"
                  >
                    →
                  </span>
                </>
              );

              return (
                <motion.div
                  key={opt.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    ...baseTransition,
                    delay: 0.36 + i * 0.12,
                  }}
                >
                  {isExternal ? (
                    <a
                      href={opt.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link href={opt.href} className={className}>
                      {inner}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...baseTransition, delay: 0.4 }}
        >
          <p
            className="font-body inline-flex items-center text-coffee-700 m-0 mb-6 uppercase"
            style={{ fontSize: "12px", letterSpacing: "0.2em", gap: "14px" }}
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
              aria-hidden="true"
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
            <span
              aria-hidden="true"
              className="absolute block"
              style={{
                bottom: "12px",
                left: "12px",
                width: "36px",
                height: "1px",
                background: "var(--revia-coffee-500)",
                opacity: 0.35,
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
