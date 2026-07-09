import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContactBoard } from "./_components/ContactBoard";
import type { ContactRow, HourRow } from "./types";

export const metadata: Metadata = {
  title: "Contacto — Panel Reviá",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const EMPTY_CONTACT: ContactRow = {
  id: "default",
  phone: "",
  whatsapp: "",
  email: "",
  street_address: "",
  address_locality: "Bogotá",
  address_region: "Bogotá D.C.",
  address_country: "CO",
  instagram_url: "",
  maps_url: "",
};

export default async function AdminContactoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [contactRes, hoursRes] = await Promise.all([
    supabase.from("site_contact").select("*").eq("id", "default").maybeSingle(),
    supabase.from("site_hours").select("*").order("weekday", { ascending: true }),
  ]);

  const contact = (contactRes.data as ContactRow | null) ?? EMPTY_CONTACT;
  const hours = (hoursRes.data ?? []) as HourRow[];
  const loadError = !!contactRes.error || !!hoursRes.error;

  return (
    <ContactBoard
      initialContact={contact}
      initialHours={hours}
      userEmail={user.email ?? ""}
      loadError={loadError}
    />
  );
}
