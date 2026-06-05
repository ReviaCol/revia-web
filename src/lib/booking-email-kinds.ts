/**
 * booking-email-kinds.ts — tipos compartidos entre `booking-email.ts` y
 * `booking-store.ts`. Está separado para evitar import circular y permitir
 * import desde componentes server-only sin arrastrar la lógica de Resend.
 *
 * Reviá manda 3 emails editoriales (pending, paid, cancelled). Los
 * recordatorios intermedios los cubre HeySetter por WhatsApp con plantillas
 * Meta aprobadas — no duplicamos.
 *
 * ADR: 03-decisions/0010-booking-pago-bold-recordatorios.md (adenda 2026-06-02)
 */
export type BookingEmailKind = "pending" | "paid" | "cancelled";
