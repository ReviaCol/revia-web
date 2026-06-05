import { redirect } from "next/navigation";

/** /equipo se unificó con /filosofia bajo /nosotros (2026-06-04). */
export default function EquipoRedirect() {
  redirect("/nosotros#equipo");
}
