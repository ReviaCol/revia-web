import Link from "next/link";
import type { ConstellationZone } from "@/data/constellation-zones";

/**
 * ConstellationCard — contenido de la tarjeta de zona.
 *
 * Presentacional: el envoltorio (panel lateral en desktop, bloque expandible en
 * mobile) lo aporta quien la usa. Colores vía las vars `--c-*` del scope
 * `.constellation` (globals.css), todas dentro de la paleta del brandbook.
 */
export function ConstellationCard({
  zone,
  titleId,
}: {
  zone: ConstellationZone;
  titleId?: string;
}) {
  return (
    <>
      <div
        className="flex items-center justify-between font-body uppercase"
        style={{
          fontSize: "9px",
          letterSpacing: "0.32em",
          color: "var(--c-menta)",
          paddingBottom: "14px",
          borderBottom: "1px solid var(--c-menta-faint)",
        }}
      >
        <span>{zone.eyebrow}</span>
        <span aria-hidden="true" style={{ color: "var(--c-ink-faint)" }}>
          {zone.coord}
        </span>
      </div>

      <h3
        id={titleId}
        className="font-display m-0"
        style={{
          fontSize: "clamp(26px, 2.4vw, 30px)",
          fontWeight: 300,
          lineHeight: 1.08,
          letterSpacing: "-0.018em",
          color: "var(--c-ink)",
          margin: "18px 0 6px",
        }}
      >
        {zone.title[0]}{" "}
        <em
          className="font-display"
          style={{ fontStyle: "italic", fontWeight: 400, color: "var(--c-menta)" }}
        >
          {zone.title[1]}
        </em>
      </h3>

      <p
        className="font-body m-0"
        style={{
          fontSize: "13px",
          lineHeight: 1.55,
          color: "var(--c-ink-mute)",
          marginBottom: "18px",
        }}
      >
        {zone.sub}
      </p>

      <ul className="list-none p-0 m-0" style={{ marginBottom: "18px" }}>
        {zone.treatments.map((t) => (
          <li
            key={t.id}
            className="grid items-baseline"
            style={{
              gridTemplateColumns: "22px 1fr",
              gap: "14px",
              padding: "11px 0",
              borderTop: "1px solid rgba(217,202,193,0.16)",
            }}
          >
            <span
              className="font-body"
              style={{ fontSize: "9px", letterSpacing: "0.1em", color: "var(--c-menta)" }}
            >
              {t.num}
            </span>
            <span
              className="font-display"
              style={{ fontSize: "15px", lineHeight: 1.25, color: "var(--c-ink)" }}
            >
              {t.name}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href="/contacto"
        className="group flex items-center justify-between font-body uppercase"
        style={{
          fontSize: "11px",
          letterSpacing: "0.28em",
          color: "var(--c-menta)",
          borderTop: "1px solid var(--c-menta-faint)",
          paddingTop: "16px",
        }}
      >
        <span>Reservar valoración</span>
        <span
          aria-hidden="true"
          className="transition-transform duration-500 ease-out group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </>
  );
}
