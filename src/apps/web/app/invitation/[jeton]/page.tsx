import { type InvitationView, InvitationPage } from "@/components/auth/pages";
import { createAdminClient } from "@/lib/supabase/admin";
import { authConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** Acceptation d'une invitation (fiche core.invitation) ; même message pour un lien expiré, utilisé, annulé ou faux */
export default async function Page({ params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params;
  let view: InvitationView = { state: "invalid" };
  const admin = authConfigured ? createAdminClient() : null;
  if (admin && /^[0-9a-f]{64}$/.test(jeton)) {
    const { data } = await admin.rpc("invitation_preview", { p_token: jeton });
    const inv = (data as { email: string; full_name: string; company: string; has_account: boolean }[] | null)?.[0];
    if (inv) {
      if (inv.has_account) {
        const supabase = await createClient();
        const { data: claims } = await supabase.auth.getClaims();
        const signedInAs = (claims?.claims as { email?: string } | undefined)?.email ?? null;
        view = { state: "existing", token: jeton, email: inv.email, company: inv.company, signedInAs };
      } else {
        view = { state: "new", token: jeton, email: inv.email, fullName: inv.full_name, company: inv.company };
      }
    }
  }
  return <InvitationPage view={view} />;
}
