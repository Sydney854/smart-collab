"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { safeNext } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { requestInfo } from "./request-info";

/**
 * Actions serveur de connexion (lot 1, étape 2 ; fiches core.login, core.two-factor, core.select-company, core.invitation).
 * Règles : message d'erreur unique (on ne dit jamais si l'e-mail existe) ; verrouillage après 5 échecs en 15 min
 * (décision Q5a), échecs du second facteur compris ; chaque connexion réussie ou échouée est inscrite au journal des accès.
 */

export type AuthResult = { codes?: string[]; error?: "invalid" | "unavailable" | "config" | "expired" | "otherEmail" | "code" | "noCompany"; redirect?: string };

const credentials = z.object({ email: z.string().trim().toLowerCase().email().max(254), password: z.string().min(1).max(200) });
const MIN_PASSWORD = 10;

type Admin = NonNullable<ReturnType<typeof createAdminClient>>;

/** Écrit au journal des accès ; renvoie false si l'écriture a échoué (la connexion est alors refusée : sécurité par défaut) */
async function record(admin: Admin, email: string, event: "login" | "login_failed" | "logout" | "locked", tenant: string | null = null) {
  const { ip, userAgent } = await requestInfo();
  const { error } = await admin.rpc("record_access", { p_email: email, p_event: event, p_tenant: tenant, p_ip: ip, p_user_agent: userAgent });
  return !error;
}

async function isLocked(admin: Admin, email: string) {
  const { data, error } = await admin.rpc("login_locked", { p_email: email });
  // En cas de doute (base injoignable), on refuse : sécurité par défaut
  return error ? true : Boolean(data);
}

/** Après un mot de passe juste : second facteur, entreprise, puis l'écran demandé */
async function nextStep(next: string): Promise<AuthResult> {
  const supabase = await createClient();
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal && aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
    return { redirect: `/connexion/double-authentification?suite=${encodeURIComponent(next)}` };
  }
  const { data } = await supabase.auth.getClaims();
  const tenant = (data?.claims as { tenant_id?: string } | undefined)?.tenant_id;
  if (!tenant) return { redirect: `/connexion/entreprise?suite=${encodeURIComponent(next)}` };
  // Administrateur sans second facteur alors que la plateforme l'exige (production, décision L5) : la base le dit
  const { data: mustEnroll, error } = await supabase.rpc("must_enroll_mfa");
  if (error || mustEnroll) return { redirect: `/connexion/double-authentification/activer?suite=${encodeURIComponent(next)}` };
  return { redirect: safeNext(next) };
}

export async function signIn(input: { email: string; password: string }, next: string): Promise<AuthResult> {
  const parsed = credentials.safeParse(input);
  if (!parsed.success) return { error: "invalid" };
  const { email, password } = parsed.data;
  const admin = createAdminClient();
  if (!admin) return { error: "config" };

  // Trop d'échecs pour ce compte, ou depuis cette adresse réseau (tous comptes confondus, décision F4)
  const { ip } = await requestInfo();
  const { data: ipBlocked, error: ipError } = await admin.rpc("ip_blocked", { p_ip: ip });
  // Un essai refusé pendant un blocage n'est pas compté comme un nouvel échec (sinon le blocage se prolongerait sans fin)
  if (ipError || ipBlocked || (await isLocked(admin, email))) return { error: "unavailable" };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const logged = await record(admin, email, "login_failed");
    if (!logged || (await isLocked(admin, email))) {
      if (logged) await record(admin, email, "locked");
      return { error: "unavailable" };
    }
    return { error: "invalid" };
  }
  const step = await nextStep(next);
  if (step.redirect && !step.redirect.startsWith("/connexion/double-authentification?")) {
    const { data } = await supabase.auth.getClaims();
    if (!(await record(admin, email, "login", (data?.claims as { tenant_id?: string } | undefined)?.tenant_id ?? null))) {
      await supabase.auth.signOut();
      return { error: "unavailable" };
    }
  }
  return step;
}

export async function verifyTotp(code: string, next: string): Promise<AuthResult> {
  if (!/^\d{6}$/.test(code)) return { error: "code" };
  const admin = createAdminClient();
  if (!admin) return { error: "config" };
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) return { redirect: "/connexion" };
  if (await isLocked(admin, email)) {
    await supabase.auth.signOut();
    return { error: "unavailable" };
  }
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const factor = factors?.totp.find((f) => f.status === "verified");
  if (!factor) return { redirect: `/connexion/double-authentification/activer?suite=${encodeURIComponent(next)}` };
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code });
  if (error) {
    const logged = await record(admin, email, "login_failed");
    if (!logged || (await isLocked(admin, email))) {
      if (logged) await record(admin, email, "locked");
      await supabase.auth.signOut();
      return { error: "unavailable" };
    }
    return { error: "code" };
  }
  const step = await nextStep(next);
  const { data } = await supabase.auth.getClaims();
  if (!(await record(admin, email, "login", (data?.claims as { tenant_id?: string } | undefined)?.tenant_id ?? null))) {
    await supabase.auth.signOut();
    return { error: "unavailable" };
  }
  return step;
}

/** Activation du second facteur : renvoie l'image à scanner et le code de secours à saisir à la main */
export async function enrollTotp(): Promise<{ factorId?: string; qr?: string; secret?: string; error?: string }> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: "invalid" };
  // Un essai d'activation non terminé est remplacé
  const { data: factors } = await supabase.auth.mfa.listFactors();
  for (const f of factors?.all ?? []) if (f.status !== "verified") await supabase.auth.mfa.unenroll({ factorId: f.id });
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Smart Collab" });
  if (error || !data) return { error: "unavailable" };
  return { factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret };
}

export async function confirmTotp(factorId: string, code: string, next: string): Promise<AuthResult> {
  if (!/^\d{6}$/.test(code)) return { error: "code" };
  const admin = createAdminClient();
  if (!admin) return { error: "config" };
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) return { redirect: "/connexion" };
  if (await isLocked(admin, email)) {
    await supabase.auth.signOut();
    return { error: "unavailable" };
  }
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
  if (error) {
    // Les erreurs de code à l'activation comptent aussi pour le verrouillage
    const logged = await record(admin, email, "login_failed");
    if (!logged || (await isLocked(admin, email))) {
      if (logged) await record(admin, email, "locked");
      await supabase.auth.signOut();
      return { error: "unavailable" };
    }
    return { error: "code" };
  }
  // Second facteur activé : 8 codes de secours, montrés une seule fois (décision F1)
  const { data: codes, error: codesError } = await supabase.rpc("generate_recovery_codes");
  if (codesError || !Array.isArray(codes)) return { error: "unavailable" };
  const step = await nextStep(next);
  return { ...step, codes: codes as string[] };
}

/** Second facteur perdu : un code de secours valable retire le second facteur ; il faudra en activer un nouveau */
export async function redeemRecoveryCode(code: string, next: string): Promise<AuthResult> {
  const clean = code.replace(/[^0-9A-Za-z]/g, "");
  if (clean.length !== 10) return { error: "code" };
  const admin = createAdminClient();
  if (!admin) return { error: "config" };
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user?.email) return { redirect: "/connexion" };
  const { data: ipBlocked } = await admin.rpc("ip_blocked", { p_ip: (await requestInfo()).ip });
  if (ipBlocked || (await isLocked(admin, user.email))) {
    await supabase.auth.signOut();
    return { error: "unavailable" };
  }
  const { data: ok, error } = await admin.rpc("consume_recovery_code", { p_user: user.id, p_code: clean });
  if (error || !ok) {
    const logged = await record(admin, user.email, "login_failed");
    if (!logged || (await isLocked(admin, user.email))) {
      if (logged) await record(admin, user.email, "locked");
      await supabase.auth.signOut();
      return { error: "unavailable" };
    }
    return { error: "code" };
  }
  const { data: factors } = await admin.auth.admin.mfa.listFactors({ userId: user.id });
  for (const f of factors?.factors ?? []) await admin.auth.admin.mfa.deleteFactor({ userId: user.id, id: f.id });
  await supabase.auth.refreshSession();
  await record(admin, user.email, "login");
  return { redirect: `/connexion/double-authentification/activer?suite=${encodeURIComponent(next)}` };
}

export async function selectCompany(tenantId: string, next: string): Promise<AuthResult> {
  if (!z.string().uuid().safeParse(tenantId).success) return { error: "noCompany" };
  const supabase = await createClient();
  const { error } = await supabase.rpc("select_tenant", { target: tenantId });
  if (error) return { error: "noCompany" };
  // Nouveau jeton signé portant l'entreprise choisie (ajoutée par la base, jamais par l'écran)
  await supabase.auth.refreshSession();
  return nextStep(next);
}

export async function signOut(): Promise<AuthResult> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const admin = createAdminClient();
  if (admin && data.user?.email) await record(admin, data.user.email, "logout");
  await supabase.auth.signOut();
  return { redirect: "/connexion" };
}

// ───────── Invitations ─────────

const invitationAccount = z.object({
  token: z.string().regex(/^[0-9a-f]{64}$/),
  fullName: z.string().trim().min(2).max(120),
  password: z.string().min(MIN_PASSWORD).max(200),
});
// Pas de case « conditions d'utilisation » tant que le texte n'existe pas (décision F3)

/** Personne sans compte : crée le compte de connexion, ouvre la session, puis rejoint l'entreprise */
export async function createAccountFromInvitation(input: { token: string; fullName: string; password: string }): Promise<AuthResult> {
  const parsed = invitationAccount.safeParse(input);
  if (!parsed.success) return { error: "invalid" };
  const admin = createAdminClient();
  if (!admin) return { error: "config" };
  const { data: preview } = await admin.rpc("invitation_preview", { p_token: parsed.data.token });
  const inv = (preview as { email: string; has_account: boolean }[] | null)?.[0];
  if (!inv) return { error: "expired" };
  if (inv.has_account) return { redirect: `/connexion?suite=${encodeURIComponent(`/invitation/${parsed.data.token}`)}` };
  const { error: createError } = await admin.auth.admin.createUser({ email: inv.email, password: parsed.data.password, email_confirm: true });
  if (createError) return { error: "unavailable" };
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email: inv.email, password: parsed.data.password });
  if (signInError) return { error: "unavailable" };
  const { error } = await supabase.rpc("accept_invitation", { p_token: parsed.data.token, p_full_name: parsed.data.fullName });
  if (error) return { error: "expired" };
  await supabase.auth.refreshSession();
  await record(admin, inv.email, "login");
  return nextStep("/");
}

/** Personne déjà connectée avec le bon e-mail : rejoint l'entreprise */
export async function joinFromInvitation(token: string): Promise<AuthResult> {
  if (!/^[0-9a-f]{64}$/.test(token)) return { error: "expired" };
  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_invitation", { p_token: token });
  if (error) return { error: error.code === "42501" ? "otherEmail" : "expired" };
  await supabase.auth.refreshSession();
  return nextStep("/");
}
