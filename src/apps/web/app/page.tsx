import { isLayoutMode } from "@smart-collab/ui/workspace";
import { cookies } from "next/headers";
import { Workspace } from "@/components/Workspace";
import { LAYOUT_COOKIE } from "@/lib/preferences";

/** Page unique de l'application : le cadre affiche les écrans en mode Liste ou Mosaïque. */
export default async function HomePage({ searchParams }: { searchParams: Promise<{ ecran?: string }> }) {
  const store = await cookies();
  const { ecran } = await searchParams;
  const layout = store.get(LAYOUT_COOKIE)?.value;
  return (
    <Workspace
      initialMode={isLayoutMode(layout) ? layout : "list"}
      initialScreen={ecran}
      // Menu latéral ouvert ou réduit : mémorisé par shadcn/ui dans le cookie « sidebar_state »
      sidebarOpen={store.get("sidebar_state")?.value !== "false"}
    />
  );
}
