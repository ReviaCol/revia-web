import type { BookingEmailKind } from "./booking-email-kinds";

/**
 * booking-email.ts — emails editoriales de Reviá para el ciclo de booking.
 *
 * ADR: 03-decisions/0010-booking-pago-bold-recordatorios.md (adenda 2026-06-02)
 *
 * Tres plantillas:
 *  - `sendBookingPendingPayment`: tras reservar, con link de pago + countdown.
 *  - `sendBookingPaidFinal`:       cuando HeySetter confirma el pago.
 *  - `sendBookingExpired`:         cuando expiran las 12h sin pago.
 *
 * Los recordatorios intermedios los cubre HeySetter por WhatsApp con
 * plantillas Meta aprobadas — no duplicamos en email.
 *
 * Diseño:
 *  - Editorial Reviá (cream + coffee + turquesa + tierra cálida).
 *  - Helvetica + Georgia (Jost no embedea bien en clientes de correo).
 *  - Estructura tabular para compatibilidad máxima.
 *  - Misma "shell" (letterhead + signoff) en las 3 plantillas.
 *
 * Fail-soft: si faltan `RESEND_API_KEY` o `BOOKING_FROM`, las funciones
 * `send*` devuelven `false` y NO rompen el flujo del caller.
 *
 * Compat: `sendBookingConfirmation` se conserva como alias de
 * `sendBookingPaidFinal` para no romper el /api/booking actual hasta que se
 * refactoree (siguiente paso del shipping).
 */

const RESEND_URL = "https://api.resend.com/emails";

// ─── Paleta brandbook (espejo del CSS — emails no comparten variables) ──────
const C_CREAM_50 = "#FBF6F1";     // fondo card
const C_CREAM_100 = "#F4ECE3";    // hairlines
const C_COFFEE_900 = "#59413C";   // texto principal
const C_COFFEE_700 = "#75554F";   // body / labels
const C_COFFEE_500 = "#8C513B";   // captions / acento tierra
const C_TURQUESA_700 = "#35848C"; // acento cool (eyebrow, link, hilo)

// ─── Tipografía email-safe ──────────────────────────────────────────────────
const FF_BODY = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const FF_DISPLAY = "Georgia, 'Times New Roman', serif";

// ─── Tipos de input ─────────────────────────────────────────────────────────

type CommonInput = {
  name: string;
  email: string;
  serviceName: string;       // ej "Valoración Rostro"
  whenLabel: string;         // "Jueves 5 de junio, 9:00 a.m."
};

export type PendingPaymentInput = CommonInput & {
  paymentLink: string;       // URL de checkout (Bold via HeySetter)
  trackingLink: string;      // /reserva/[token] absoluta
  amountCop: number;         // monto de la valoración
  hoursAvailable?: number;   // ventana de pago (default 12)
};

export type PaidFinalInput = CommonInput & {
  notes?: string;            // notas del paciente (si las dejó)
  slotStartIso?: string;     // ISO con offset Bogotá; gating defensivo del defer
};

export type ExpiredInput = CommonInput & {
  agendarLink: string;       // /contacto?categoria={...} absoluta
  slotStartIso?: string;     // ISO con offset Bogotá; gating defensivo del defer
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatCop(amount: number): string {
  // Intl está disponible en Node SSR.
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Envuelve el contenido en la "shell" editorial: letterhead, hairlines,
 * signoff con el manifiesto. Todas las plantillas reusan este envoltorio.
 */
function renderShell(opts: {
  title: string;             // <title> + preheader implícito
  eyebrow: string;           // "Reserva pendiente de pago"
  eyebrowColor?: string;     // default turquesa
  contentHtml: string;       // bloque principal
}): string {
  const eyebrowColor = opts.eyebrowColor ?? C_TURQUESA_700;
  return `<!DOCTYPE html>
<html lang="es"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background:${C_CREAM_50};">

        <!-- Letterhead -->
        <tr><td style="padding:40px 36px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="font-family:${FF_BODY};font-size:11px;letter-spacing:0.28em;color:${C_COFFEE_900};text-transform:uppercase;padding-bottom:2px;">
              Reviá
            </td></tr>
            <tr><td style="padding-top:6px;">
              <div style="width:28px;height:1px;background:${C_COFFEE_500};font-size:0;line-height:0;">&nbsp;</div>
            </td></tr>
          </table>
        </td></tr>

        <!-- Eyebrow -->
        <tr><td style="padding:32px 36px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="middle" style="padding-right:12px;">
                <div style="width:20px;height:1px;background:${eyebrowColor};font-size:0;line-height:0;">&nbsp;</div>
              </td>
              <td valign="middle" style="font-family:${FF_BODY};font-size:10px;letter-spacing:0.28em;color:${C_COFFEE_700};text-transform:uppercase;">
                ${escapeHtml(opts.eyebrow)}
              </td>
            </tr>
          </table>
        </td></tr>

        ${opts.contentHtml}

        <!-- Signoff -->
        <tr><td style="padding:36px 36px 40px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="padding-bottom:14px;">
              <div style="width:20px;height:1px;background:${C_COFFEE_500};font-size:0;line-height:0;">&nbsp;</div>
            </td></tr>
            <tr><td style="font-family:${FF_DISPLAY};font-size:18px;line-height:1.4;color:${C_COFFEE_900};font-style:italic;">
              Tu belleza ya existe.<br>Espera ser revelada.
            </td></tr>
            <tr><td style="padding-top:18px;font-family:${FF_BODY};font-size:10px;letter-spacing:0.24em;color:${C_COFFEE_700};text-transform:uppercase;">
              Reviá &middot; Belleza y Vitalidad
            </td></tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

/** Fila tabular "label / value" para los bloques de detalle. */
function detailRow(label: string, value: string): string {
  return `<tr>
  <td width="110" valign="top" style="font-family:${FF_BODY};font-size:10px;letter-spacing:0.18em;color:${C_COFFEE_500};text-transform:uppercase;padding:8px 12px 8px 0;">
    ${escapeHtml(label)}
  </td>
  <td valign="top" style="font-family:${FF_BODY};font-size:15px;line-height:1.45;color:${C_COFFEE_900};padding:6px 0;">
    ${value}
  </td>
</tr>`;
}

/** Hairline horizontal entre bloques. */
function hairline(): string {
  return `<tr><td style="padding:24px 36px 0;">
    <div style="height:1px;background:${C_CREAM_100};font-size:0;line-height:0;">&nbsp;</div>
  </td></tr>`;
}

/**
 * CTA primaria — patrón "bulletproof button" para que Gmail/Outlook/iOS Mail
 * respeten el color blanco del texto sobre el fondo coffee. Sin esto, Gmail
 * pisa el `color` del `<a>` con su propio "link blue" + underline, y queda
 * ilegible (caso reportado por Andres 2026-06-03).
 *
 * Trucos: bgcolor + style en TD, mso-padding-alt para Outlook, span anidado
 * con color repetido para Gmail, target="_blank" para abrir en nueva tab.
 */
function ctaButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr>
    <td align="center" valign="middle" bgcolor="${C_COFFEE_900}" style="background-color:${C_COFFEE_900};padding:18px 36px;mso-padding-alt:18px 36px;">
      <a href="${href}" target="_blank" style="font-family:${FF_BODY};font-size:13px;font-weight:600;line-height:1;letter-spacing:0.1em;text-transform:uppercase;color:${C_CREAM_50};text-decoration:none;display:inline-block;">
        <span style="color:${C_CREAM_50};text-decoration:none;">${escapeHtml(label)}&nbsp;&rarr;</span>
      </a>
    </td>
  </tr>
</table>`;
}

// ─── Plantilla 1 — pendiente de pago ────────────────────────────────────────

function renderHtmlPending(input: PendingPaymentInput): string {
  const name = escapeHtml(input.name);
  const service = escapeHtml(input.serviceName);
  const when = escapeHtml(input.whenLabel);
  const hours = input.hoursAvailable ?? 12;
  const amount = escapeHtml(formatCop(input.amountCop));

  // Estructura simplificada (2026-06-03): CTA arriba, una sola línea de body,
  // detalles compactos abajo del CTA, pie único combinando tracking +
  // WhatsApp en una línea pequeña.
  const content = `
    <!-- Headline + body en bloque tight -->
    <tr><td style="padding:18px 36px 0;">
      <h1 style="margin:0;padding:0;font-family:${FF_DISPLAY};font-weight:400;font-size:26px;line-height:1.2;color:${C_COFFEE_900};">
        Tu valoración, ${name}.
      </h1>
      <p style="margin:14px 0 0;padding:0;font-family:${FF_BODY};font-size:15px;line-height:1.6;color:${C_COFFEE_900};">
        Reservamos tu slot durante <strong style="font-weight:600;">${hours} horas</strong>.
        Confirma con el pago para apartarlo.
      </p>
    </td></tr>

    <!-- CTA prominente -->
    <tr><td style="padding:24px 36px 0;">
      ${ctaButton(input.paymentLink, "Pagar ahora")}
    </td></tr>

    <!-- Detalles compactos -->
    <tr><td style="padding:28px 36px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${detailRow("Cuándo", `<strong style="font-weight:600;">${when}</strong>`)}
        ${detailRow("Qué", service)}
        ${detailRow("Dónde", "Cra 16 # 86B-52, Bogotá")}
        ${detailRow("Valor", amount)}
      </table>
    </td></tr>

    <!-- Pie único: tracking + WhatsApp en una línea -->
    <tr><td style="padding:24px 36px 0;">
      <p style="margin:0;padding:0;font-family:${FF_BODY};font-size:12px;line-height:1.6;color:${C_COFFEE_500};">
        <a href="${input.trackingLink}" style="color:${C_TURQUESA_700};text-decoration:none;">Ver estado</a>
        &nbsp;&middot;&nbsp;
        <a href="https://wa.me/573188279094" style="color:${C_TURQUESA_700};text-decoration:none;">WhatsApp</a>
      </p>
    </td></tr>
  `;

  return renderShell({
    title: "Reserva tu valoración en Reviá",
    eyebrow: "Reserva pendiente de pago",
    eyebrowColor: C_COFFEE_500,
    contentHtml: content,
  });
}

// ─── Plantilla 2 — pago confirmado (final) ──────────────────────────────────

function renderHtmlPaid(input: PaidFinalInput): string {
  const name = escapeHtml(input.name);
  const service = escapeHtml(input.serviceName);
  const when = escapeHtml(input.whenLabel);

  const content = `
    <!-- Headline -->
    <tr><td style="padding:18px 36px 0;">
      <h1 style="margin:0;padding:0;font-family:${FF_DISPLAY};font-weight:400;font-size:28px;line-height:1.2;color:${C_COFFEE_900};">
        Hola ${name}.
      </h1>
    </td></tr>

    <!-- Body -->
    <tr><td style="padding:20px 36px 0;">
      <p style="margin:0;padding:0;font-family:${FF_BODY};font-size:15px;line-height:1.65;color:${C_COFFEE_900};">
        Tu valoración en Reviá quedó confirmada. Te esperamos para conversar sobre
        lo que buscas revelar &mdash; sin presión, con el cuidado que mereces.
      </p>
    </td></tr>

    ${hairline()}

    <!-- Detalles -->
    <tr><td style="padding:24px 36px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${detailRow("Fecha y hora", `<strong style="font-weight:600;">${when}</strong>`)}
        ${detailRow("Interés", service)}
        ${detailRow("Lugar", "Cra 16 # 86B-52, Bogotá")}
      </table>
    </td></tr>

    ${hairline()}

    <!-- Fallback contacto -->
    <tr><td style="padding:24px 36px 0;">
      <p style="margin:0;padding:0;font-family:${FF_BODY};font-size:14px;line-height:1.65;color:${C_COFFEE_700};">
        Si necesitas reprogramar, responde este correo o escríbenos por WhatsApp al
        <a href="https://wa.me/573188279094" style="color:${C_TURQUESA_700};text-decoration:none;">+57 318 827 9094</a>.
      </p>
    </td></tr>
  `;

  return renderShell({
    title: "Tu valoración en Reviá está confirmada",
    eyebrow: "Reserva confirmada",
    eyebrowColor: C_TURQUESA_700,
    contentHtml: content,
  });
}

// ─── Plantilla 3 — reserva cancelada por expiración ─────────────────────────

function renderHtmlExpired(input: ExpiredInput): string {
  const name = escapeHtml(input.name);

  const content = `
    <!-- Headline -->
    <tr><td style="padding:18px 36px 0;">
      <h1 style="margin:0;padding:0;font-family:${FF_DISPLAY};font-weight:400;font-size:28px;line-height:1.2;color:${C_COFFEE_900};">
        ${name}, tu momento sigue esperando.
      </h1>
    </td></tr>

    <!-- Body -->
    <tr><td style="padding:14px 36px 0;">
      <p style="margin:0;padding:0;font-family:${FF_BODY};font-size:15px;line-height:1.6;color:${C_COFFEE_900};">
        El plazo de pago pasó y liberamos el horario. Nuestra puerta sigue abierta
        cuando quieras volver.
      </p>
    </td></tr>

    <!-- CTA -->
    <tr><td style="padding:24px 36px 0;">
      ${ctaButton(input.agendarLink, "Agendar de nuevo")}
    </td></tr>

    <!-- Pie: WhatsApp en línea corta -->
    <tr><td style="padding:24px 36px 0;">
      <p style="margin:0;padding:0;font-family:${FF_BODY};font-size:12px;line-height:1.6;color:${C_COFFEE_500};">
        O escríbenos por <a href="https://wa.me/573188279094" style="color:${C_TURQUESA_700};text-decoration:none;">WhatsApp</a>.
      </p>
    </td></tr>
  `;

  return renderShell({
    title: "Tu reserva en Reviá no se confirmó",
    eyebrow: "Tu reserva no se confirmó",
    eyebrowColor: C_COFFEE_500,
    contentHtml: content,
  });
}

// ─── Sender genérico (Resend) ───────────────────────────────────────────────

async function sendViaResend(opts: {
  to: string;
  subject: string;
  html: string;
  scheduledAt?: string;            // ISO 8601 — si presente, Resend difiere
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM;
  if (!apiKey || !from) return false; // fail-soft

  const recipients = [opts.to];
  const clinicCopy = process.env.BOOKING_NOTIFY_TO;
  if (clinicCopy) recipients.push(clinicCopy);

  const body: Record<string, unknown> = {
    from,
    to: recipients,
    subject: opts.subject,
    html: opts.html,
  };
  if (opts.scheduledAt) body.scheduled_at = opts.scheduledAt;

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Quiet hours (defer a 07:00 Bogotá si cae en madrugada) ────────────────

// Bogotá = UTC-5 fijo (sin DST, ADR 0009). Aplicamos quiet hours sólo a los
// emails de transición (paid / cancelled), no al pending — ese es respuesta
// inmediata a una acción del usuario. Ventana 07:00-19:59 Bogotá. HeySetter
// ya respeta quiet hours en sus WhatsApp; este helper alinea nuestro lado.
const QUIET_START_HOUR = 20;          // inclusive (>= 20:00 → defer)
const QUIET_END_HOUR = 7;             // exclusive (< 07:00 → defer)
const BOGOTA_OFFSET_HOURS = 5;

/**
 * Calcula `scheduled_at` ISO para Resend, o `null` para enviar inmediato.
 *
 * Reglas:
 *  1. Si estamos fuera de quiet hours (07:00 ≤ hora < 20:00 Bogotá) → null.
 *  2. Si estamos en quiet → calcular próximo 07:00 Bogotá.
 *  3. Si `notLaterThanMs` está definido y el próximo 07:00 cae después (o
 *     igual a) ese límite → null (enviar ya, no diferir). Esto evita el
 *     caso absurdo de mandar "tu valoración está confirmada" después de
 *     la hora de la cita misma.
 *
 * Resend acepta `scheduled_at` con ISO 8601 — ver
 * https://resend.com/docs/api-reference/emails/send-email.
 */
export function deferUntilNextMorning(
  nowMs: number = Date.now(),
  notLaterThanMs?: number,
): string | null {
  // "Wall clock" Bogotá representado como Date UTC: restar 5h al instante.
  const bogotaWall = new Date(nowMs - BOGOTA_OFFSET_HOURS * 3600 * 1000);
  const hour = bogotaWall.getUTCHours();
  if (hour >= QUIET_END_HOUR && hour < QUIET_START_HOUR) return null;

  const target = new Date(bogotaWall);
  if (hour >= QUIET_START_HOUR) {
    // Avanzar al día siguiente.
    target.setUTCDate(target.getUTCDate() + 1);
  }
  // Si hour < QUIET_END_HOUR (00:00-06:59), ya estamos en el día correcto.
  target.setUTCHours(QUIET_END_HOUR, 0, 0, 0);
  // Convertir el wall-clock Bogotá de vuelta a UTC real (sumar 5h).
  const targetUtcMs = target.getTime() + BOGOTA_OFFSET_HOURS * 3600 * 1000;

  // Lógica defensiva: si el deferral haría que el email llegue después o
  // junto a la hora de la cita, mejor mandarlo ahora aunque sea madrugada.
  if (notLaterThanMs !== undefined && targetUtcMs >= notLaterThanMs) {
    return null;
  }
  return new Date(targetUtcMs).toISOString();
}

// ─── API pública ────────────────────────────────────────────────────────────

/** Email "tu reserva está pendiente de pago" (apenas reserva). */
export async function sendBookingPendingPayment(
  input: PendingPaymentInput,
): Promise<boolean> {
  return sendViaResend({
    to: input.email,
    subject: "Reserva tu valoración en Reviá — confirma con el pago",
    html: renderHtmlPending(input),
  });
}

/** Email "pago confirmado" (HeySetter notificó paid). */
export async function sendBookingPaidFinal(
  input: PaidFinalInput,
): Promise<boolean> {
  // Quiet hours: defer a 07:00 Bogotá si la transición cae en madrugada,
  // PERO no diferir si la cita es antes del envío programado.
  const apptMs = input.slotStartIso ? Date.parse(input.slotStartIso) : undefined;
  const scheduledAt = deferUntilNextMorning(Date.now(), apptMs) ?? undefined;
  return sendViaResend({
    to: input.email,
    subject: "Tu valoración en Reviá está confirmada",
    html: renderHtmlPaid(input),
    scheduledAt,
  });
}

/** Email "reserva expirada" (no pagó en 12h). */
export async function sendBookingExpired(
  input: ExpiredInput,
): Promise<boolean> {
  // Quiet hours: defer a 07:00 Bogotá si la transición cae en madrugada,
  // pero no diferir si la cita original ya pasó (es info post-mortem, OK
  // mandar a la mañana siguiente igual).
  const apptMs = input.slotStartIso ? Date.parse(input.slotStartIso) : undefined;
  const scheduledAt = deferUntilNextMorning(Date.now(), apptMs) ?? undefined;
  return sendViaResend({
    to: input.email,
    subject: "Tu reserva en Reviá no se confirmó",
    html: renderHtmlExpired(input),
    scheduledAt,
  });
}

// ─── Compat — se elimina cuando se refactorice /api/booking ────────────────

/**
 * @deprecated alias de `sendBookingPaidFinal`. El refactor del POST
 * `/api/booking` (siguiente paso) lo reemplaza por `sendBookingPendingPayment`
 * al crear la reserva. Se conserva temporalmente para no romper `tsc`.
 */
export const sendBookingConfirmation = sendBookingPaidFinal;
export type BookingEmailInput = PaidFinalInput;

// Re-export del tipo compartido para imports cómodos desde route handlers.
export type { BookingEmailKind };
