import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FaqsBoard } from "./_components/FaqsBoard";
import type { FaqRow } from "./types";

export const metadata: Metadata = {
  title: "FAQs — Panel Reviá",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("scope", { ascending: true })
    .order("sort_order", { ascending: true });

  return (
    <FaqsBoard
      faqs={(data ?? []) as FaqRow[]}
      userEmail={user.email ?? ""}
      loadError={!!error}
    />
  );
}
