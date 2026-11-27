import { redirect } from "next/navigation";
import { type CompanyChoice, CompanyPage } from "@/components/auth/pages";
import { authConfigured, safeNext } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** Choix de l'entreprise à la connexion (fiche core.select-company) : la base ne renvoie que les entreprises de la personne */
export default async function Page({ searchParams }: { searchParams: Promise<{ suite?: string }> }) {
  const next = safeNext((await searchParams).suite);
  if (!authConfigured) redirect("/connexion");
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/connexion");
  const { data } = await supabase
    .from("memberships")
    .select("tenant_id, tenants(legal_name, business_domain)")
    .eq("user_id", claims.claims.sub)
    .eq("is_active", true);
  const companies: CompanyChoice[] = (data ?? [])
    .map((m) => {
      const t = m.tenants as unknown as { legal_name: string; business_domain: string } | null;
      return t ? { id: m.tenant_id as string, name: t.legal_name, domain: t.business_domain } : null;
    })
    .filter((c): c is CompanyChoice => c !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
  return <CompanyPage companies={companies} next={next} />;
}
