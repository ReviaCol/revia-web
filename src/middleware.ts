import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Middleware — solo corre sobre /admin/* (ver matcher). Refresca la sesión de
 * Supabase y protege el panel. El resto del sitio (marketing) no se toca.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
