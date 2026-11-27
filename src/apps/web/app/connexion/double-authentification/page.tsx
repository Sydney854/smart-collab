import { MfaVerifyPage } from "@/components/auth/pages";
import { safeNext } from "@/lib/supabase/config";

/** Second facteur à la connexion (fiche core.two-factor) */
export default async function Page({ searchParams }: { searchParams: Promise<{ suite?: string }> }) {
  return <MfaVerifyPage next={safeNext((await searchParams).suite)} />;
}
