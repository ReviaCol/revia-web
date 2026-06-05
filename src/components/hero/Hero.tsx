import { Navbar } from "@/components/layout/Navbar";
import { ManifestoReveal } from "./ManifestoReveal";
import { Monolith } from "./Monolith";
import { ScrollHint } from "./ScrollHint";
import { SectionContinued } from "./SectionContinued";

/**
 * Hero — V4 Cinematic.
 *
 * Estructura desktop (grid 70/30):
 *   ┌──────────────────────────────┬─────────┐
 *   │ Navbar (full width)          │         │
 *   ├──────────────────────────────┤         │
 *   │ ManifestoReveal              │ Monolith│
 *   ├──────────────────────────────┤         │
 *   │ ScrollHint                   │         │
 *   └──────────────────────────────┴─────────┘
 *
 * Mobile: stack vertical, monolito oculto vía CSS.
 *
 * Sincronizado con final/desktop.html y final/motion-spec.md.
 */
export function Hero() {
  return (
    <>
      <main id="contenido"
        className="hero-grid relative z-[2] w-full min-h-screen overflow-hidden"
        data-screen-label="01 Hero · Viewport 1"
      >
        <Navbar />
        <ManifestoReveal />
        <Monolith />
        <ScrollHint />
      </main>

      <SectionContinued />
    </>
  );
}
