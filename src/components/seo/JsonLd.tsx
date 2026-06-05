/**
 * JsonLd — renderiza un bloque <script type="application/ld+json">.
 * Server component. Acepta uno o varios objetos schema.org.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // El contenido es JSON estático construido por nosotros (no input de usuario).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
