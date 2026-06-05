import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { calendarIdFor, type BookingCategory } from "./booking";

/**
 * google-calendar.ts — acceso mínimo a Google Calendar para el booking de Reviá.
 *
 * Auth: una sola Service Account (ADR 0009). Se mintea un JWT RS256 con la
 * clave privada de la SA (vía `crypto` de Node, sin SDK) y se cambia por un
 * access token. La SA debe estar compartida en CADA calendario que use el
 * booking (Bibiana y Capilar) con permiso "Hacer cambios en los eventos".
 *
 * Esta lib expone API por categoría: freeBusy/insertEvent reciben la categoría
 * y resuelven internamente el calendarId vía `calendarIdFor` de booking.ts.
 *
 * Solo se importa desde route handlers (server): la clave nunca llega al cliente.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CAL_BASE = "https://www.googleapis.com/calendar/v3";
const SCOPE = "https://www.googleapis.com/auth/calendar";

export type BusyInterval = { start: string; end: string };

/**
 * Carga las credenciales de la SA desde cualquiera de los dos modos:
 *  - PREFERIDO: GOOGLE_SA_KEY_FILE = ruta absoluta al JSON descargado de Google
 *    Cloud (read-only). Evita problemas de pegado de la clave PEM en .env.
 *  - LEGADO: GOOGLE_SA_CLIENT_EMAIL + GOOGLE_SA_PRIVATE_KEY (con `\n` literales).
 *
 * Cachea el resultado por proceso. Lanza si no hay credenciales válidas.
 */
type SACreds = { clientEmail: string; privateKey: string };
let cachedCreds: SACreds | null = null;

function loadCreds(): SACreds {
  if (cachedCreds) return cachedCreds;
  const fromFile = process.env.GOOGLE_SA_KEY_FILE;
  if (fromFile) {
    const raw = readFileSync(fromFile, "utf-8");
    const parsed = JSON.parse(raw) as { client_email?: string; private_key?: string };
    if (!parsed.client_email || !parsed.private_key) {
      throw new Error("GOOGLE_SA_KEY_FILE no contiene client_email/private_key.");
    }
    cachedCreds = { clientEmail: parsed.client_email, privateKey: parsed.private_key };
    return cachedCreds;
  }
  const email = process.env.GOOGLE_SA_CLIENT_EMAIL;
  let key = (process.env.GOOGLE_SA_PRIVATE_KEY ?? "").trim();
  if (!email || !key) {
    throw new Error(
      "Faltan credenciales de la SA (define GOOGLE_SA_KEY_FILE o GOOGLE_SA_CLIENT_EMAIL+GOOGLE_SA_PRIVATE_KEY).",
    );
  }
  // Quitar comillas si quedaron.
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  // \n literal -> salto real.
  key = key.replace(/\\n/g, "\n");
  // CRLF -> LF.
  key = key.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  cachedCreds = { clientEmail: email, privateKey: key };
  return cachedCreds;
}

/**
 * ¿Está configurado el sistema de booking?
 *  - sin argumento: hay credenciales de SA + al menos un calendario.
 *  - con categoría: además, el calendarId de esa categoría está presente.
 */
export function isCalendarConfigured(category?: BookingCategory): boolean {
  const hasSA = Boolean(
    process.env.GOOGLE_SA_KEY_FILE ||
      (process.env.GOOGLE_SA_CLIENT_EMAIL && process.env.GOOGLE_SA_PRIVATE_KEY),
  );
  if (!hasSA) return false;
  if (category) return Boolean(calendarIdFor(category));
  return Boolean(
    process.env.GOOGLE_CALENDAR_ID_BIBIANA || process.env.GOOGLE_CALENDAR_ID_CAPILAR,
  );
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

/** Mintea un JWT firmado por la SA y lo cambia por un access token de Google. */
async function getAccessToken(): Promise<string> {
  const { clientEmail, privateKey } = loadCreds();

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(privateKey).toString("base64url");
  const assertion = `${unsigned}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`No se pudo obtener token de Google (${res.status}). ${detail}`);
  }
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Respuesta de Google sin access_token.");
  return json.access_token;
}

/**
 * Intervalos ocupados del calendario asociado a `category` entre timeMin y
 * timeMax (ambos ISO con offset).
 */
export async function freeBusy(
  category: BookingCategory,
  timeMin: string,
  timeMax: string,
): Promise<BusyInterval[]> {
  const calendarId = calendarIdFor(category);
  if (!calendarId) {
    throw new Error(`Falta el calendarId para la categoría "${category}".`);
  }
  const token = await getAccessToken();

  const res = await fetch(`${CAL_BASE}/freeBusy`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: calendarId }] }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`freeBusy falló (${res.status}). ${detail}`);
  }
  const json = (await res.json()) as {
    calendars?: Record<string, { busy?: BusyInterval[] }>;
  };
  return json.calendars?.[calendarId]?.busy ?? [];
}

/**
 * Crea un evento en el calendario asociado a `category`. Devuelve el id del evento.
 */
export async function insertEvent(input: {
  category: BookingCategory;
  summary: string;
  description: string;
  startISO: string;
  endISO: string;
  timeZone: string;
}): Promise<string> {
  const calendarId = calendarIdFor(input.category);
  if (!calendarId) {
    throw new Error(`Falta el calendarId para la categoría "${input.category}".`);
  }
  const token = await getAccessToken();

  const res = await fetch(
    `${CAL_BASE}/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=none`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: { dateTime: input.startISO, timeZone: input.timeZone },
        end: { dateTime: input.endISO, timeZone: input.timeZone },
      }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`No se pudo crear el evento (${res.status}). ${detail}`);
  }
  const json = (await res.json()) as { id?: string };
  return json.id ?? "";
}

/**
 * Borra un evento del calendario asociado a `category`. Idempotente: Google
 * devuelve 410 Gone si el evento ya no existe; lo tratamos como éxito.
 */
export async function deleteEvent(input: {
  category: BookingCategory;
  eventId: string;
}): Promise<void> {
  const calendarId = calendarIdFor(input.category);
  if (!calendarId) {
    throw new Error(`Falta el calendarId para la categoría "${input.category}".`);
  }
  const token = await getAccessToken();

  const res = await fetch(
    `${CAL_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(input.eventId)}?sendUpdates=none`,
    {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  // 410 = already gone (idempotente OK). 404 = no existe (idempotente OK).
  if (!res.ok && res.status !== 410 && res.status !== 404) {
    const detail = await res.text().catch(() => "");
    throw new Error(`deleteEvent falló (${res.status}). ${detail}`);
  }
}

/**
 * Actualiza solo el `summary` (título) de un evento. Usado por el cron al
 * detectar paid: quita el prefijo "Pendiente de pago —" del título.
 */
export async function updateEventSummary(input: {
  category: BookingCategory;
  eventId: string;
  summary: string;
}): Promise<void> {
  const calendarId = calendarIdFor(input.category);
  if (!calendarId) {
    throw new Error(`Falta el calendarId para la categoría "${input.category}".`);
  }
  const token = await getAccessToken();

  const res = await fetch(
    `${CAL_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(input.eventId)}?sendUpdates=none`,
    {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ summary: input.summary }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`updateEventSummary falló (${res.status}). ${detail}`);
  }
}
