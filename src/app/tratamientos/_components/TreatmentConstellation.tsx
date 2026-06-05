"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { duration, easing, stagger } from "@/lib/motion-tokens";
import {
  CONSTELLATION_MAPS,
  toRoman,
  type ConstellationMode,
  type ConstellationZone,
} from "@/data/constellation-zones";
import { ConstellationCard } from "./ConstellationCard";

/**
 * TreatmentConstellation — "Carta celeste" de /tratamientos.
 *
 * Mapa tipo constelación de zonas de tratamiento con toggle Rostro / Cuerpo.
 * Reemplaza el antiguo hero + BodyExplorer (ver ADR 0007). Sección oscura
 * contenida; el resto de la página sigue cream.
 *
 * - Desktop (≥1280px): constelación SVG inline; hover/foco/clic en una estrella
 *   revela la tarjeta lateral.
 * - Mobile/tablet (<1280px): grilla vertical de 6 tarjetas tappables (tap →
 *   expande inline).
 *
 * A11y: cada estrella es operable por teclado (Tab + Enter/Espacio) con foco
 * visible. Motion respeta prefers-reduced-motion vía MotionConfig; las
 * animaciones CSS (twinkle/sweep) llevan fallback en globals.css.
 */

const containerV: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger.base, delayChildren: 0.12 } },
};

const starV: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.medium, ease: easing.outExpo } },
};

const lineV: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.long, ease: easing.outExpo } },
};

const cardPanelV: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.medium, ease: easing.outExpo },
  },
  exit: { opacity: 0, y: 12, transition: { duration: duration.short, ease: easing.outExpo } },
};

/* Estrellas ambientales — generadas con PRNG sembrado (estable SSR↔cliente). */
type Ambient = {
  id: number; size: number; left: number; top: number; op: number; dur: number; delay: number;
};
function makeAmbient(count: number): Ambient[] {
  let s = 1337;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: +(rnd() * 1.6 + 0.4).toFixed(2),
    left: +(rnd() * 100).toFixed(2),
    top: +(rnd() * 100).toFixed(2),
    op: +(rnd() * 0.5 + 0.15).toFixed(2),
    dur: +(2 + rnd() * 4).toFixed(1),
    delay: +(rnd() * 3).toFixed(1),
  }));
}
const AMBIENT = makeAmbient(70);

/* ── Estrella (desktop SVG) ──────────────────────────────────────────── */

function Star({
  zone,
  active,
  pinned,
  onActivate,
  onHover,
  onLeave,
}: {
  zone: ConstellationZone;
  active: boolean;
  pinned: boolean;
  onActivate: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  const dx = zone.anchor === "end" ? -36 : 36;
  const lx = zone.x + dx;
  const ring = "rgba(169,217,212,0.22)";
  return (
    <motion.g
      variants={starV}
      className={`const-star${active ? " is-active" : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={pinned}
      aria-label={`Zona ${zone.starLabel}: ${zone.title[0]} ${zone.title[1]}. ${zone.treatments.length} tratamientos.`}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
    >
      <circle cx={zone.x} cy={zone.y} r={80} fill="transparent" />
      <circle className="const-halo" cx={zone.x} cy={zone.y} r={150} fill="url(#const-halo)" />
      <circle cx={zone.x} cy={zone.y} r={34} fill="none" stroke={ring} strokeWidth={0.5} />
      <circle cx={zone.x} cy={zone.y} r={18} fill="none" stroke={ring} strokeWidth={0.4} />
      <circle
        className={`const-star-main const-tw-${zone.tw}`}
        cx={zone.x}
        cy={zone.y}
        r={3.8}
        fill="#D9CAC1"
      />
      <text
        className="const-label"
        x={lx}
        y={zone.y - 8}
        fontSize={zone.labelSize}
        textAnchor={zone.anchor}
      >
        {zone.starLabel}
      </text>
      <text className="const-num" x={lx} y={zone.y + 16} textAnchor={zone.anchor}>
        {zone.num}
      </text>
      <text className="const-anatomy" x={lx} y={zone.y + 34} textAnchor={zone.anchor}>
        {zone.anatomy}
      </text>
    </motion.g>
  );
}

/* ── Componente principal ────────────────────────────────────────────── */

export function TreatmentConstellation({
  initialMode = "rostro",
}: {
  initialMode?: ConstellationMode;
}) {
  const [mode, setMode] = useState<ConstellationMode>(initialMode);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const map = CONSTELLATION_MAPS[mode];
  const activeId = hovered ?? pinned;
  const activeZone = map.zones.find((z) => z.id === activeId) ?? null;

  function switchMode(m: ConstellationMode) {
    if (m === mode) return;
    setPinned(null);
    setHovered(null);
    setMode(m);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("modo", m);
      window.history.replaceState(null, "", url.toString());
    }
  }

  function activate(id: string) {
    setTouched(true);
    setPinned((p) => (p === id ? null : id));
  }

  const zoneCount = toRoman(map.zoneCount);
  const treatmentCount = toRoman(map.treatmentCount);

  return (
    <section
      className="constellation relative overflow-hidden"
      aria-labelledby="constellation-heading"
      style={{ background: "var(--c-bg)" }}
    >
      {/* Marco de esquinas decorativo */}
      <div className="const-corners" aria-hidden="true">
        <span className="const-corner tl" />
        <span className="const-corner tr" />
        <span className="const-corner bl" />
        <span className="const-corner br" />
      </div>

      {/* Estrellas ambientales */}
      <div className="const-ambient" aria-hidden="true">
        {AMBIENT.map((a) => (
          <span
            key={a.id}
            className="const-a"
            style={{
              width: `${a.size}px`,
              height: `${a.size}px`,
              left: `${a.left}%`,
              top: `${a.top}%`,
              opacity: a.op,
              animationDuration: `${a.dur}s`,
              animationDelay: `${a.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Barra superior: marca · toggle · meta */}
      <div className="const-topbar">
        <span
          className="font-display"
          style={{ fontSize: "18px", fontWeight: 300, letterSpacing: "-0.01em", color: "var(--c-ink)" }}
        >
          Reviá
        </span>

        <div className="const-toggle" role="group" aria-label="Cambiar entre rostro y cuerpo">
          {(["rostro", "cuerpo"] as const).map((m) => (
            <button
              key={m}
              type="button"
              className={mode === m ? "is-active" : ""}
              aria-pressed={mode === m}
              onClick={() => switchMode(m)}
            >
              {m === "rostro" ? "Rostro" : "Cuerpo"}
            </button>
          ))}
        </div>

        <div className="const-meta" aria-hidden="true">
          <div>
            <span className="num">{zoneCount}</span> · zonas
          </div>
          <div>
            <span className="num">{treatmentCount}</span> · tratamientos
          </div>
          <div className="coord-line">{map.metaCoord}</div>
        </div>
      </div>

      {/* Bloque de título (overlay izquierdo en desktop, estático en mobile) */}
      <div className="const-title">
        <div>
          <p className="const-eyebrow">{map.eyebrow}</p>
          <motion.h1
            id="constellation-heading"
            className="const-headline font-display"
            key={`h-${mode}`}
            initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: duration.long, ease: easing.outExpo }}
          >
            {map.headline.map((seg, i) => (
              <span key={i}>
                {seg.em ? (
                  <em className="const-em font-display">{seg.t}</em>
                ) : (
                  seg.t
                )}
                {seg.br ? <br /> : null}
              </span>
            ))}
          </motion.h1>
          <p className="const-sub font-body">{map.headSub}</p>
        </div>
        <p className="const-foot">
          Reviá Institutum
          <br />
          {mode === "rostro" ? "Vol. I · MMXXVI" : "Vol. II · MMXXVI"}
        </p>
      </div>

      {/* ── Desktop: constelación SVG ── */}
      <div className="const-stage">
        <div key={`sweep-${mode}`} className="const-sweep" aria-hidden="true" />

        <svg
          className="const-canvas"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="const-halo">
              <stop offset="0%" stopColor="#4EA6A6" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#4EA6A6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#4EA6A6" stopOpacity="0" />
            </radialGradient>
          </defs>

          <motion.g key={`g-${mode}`} variants={containerV} initial="hidden" animate="visible">
            {map.lines.map(([a, b, style], i) => {
              const za = map.zones[a];
              const zb = map.zones[b];
              const midX = (za.x + zb.x) / 2;
              const midY = (za.y + zb.y) / 2 - 30;
              return (
                <motion.path
                  key={`l-${i}`}
                  variants={lineV}
                  className={`const-line${style === "dash" ? " const-line--dash" : ""}`}
                  d={`M ${za.x},${za.y} Q ${midX},${midY} ${zb.x},${zb.y}`}
                />
              );
            })}
            {map.zones.map((zone) => (
              <Star
                key={zone.id}
                zone={zone}
                active={activeId === zone.id}
                pinned={pinned === zone.id}
                onActivate={() => activate(zone.id)}
                onHover={() => {
                  setTouched(true);
                  setHovered(zone.id);
                }}
                onLeave={() => setHovered(null)}
              />
            ))}
          </motion.g>
        </svg>

        {/* Tarjeta lateral */}
        <AnimatePresence>
          {activeZone ? (
            <motion.aside
              key={activeZone.id}
              className="const-card"
              variants={cardPanelV}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-labelledby="const-card-title"
              onMouseEnter={() => setHovered(activeZone.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <ConstellationCard zone={activeZone} titleId="const-card-title" />
            </motion.aside>
          ) : null}
        </AnimatePresence>

        <p className="const-coords" aria-hidden="true">
          {map.coords}
        </p>

        <p className={`const-helper${touched ? " is-hidden" : ""}`} aria-hidden="true">
          <span className="const-pulse" />
          pasea por una estrella
        </p>
      </div>

      {/* ── Mobile/tablet: grilla de 6 tarjetas tappables ── */}
      <ul className="const-mobile list-none p-0 m-0">
        {map.zones.map((zone) => {
          const open = pinned === zone.id;
          return (
            <li key={zone.id} className="const-mobile-item">
              <button
                type="button"
                className="const-mobile-trigger"
                aria-expanded={open}
                aria-controls={`m-panel-${zone.id}`}
                onClick={() => activate(zone.id)}
              >
                <span className="const-mobile-label font-display">{zone.starLabel}</span>
                <span className="const-mobile-num font-body">{zone.num}</span>
                <span aria-hidden="true" className={`const-mobile-chevron${open ? " is-open" : ""}`}>
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    id={`m-panel-${zone.id}`}
                    className="const-mobile-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: duration.medium, ease: easing.outExpo }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="const-mobile-panel-inner">
                      <ConstellationCard zone={zone} />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
