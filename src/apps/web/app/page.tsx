import { isLayoutMode } from "@smart-collab/ui/workspace";
import { cookies } from "next/headers";
import { Workspace } from "@/components/Workspace";
import { LAYOUT_COOKIE } from "@/lib/preferences";
import { authConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** Personne et entreprise connectées (lues dans la base, sécurité par ligne appliquée) ; null en démonstration sans connexion */
async function currentAccount() {
  if (!authConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims as { sub?: string; tenant_id?: string } | undefined;
  if (!claims?.sub || !claims.tenant_id) return null;
  const [{ data: me }, { data: company }] = await Promise.all([
    supabase.from("users").select("full_name, email").eq("id", claims.sub).maybeSingle(),
    supabase.from("tenants").select("legal_name, business_domain").eq("id", claims.tenant_id).maybeSingle(),
  ]);
  const { data: perms } = await supabase.rpc("my_permissions");
  return {
    permissions: (perms as string[] | null) ?? [],
    name: me?.full_name ?? me?.email ?? "",
    email: me?.email ?? "",
    company: company?.legal_name ?? "",
    domain: company?.business_domain ?? "",
  };
}

/** Page unique de l'application : le cadre affiche les écrans en mode Liste ou Mosaïque. */
export default async function HomePage({ searchParams }: { searchParams: Promise<{ ecran?: string }> }) {
  const store = await cookies();
  const { ecran } = await searchParams;
  const layout = store.get(LAYOUT_COOKIE)?.value;
  const account = await currentAccount();
  return (
    <Workspace
      account={account}
      // Démonstration sans connexion : tous les écrans ; sinon les droits lus dans la base
      permissions={account ? account.permissions : authConfigured ? [] : "all"}
      initialMode={isLayoutMode(layout) ? layout : "list"}
      initialScreen={ecran}
      // Menu latéral ouvert ou réduit : mémorisé par shadcn/ui dans le cookie « sidebar_state »
      sidebarOpen={store.get("sidebar_state")?.value !== "false"}
    />
  );
}
