import { redirect } from "next/navigation";

/**
 * /tratamientos/[categoria] — siempre redirige a `/tratamientos#${categoria}`.
 *
 * En el nuevo design del mockup (Claude Design 2026-06-04), todo el menú de
 * tratamientos vive en una sola página `/tratamientos` con anclas por
 * categoría (#corporal, #facial, #capilar, #antiedad, #complementarios).
 * Las rutas dinámicas `/tratamientos/[categoria]` se mantienen para que
 * cualquier link cacheado en buscadores o compartido siga funcionando, pero
 * ahora simplemente redirigen al ancla.
 *
 * Detail pages individuales por tratamiento siguen en /tratamientos/[categoria]/[slug].
 */
export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  redirect(`/tratamientos#${encodeURIComponent(categoria)}`);
}
