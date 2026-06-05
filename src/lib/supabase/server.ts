import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase para Server Components / route handlers.
 * Lee y escribe la sesión vía cookies de Next (async en Next 16).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          // En Server Components puros, setAll puede lanzar (no se pueden
          // escribir cookies). Lo envolvemos: el refresh de sesión real ocurre
          // en el middleware. Aquí es seguro ignorar.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // no-op: ver comentario arriba.
          }
        },
      },
    },
  );
}
