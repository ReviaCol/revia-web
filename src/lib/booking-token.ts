import { randomBytes, randomUUID } from "node:crypto";

/**
 * booking-token.ts — generadores de identificadores únicos para el booking.
 *
 * ADR: 03-decisions/0010-booking-pago-bold-recordatorios.md (adenda 2026-06-02)
 *
 * Server-only (usa `node:crypto`). No importar desde componentes cliente.
 *
 * - `generateBookingToken`: 20 chars URL-safe (~120 bits de entropía) para la
 *   URL pública `/reserva/[token]`. No es secreto en el sentido estricto pero
 *   debe ser no-adivinable.
 * - `generateIdempotencyKey`: UUID v4 (formato estándar) que Reviá envía a
 *   HeySetter como header `Idempotency-Key`. Se persiste en la tabla
 *   `bookings` para sobrevivir crashes y permitir reintentos seguros.
 */

/** 20 chars URL-safe (base64url de 15 bytes random). */
export function generateBookingToken(): string {
  return randomBytes(15).toString("base64url");
}

/** UUID v4 estándar (8-4-4-4-12 hex). */
export function generateIdempotencyKey(): string {
  return randomUUID();
}
