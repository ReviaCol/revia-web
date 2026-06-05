/**
 * Estado de carga global (App Router). Se muestra durante navegación/suspense.
 * Minimalista y de marca; respeta el fondo cream.
 */
export default function Loading() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "62vh" }}
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Cargando…</span>
      <span
        aria-hidden="true"
        className="font-display text-coffee-700"
        style={{ fontSize: "22px", letterSpacing: "0.06em", opacity: 0.6 }}
      >
        reviá
      </span>
    </div>
  );
}
