import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CatalogBoard } from "./_components/CatalogBoard";
import type { CategoryRow, TreatmentRow } from "./types";

export const metadata: Metadata = {
  title: "Catálogo — Panel Reviá",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminCatalogoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defensa en profundidad: además del middleware, el server component verifica.
  if (!user) redirect("/admin/login");

  // El rol authenticated ve TODO (incluidos tratamientos con visible=false).
  const [catsRes, treatsRes] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("treatments").select("*").order("sort_order", { ascending: true }),
  ]);

  const categories = (catsRes.data ?? []) as CategoryRow[];
  const treatments = (treatsRes.data ?? []) as TreatmentRow[];
  const loadError = !!catsRes.error || !!treatsRes.error;

  return (
    <CatalogBoard
      initialCategories={categories}
      initialTreatments={treatments}
      userEmail={user.email ?? ""}
      loadError={loadError}
    />
  );
}
