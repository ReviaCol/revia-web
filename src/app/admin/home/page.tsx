import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HomeBoard } from "./_components/HomeBoard";
import type { HomePatch } from "./actions";

export const metadata: Metadata = {
  title: "Home — Panel Reviá",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const EMPTY: HomePatch = {
  hero_line1: "",
  hero_line2: "",
  hero_subtitle: "",
  manifesto_eyebrow: "Manifiesto",
  manifesto_line1: "",
  manifesto_line2: "",
};

export default async function AdminHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("home_content")
    .select("hero_line1,hero_line2,hero_subtitle,manifesto_eyebrow,manifesto_line1,manifesto_line2")
    .eq("id", "default")
    .maybeSingle();

  return (
    <HomeBoard
      initial={(data as HomePatch | null) ?? EMPTY}
      userEmail={user.email ?? ""}
      loadError={!!error}
    />
  );
}
