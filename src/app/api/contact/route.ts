import { NextResponse } from "next/server";
import { notifyNewLead } from "@/lib/notify";

/**
 * POST /api/contact — captura un lead del formulario de contacto.
 *
 * Persiste en la tabla `leads` del Supabase del cliente vía la API REST
 * (PostgREST), usando la SERVICE_ROLE key (server-only, bypassa RLS). No usamos
 * el SDK para evitar dependencias extra; la inserción es un fetch directo.
 *
 * ADR: 03-decisions/0004-crm-interno-supabase.md
 * Schema: supabase/migrations/0001_leads.sql
 *
 * La service_role key NUNCA se expone al cliente: solo se lee de process.env
 * aquí, en el servidor.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactPayload = {
  nombre?: string;
  email?: string;
  whatsapp?: string;
  servicio?: string;
  mensaje?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Recorta y limita longitud; devuelve null si queda vacío. */
function clean(value: string | undefined, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length ? trimmed : null;
}

export async function POST(request: Request) {
  let data: ContactPayload = {};
  try {
    data = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Cuerpo inválido." }, { status: 400 });
  }

  const nombre = clean(data.nombre, 120);
  const email = clean(data.email, 200);
  const whatsapp = clean(data.whatsapp, 40);
  const servicio = clean(data.servicio, 80);
  const mensaje = clean(data.mensaje, 2000);

  // Validación mínima.
  if (!nombre || !email) {
    return NextResponse.json(
      { ok: false, error: "Faltan campos obligatorios (nombre, email)." },
      { status: 422 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "El email no parece válido." },
      { status: 422 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("[contact] Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
    return NextResponse.json(
      { ok: false, error: "No pudimos enviar tu mensaje en este momento." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      // estado ('nuevo') y fuente ('web') los pone el default de la tabla.
      body: JSON.stringify({ nombre, email, whatsapp, servicio, mensaje }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[contact] Inserción en Supabase falló:", res.status, detail);
      return NextResponse.json(
        { ok: false, error: "No pudimos enviar tu mensaje en este momento." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] Error de red al insertar lead:", err);
    return NextResponse.json(
      { ok: false, error: "No pudimos enviar tu mensaje en este momento." },
      { status: 502 },
    );
  }

  // Notificación al equipo (fail-soft: nunca interrumpe la captura del lead).
  await notifyNewLead({ nombre, email, whatsapp, servicio, mensaje });

  return NextResponse.json({ ok: true });
}
