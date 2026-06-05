import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LeadsBoard } from "./_components/LeadsBoard";
import type { Lead } from "@/lib/leads";

export const metadata: Metadata = {
  title: "Leads — Panel Reviá",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defensa en profundidad: además del middleware, el server component verifica.
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const leads = (data ?? []) as Lead[];

  return (
    <LeadsBoard
      initialLeads={leads}
      userEmail={user.email ?? ""}
      loadError={!!error}
    />
  );
}
