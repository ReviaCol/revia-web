import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para componentes de navegador ("use client").
 * Usa la anon/publishable key (pública). La sesión se lee de cookies que
 * gestiona @supabase/ssr en conjunto con el cliente de servidor + middleware.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
