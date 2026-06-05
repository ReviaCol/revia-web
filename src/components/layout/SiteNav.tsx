/**
 * Legacy wrapper — re-exporta el nuevo SiteNav del sistema Claude Design.
 * El parámetro `current` que tenía el legacy se ignora — el design nuevo
 * no usa active state visual.
 */
import { SiteNav as NewSiteNav } from "@/components/site/SiteNav";

export function SiteNav({ current }: { current?: string }) {
  void current;
  return <NewSiteNav variant="solid" />;
}
