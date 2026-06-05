import { redirect } from "next/navigation";

/** /filosofia se unificó con /equipo bajo /nosotros (2026-06-04). */
export default function FilosofiaRedirect() {
  redirect("/nosotros#filosofia");
}
