import Image from "next/image";
import { getTeamMembers, type TeamMember } from "@/lib/equipo";

/**
 * EquipoMedicos — grid editorial de médicos para /nosotros#equipo (CMS Fase 3).
 * ADR: 03-decisions/0017-cms-fase3-equipo-storage.md
 *
 * Server component: lee getTeamMembers() (anon → RLS visible=true). Si no hay
 * médicos visibles, NO renderiza nada (la sección queda con solo especialidades).
 * Reveals con el sistema del sitio (data-rev/data-delay), NO motion/react, para
 * mantener coherencia con el resto de /nosotros. Foto vía next/image; sin foto,
 * placeholder peach + hairline (mismo lenguaje que el brochure).
 */
export async function EquipoMedicos() {
  const members = await getTeamMembers();
  if (members.length === 0) return null;

  return (
    <div
      className="equipo-medicos"
      style={{
        marginTop: "clamp(48px,5vw,80px)",
        display: "grid",
        gap: "clamp(32px,3.6vw,52px) clamp(24px,2.6vw,40px)",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      }}
    >
      {members.map((m, i) => (
        <MemberCard key={m.id} member={m} delay={i * 80} />
      ))}
    </div>
  );
}

function MemberCard({ member, delay }: { member: TeamMember; delay: number }) {
  return (
    <article data-rev="up" data-delay={String(delay)}>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 5",
          overflow: "hidden",
          marginBottom: "20px",
          background: "var(--revia-peach-200)",
        }}
      >
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={`${member.name}, ${member.specialty}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(89,65,60,0.08) 0, rgba(89,65,60,0.08) 1px, transparent 1px, transparent 14px)",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "12px",
                left: "12px",
                width: "28px",
                height: "1px",
                background: "var(--revia-coffee-700)",
                opacity: 0.35,
              }}
            />
          </>
        )}
      </div>

      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          color: "var(--ink-900)",
          margin: 0,
          fontSize: "clamp(22px,2vw,26px)",
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
        }}
      >
        {member.name}
      </h3>

      {member.specialty && (
        <p
          style={{
            margin: "8px 0 0",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--ink-500)",
          }}
        >
          {member.specialty}
        </p>
      )}

      {member.credentials.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0", display: "grid", gap: "4px" }}>
          {member.credentials.map((c) => (
            <li key={c} style={{ fontSize: "13px", lineHeight: 1.5, color: "var(--ink-700)" }}>
              {c}
            </li>
          ))}
        </ul>
      )}

      {member.quote && (
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--ink-900)",
            opacity: 0.85,
            margin: "20px 0 0",
            fontSize: "16px",
            lineHeight: 1.45,
          }}
        >
          &ldquo;{member.quote}&rdquo;
        </p>
      )}
    </article>
  );
}
