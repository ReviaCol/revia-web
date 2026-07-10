import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CatalogBoard } from "./_components/CatalogBoard";
import type { CategoryRow, TreatmentRow, FaqRow } from "./types";

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
  const [catsRes, treatsRes, faqsRes] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("treatments").select("*").order("sort_order", { ascending: true }),
    // FAQ por tratamiento vive en faqs (scope = treatment id). Traemos todas y
    // el board filtra por scope; los scopes de página (longevidad, etc.) se ignoran.
    supabase.from("faqs").select("*").order("sort_order", { ascending: true }),
  ]);

  const categories = (catsRes.data ?? []) as CategoryRow[];
  const treatments = (treatsRes.data ?? []) as TreatmentRow[];
  const faqs = (faqsRes.data ?? []) as FaqRow[];
  const loadError = !!catsRes.error || !!treatsRes.error;

  return (
    <CatalogBoard
      initialCategories={categories}
      initialTreatments={treatments}
      initialFaqs={faqs}
      userEmail={user.email ?? ""}
      loadError={loadError}
    />
  );
}
