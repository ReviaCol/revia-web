"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { duration, easing } from "@/lib/motion-tokens";
import { MEMBERS, type TeamMember } from "@/data/team";

/**
 * TeamGrid — grid editorial de bios. Lee de src/data/team.ts.
 * Sin foto editorial real: placeholder peach + hairline ornament (sin caption).
 */
export function TeamGrid() {
  return (
    <section
      aria-label="Médicos y especialistas"
      className="relative z-[2]"
      style={{ padding: "0 var(--gutter) var(--section-y-tight)" }}
    >
      <motion.div
        className="equipo-grid grid gap-x-8 gap-y-14"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {MEMBERS.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </motion.div>
    </section>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  const baseTransition = { duration: duration.long, ease: easing.outExpo };

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: baseTransition },
      }}
    >
      <div
        className="relative w-full overflow-hidden mb-5"
        style={{ aspectRatio: "4 / 5", background: "var(--revia-peach-200)" }}
      >
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`${member.name}, ${member.specialty}`}
            fill
            sizes="(max-width: 860px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(89, 65, 60,0.08) 0, rgba(89, 65, 60,0.08) 1px, transparent 1px, transparent 14px)",
              }}
            />
            <span
              aria-hidden="true"
              className="absolute block"
              style={{
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

      <h2
        className="font-display font-normal text-coffee-900 m-0"
        style={{ fontSize: "clamp(22px, 2vw, 26px)", lineHeight: 1.15, letterSpacing: "-0.01em" }}
      >
        {member.name}
      </h2>

      <p
        className="font-body uppercase text-terracotta-600 m-0 mt-2"
        style={{ fontSize: "11px", letterSpacing: "0.16em", fontWeight: 500 }}
      >
        {member.specialty}
      </p>

      <ul className="list-none p-0 m-0 mt-4 grid gap-1">
        {member.credentials.map((c) => (
          <li
            key={c}
            className="font-body text-coffee-700"
            style={{ fontSize: "13px", lineHeight: 1.5 }}
          >
            {c}
          </li>
        ))}
      </ul>

      {member.quote && (
        <p
          className="font-display text-coffee-900 m-0 mt-5"
          style={{
            fontSize: "16px",
            lineHeight: 1.45,
            fontStyle: "italic",
            fontWeight: 300,
            opacity: 0.85,
          }}
        >
          &ldquo;{member.quote}&rdquo;
        </p>
      )}
    </motion.article>
  );
}
