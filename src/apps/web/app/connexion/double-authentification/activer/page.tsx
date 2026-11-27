import { redirect } from "next/navigation";
import { MfaSetupPage } from "@/components/auth/pages";
import { authConfigured, safeNext } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** Activation du second facteur (fiche core.two-factor ; obligatoire pour les administrateurs en production, décision L5) */
export default async function Page({ searchParams }: { searchParams: Promise<{ suite?: string }> }) {
  const next = safeNext((await searchParams).suite);
  if (!authConfigured) redirect("/connexion");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect(`/connexion?suite=${encodeURIComponent("/connexion/double-authentification/activer")}`);
  const { data: required } = await supabase.rpc("must_enroll_mfa");
  return <MfaSetupPage next={next} required={Boolean(required)} />;
}
