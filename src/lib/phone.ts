/**
 * phone.ts — normalización de teléfonos colombianos a E.164.
 *
 * HeySetter requiere E.164 (`+57...`). El widget acepta cualquier formato
 * que tipee el paciente; este helper lo normaliza best-effort. Si no
 * podemos inferir el formato, devolvemos el texto original (HeySetter
 * rechazará con `invalid_phone` y mostramos el error específico al usuario).
 *
 * Server-only (sin red, sin deps).
 *
 * ADR: 03-decisions/0010-booking-pago-bold-recordatorios.md (adenda 2026-06-02)
 */

/**
 * Reglas (en orden):
 *   1. Si arranca con `+` después de trim, lo dejamos (asumimos E.164).
 *   2. Si arranca con `57` y tiene 11 o 12 dígitos, prependeamos `+`.
 *   3. Si tiene 10 dígitos y arranca con `3`, prependeamos `+57`.
 *   4. Si nada matchea, devolvemos el trim original.
 */
export function normalizeColombianPhone(raw: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/[\s\-()]/g, "");
  if (digits.startsWith("+")) return digits;
  if (
    digits.startsWith("57") &&
    (digits.length === 11 || digits.length === 12)
  ) {
    return `+${digits}`;
  }
  if (digits.length === 10 && digits.startsWith("3")) {
    return `+57${digits}`;
  }
  return trimmed;
}
