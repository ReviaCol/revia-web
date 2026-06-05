/**
 * Legacy wrapper — el Navbar antiguo se reemplazó por el nuevo SiteNav.
 * Re-export para que cualquier import antiguo no rompa.
 */
import { SiteNav } from "@/components/site/SiteNav";

export function Navbar() {
  return <SiteNav variant="solid" />;
}
