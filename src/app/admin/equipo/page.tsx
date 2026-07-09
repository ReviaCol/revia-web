import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EquipoBoard } from "./_components/EquipoBoard";
import type { MemberRow, SpecialtyRow } from "./types";

export const metadata: Metadata = {
  title: "Equipo — Panel Reviá",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminEquipoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [specRes, memRes] = await Promise.all([
    supabase.from("specialties").select("*").order("sort_order", { ascending: true }),
    supabase.from("team_members").select("*").order("sort_order", { ascending: true }),
  ]);

  return (
    <EquipoBoard
      specialties={(specRes.data ?? []) as SpecialtyRow[]}
      members={(memRes.data ?? []) as MemberRow[]}
      userEmail={user.email ?? ""}
      loadError={!!specRes.error || !!memRes.error}
    />
  );
}
