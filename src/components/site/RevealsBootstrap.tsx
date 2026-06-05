"use client";

import { useScrollReveals, useNavScrollState } from "@/hooks/useScrollReveals";

/**
 * RevealsBootstrap — monta los hooks de reveals + nav scroll state.
 * Pasar `homeMode` cuando estamos en la home (para que el nav cambie de
 * estado on-hero/scrolled). En interiores se pasa false y el nav queda solid.
 */
export function RevealsBootstrap({ homeMode = false }: { homeMode?: boolean }) {
  useScrollReveals();
  useNavScrollState(homeMode ? {} : { heroSelector: "__none__" });
  return null;
}
