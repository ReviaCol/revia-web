/**
 * nav-items.ts — fuente única de la navegación principal de Reviá.
 *
 * Consumida por SiteNav (páginas dedicadas) y Navbar (hero de la home) para no
 * volver a duplicar el array de items (ver debt.md, fila "Navbar mega-menús").
 *
 * El sitemap (00-context/sitemap.md, "Navegación principal") define 5 items con
 * dos mega-menús: Tratamientos y Longevidad. Cada item con mega-menú es navegable
 * por sí mismo (su `href` es el hub) y además abre un panel con `menu`.
 *
 * `tone` controla el shift cromático del panel desktop: "warm" (cream/coffee) o
 * "cool" (sky/deepblue) para separar el universo Longevidad sin romper la nav.
 */

export type NavLeaf = {
  href: string;
  label: string;
};

export type NavItem = {
  href: string;
  label: string;
  /** Etiqueta del enlace al hub dentro del panel (cuando hay mega-menú). */
  overviewLabel?: string;
  /** Sub-enlaces del mega-menú. Si está vacío/ausente, es un item plano. */
  menu?: NavLeaf[];
  /** Universo cromático del panel desktop. */
  tone?: "warm" | "cool";
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/filosofia", label: "Filosofía" },
  {
    href: "/tratamientos",
    label: "Tratamientos",
    overviewLabel: "Ver todos los tratamientos",
    tone: "warm",
    menu: [
      { href: "/tratamientos/corporal", label: "Corporal" },
      { href: "/tratamientos/facial", label: "Facial" },
      { href: "/implante-capilar", label: "Implante Capilar" },
      { href: "/antienvejecimiento", label: "Antienvejecimiento" },
    ],
  },
  {
    href: "/longevidad",
    label: "Longevidad",
    overviewLabel: "Conocer la Unidad de Bienestar",
    tone: "cool",
    menu: [
      { href: "/longevidad/exomind", label: "EXOMIND" },
      { href: "/longevidad/fuego-y-hielo", label: "Contraste" },
      { href: "/longevidad/flotacion", label: "Flotación" },
      { href: "/longevidad/membresias", label: "Membresías VIP" },
      { href: "/longevidad#pilares", label: "6 Pilares" },
    ],
  },
  { href: "/equipo", label: "Equipo" },
  { href: "/contacto", label: "Contacto" },
] as const;
