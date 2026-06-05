/**
 * Constantes de contacto unificadas.
 *
 * Punto único para teléfonos, WhatsApp, email e Instagram. Si cambian,
 * SOLO se actualiza aquí.
 *
 * Actualizado 2026-06-04 con los números reales de operación:
 *   - WhatsApp: +57 311 561 9394
 *   - Llamadas: +57 310 343 8833
 *   - Email principal: admin@revia.com.co
 */

const WHATSAPP_NUMBER = "573115619394";  // +57 311 561 9394
const CALL_NUMBER = "573103438833";       // +57 310 343 8833

export const CONTACT = {
  /** WhatsApp (solo dígitos, sin signo). */
  whatsappNumber: WHATSAPP_NUMBER,
  /** URL https://wa.me — append `?text=...` para mensaje pre-relleno. */
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
  /** Display humano del WhatsApp. */
  whatsappDisplay: "+57 311 561 9394",
  /** Teléfono click-to-call con signo. */
  telHref: `tel:+${CALL_NUMBER}`,
  /** Display humano del teléfono de llamadas. */
  telDisplay: "+57 310 343 8833",
  /** Email principal de contacto. */
  email: "admin@revia.com.co",
  /** Dirección física. */
  address: "Cra 16 # 86B-52, Bogotá",
  /** Handle de Instagram. */
  instagramHandle: "@reviatratamientossincirugia",
  /** URL de Instagram. */
  instagramUrl: "https://instagram.com/reviatratamientossincirugia",
} as const;

export function whatsappWithText(message: string): string {
  return `${CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
