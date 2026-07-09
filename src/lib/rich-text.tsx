import { Fragment, type ReactNode } from "react";

/**
 * rich-text.tsx — mini-render de énfasis para copy editable (CMS Fase 2).
 * Convención: *texto* → <em>texto</em>. Sin HTML crudo (seguro contra inyección).
 * Emite <em> "pelado" para que herede el CSS existente de cada superficie
 * (.hero h1 em, .manifesto em, etc.), manteniendo la itálica/estilo de marca.
 */
export function renderEmphasis(text: string): ReactNode {
  const parts = text.split(/\*([^*]+)\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>,
  );
}
