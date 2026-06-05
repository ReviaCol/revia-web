"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Countdown — tiempo restante hasta expiresAt. Tick cada 30s.
 *
 * A11y: el contenido vive dentro de un span aria-live="polite" para que
 * los lectores de pantalla anuncien el cambio.
 */
export function Countdown({ expiresAt }: { expiresAt: string }) {
  const targetMs = useMemo(() => new Date(expiresAt).getTime(), [expiresAt]);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, targetMs - now);
  let text: string;
  if (remainingMs === 0) {
    text = "el plazo expiró";
  } else {
    const hours = Math.floor(remainingMs / 3_600_000);
    const minutes = Math.floor((remainingMs % 3_600_000) / 60_000);
    text = hours >= 1 ? `${hours}h ${minutes}m` : `${minutes} min`;
  }

  return (
    <span aria-live="polite" aria-atomic="true">
      {text}
    </span>
  );
}
