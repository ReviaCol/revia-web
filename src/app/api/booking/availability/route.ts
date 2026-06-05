import { NextResponse } from "next/server";
import { isCalendarConfigured, freeBusy } from "@/lib/google-calendar";
import {
  generateDaySlots,
  filterFreeSlots,
  isValidBookingDate,
  isBookingCategory,
  TZ_OFFSET,
} from "@/lib/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/booking/availability?date=YYYY-MM-DD&category=rostro|cuerpo|capilar
 * Devuelve los horarios LIBRES de ese día en el calendario asociado a la
 * categoría (Bibiana para rostro/cuerpo, Capilar para capilar).
 * Fail-soft: si no hay credenciales/calendar para esa categoría, responde
 * configured:false y el cliente cae al fallback de WhatsApp.
 */
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? "";
  const category = searchParams.get("category") ?? "";

  if (!isBookingCategory(category)) {
    return NextResponse.json({ error: "Categoría no válida." }, { status: 400 });
  }
  if (!isValidBookingDate(date)) {
    return NextResponse.json({ error: "Fecha no válida." }, { status: 400 });
  }

  if (!isCalendarConfigured(category)) {
    return NextResponse.json({ configured: false, slots: [] });
  }

  try {
    const busy = await freeBusy(
      category,
      `${date}T00:00:00${TZ_OFFSET}`,
      `${date}T23:59:59${TZ_OFFSET}`,
    );
    const free = filterFreeSlots(generateDaySlots(date), busy);
    return NextResponse.json({ configured: true, slots: free.map((s) => s.time) });
  } catch {
    return NextResponse.json(
      { configured: true, slots: [], error: "No se pudo consultar la disponibilidad." },
      { status: 502 },
    );
  }
}
