import { getTranslations } from "next-intl/server";
import { LoginPage } from "@/components/auth/pages";
import { safeNext } from "@/lib/supabase/config";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: `${t("signInTitle")} · Smart Collab` };
}

/** Écran de connexion (fiche core.login) */
export default async function Page({ searchParams }: { searchParams: Promise<{ suite?: string }> }) {
  const { suite } = await searchParams;
  return <LoginPage next={safeNext(suite)} />;
}
