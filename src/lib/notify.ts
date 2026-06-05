import { SITE_URL } from "@/lib/seo";
import { servicioLabel } from "@/lib/leads";

/**
 * notify.ts — notificación al equipo cuando entra un lead (F4 del ADR 0004).
 *
 * Canal: email transaccional vía Resend (REST API, sin SDK). Es "fail-soft":
 * si falta config o la API falla, se registra el error y NO se interrumpe la
 * captura del lead (el lead ya quedó guardado antes de llamar aquí).
 *
 * Env (server-only): RESEND_API_KEY, LEADS_NOTIFY_FROM, LEADS_NOTIFY_TO
 * (LEADS_NOTIFY_TO admite varios separados por coma).
 */

export type NewLead = {
  nombre: string;
  email: string;
  whatsapp: string | null;
  servicio: string | null;
  mensaje: string | null;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function notifyNewLead(lead: NewLead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEADS_NOTIFY_FROM;
  const toRaw = process.env.LEADS_NOTIFY_TO;

  if (!apiKey || !from || !toRaw) {
    console.warn(
      "[notify] Notificación de lead omitida: falta RESEND_API_KEY, LEADS_NOTIFY_FROM o LEADS_NOTIFY_TO.",
    );
    return;
  }

  const to = toRaw.split(",").map((s) => s.trim()).filter(Boolean);
  const servicio = servicioLabel(lead.servicio);
  const adminUrl = `${SITE_URL}/admin`;

  const rows: Array<[string, string]> = [
    ["Nombre", lead.nombre],
    ["Email", lead.email],
    ["WhatsApp", lead.whatsapp ?? "—"],
    ["Interés", servicio],
    ["Mensaje", lead.mensaje ?? "—"],
  ];

  const text =
    `Nuevo lead desde la web de Reviá\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nGestionar en el panel: ${adminUrl}`;

  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;color:#59413C;font-size:15px;line-height:1.6">` +
    `<p style="font-size:18px;margin:0 0 16px">Nuevo lead desde la web de Reviá</p>` +
    `<table style="border-collapse:collapse">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#8C513B">${escapeHtml(k)}</td>` +
          `<td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
      )
      .join("") +
    `</table>` +
    `<p style="margin:20px 0 0"><a href="${adminUrl}" style="color:#8C513B">Gestionar en el panel →</a></p>` +
    `</div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        // Responder en el panel/correo va directo al lead, no al remitente noreply.
        reply_to: lead.email,
        subject: `Nuevo lead: ${lead.nombre}`,
        text,
        html,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[notify] Resend respondió con error:", res.status, detail);
    }
  } catch (err) {
    console.error("[notify] Error al enviar la notificación:", err);
  }
}
