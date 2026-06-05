"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * StatusPoller — invisible. Mientras el booking está `pending_payment`,
 * pollea `/api/booking/status/[token]` cada 20s. Si detecta que cambió de
 * estado (paid / cancelled), dispara `router.refresh()` para que el
 * server component vuelva a renderizar con el snapshot nuevo.
 *
 * Si la pestaña queda en background, igualmente sigue corriendo (no usamos
 * Page Visibility API para v1 — el costo es bajo).
 */
export function StatusPoller({
  token,
  initialStatus,
}: {
  token: string;
  initialStatus: "pending_payment" | "paid" | "cancelled";
}) {
  const router = useRouter();
  const stopped = useRef(false);

  useEffect(() => {
    // Estados terminales: no polleamos.
    if (initialStatus !== "pending_payment") return;

    stopped.current = false;

    const poll = async () => {
      if (stopped.current) return;
      try {
        const res = await fetch(
          `/api/booking/status/${encodeURIComponent(token)}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const data = (await res.json()) as { status?: string };
        if (stopped.current) return;
        if (data.status && data.status !== initialStatus) {
          // Transición — re-render server-side.
          router.refresh();
        }
      } catch {
        // ignore — reintentamos en el próximo tick.
      }
    };

    const id = window.setInterval(poll, 20_000);
    return () => {
      stopped.current = true;
      window.clearInterval(id);
    };
  }, [token, initialStatus, router]);

  return null;
}
