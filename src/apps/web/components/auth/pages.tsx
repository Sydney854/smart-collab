"use client";

import { Button } from "@smart-collab/ui/components/ui/button";
import { Checkbox } from "@smart-collab/ui/components/ui/checkbox";
import { Input } from "@smart-collab/ui/components/ui/input";
import { Label } from "@smart-collab/ui/components/ui/label";
import { Building2Icon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState, useTransition } from "react";
import {
  type AuthResult,
  confirmTotp,
  createAccountFromInvitation,
  enrollTotp,
  joinFromInvitation,
  selectCompany,
  signOut,
  verifyTotp,
} from "@/lib/auth/actions";
import { AuthLayout, FormError } from "./AuthLayout";
import { LoginForm } from "./LoginForm";
import { PasswordInput } from "./PasswordInput";

const MIN_PASSWORD = 10;

/** Applique le résultat d'une action serveur : erreur affichée ou changement d'écran */
function useAuthAction() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<AuthResult["error"]>();
  const run = (action: () => Promise<AuthResult>) => {
    setError(undefined);
    startTransition(async () => {
      const result = await action();
      if (result.error) setError(result.error);
      else if (result.redirect) {
        router.replace(result.redirect);
        router.refresh();
      }
    });
  };
  return { pending, error, run };
}

export function LoginPage({ next }: { next: string }) {
  const t = useTranslations("auth");
  return (
    <AuthLayout title={t("signInTitle")}>
      <LoginForm next={next} />
    </AuthLayout>
  );
}

function SignOutLink() {
  const t = useTranslations("auth");
  const { pending, run } = useAuthAction();
  return (
    <Button type="button" variant="link" className="self-center" disabled={pending} onClick={() => run(signOut)}>
      {t("signOut")}
    </Button>
  );
}

/** Saisie du code à 6 chiffres (fiche core.two-factor) */
function CodeForm({ onSubmit, pending, label }: { onSubmit: (code: string) => void; pending: boolean; label: string }) {
  const t = useTranslations("auth");
  const [code, setCode] = useState("");
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        onSubmit(code);
        setCode("");
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="mfa-code">{t("code")}</Label>
        <Input
          id="mfa-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="h-11 text-center font-mono text-lg tracking-[0.5em]"
        />
      </div>
      <Button type="submit" disabled={pending || code.length !== 6}>
        {pending ? t("verifying") : label}
      </Button>
    </form>
  );
}

export function MfaVerifyPage({ next }: { next: string }) {
  const t = useTranslations("auth");
  const { pending, error, run } = useAuthAction();
  return (
    <AuthLayout title={t("mfaTitle")} subtitle={t("mfaHint")}>
      <FormError message={error ? t(`errors.${error}`) : undefined} />
      <CodeForm pending={pending} label={t("verify")} onSubmit={(code) => run(() => verifyTotp(code, next))} />
      <SignOutLink />
    </AuthLayout>
  );
}

export function MfaSetupPage({ next, required }: { next: string; required: boolean }) {
  const t = useTranslations("auth");
  const { pending, error, run } = useAuthAction();
  const [enrolment, setEnrolment] = useState<{ factorId?: string; qr?: string; secret?: string; error?: string }>();
  useEffect(() => {
    enrollTotp().then(setEnrolment);
  }, []);
  return (
    <AuthLayout title={t("mfaSetupTitle")} subtitle={t("mfaSetupHint")}>
      {required && <p className="rounded-lg border bg-muted px-3 py-2 text-sm">{t("mfaRequired")}</p>}
      <FormError message={enrolment?.error ? t("errors.unavailable") : error ? t(`errors.${error}`) : undefined} />
      {enrolment?.qr && (
        <div className="flex flex-col items-center gap-3">
          {/* Image fournie par Supabase (données SVG) : pas de requête vers un autre site */}
          {/* biome-ignore lint/performance/noImgElement: image en ligne (data:) */}
          <img src={enrolment.qr} alt="" width={176} height={176} className="rounded-xl border bg-on-strong p-2" />
          <p className="text-xs text-muted-foreground">{t("mfaSecret")}</p>
          <code className="rounded bg-muted px-2 py-1 text-xs break-all select-all">{enrolment.secret}</code>
        </div>
      )}
      {enrolment?.factorId && (
        <CodeForm pending={pending} label={t("activate")} onSubmit={(code) => run(() => confirmTotp(enrolment.factorId as string, code, next))} />
      )}
      <SignOutLink />
    </AuthLayout>
  );
}

export type CompanyChoice = { id: string; name: string; domain: string };

export function CompanyPage({ companies, next }: { companies: CompanyChoice[]; next: string }) {
  const t = useTranslations("auth");
  const { pending, error, run } = useAuthAction();
  const [chosen, setChosen] = useState<string>();
  return (
    <AuthLayout title={t("companyTitle")} subtitle={companies.length ? t("companyHint") : undefined}>
      <FormError message={error ? t(`errors.${error}`) : undefined} />
      {companies.length === 0 ? (
        <p className="text-muted-foreground">{t("noCompany")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {companies.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                data-company={c.id}
                disabled={pending}
                onClick={() => {
                  setChosen(c.id);
                  run(() => selectCompany(c.id, next));
                }}
                className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left shadow-card outline-none transition hover:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-gold-strong">
                  <Building2Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{c.name}</span>
                  <span className="block text-sm text-muted-foreground">{t.has(`domains.${c.domain}`) ? t(`domains.${c.domain}`) : c.domain}</span>
                </span>
                <ChevronRightIcon className={`size-4 shrink-0 text-muted-foreground ${pending && chosen === c.id ? "animate-pulse" : ""}`} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <SignOutLink />
    </AuthLayout>
  );
}

export type InvitationView =
  | { state: "invalid" }
  | { state: "new"; token: string; email: string; fullName: string; company: string }
  | { state: "existing"; token: string; email: string; company: string; signedInAs: string | null };

export function InvitationPage({ view }: { view: InvitationView }) {
  const t = useTranslations("auth");
  const { pending, error, run } = useAuthAction();
  const [fullName, setFullName] = useState(view.state === "new" ? view.fullName : "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [local, setLocal] = useState<string>();

  if (view.state === "invalid") {
    return (
      <AuthLayout title={t("inviteInvalidTitle")}>
        <FormError message={t("errors.expired")} />
        <Button asChild variant="outline">
          <a href="/connexion">{t("backToSignIn")}</a>
        </Button>
      </AuthLayout>
    );
  }
  if (view.state === "existing") {
    const sameEmail = view.signedInAs?.toLowerCase() === view.email;
    return (
      <AuthLayout title={t("inviteSignIn", { company: view.company })} company={view.company}>
        <FormError message={error ? t(`errors.${error}`) : view.signedInAs && !sameEmail ? t("errors.otherEmail") : undefined} />
        <p className="text-sm text-muted-foreground">{view.email}</p>
        {sameEmail ? (
          <Button disabled={pending} onClick={() => run(() => joinFromInvitation(view.token))}>
            {t("join", { company: view.company })}
          </Button>
        ) : view.signedInAs ? (
          <SignOutLink />
        ) : (
          <Button asChild>
            <a href={`/connexion?suite=${encodeURIComponent(`/invitation/${view.token}`)}`}>{t("signInToJoin")}</a>
          </Button>
        )}
      </AuthLayout>
    );
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) return setLocal(t("errors.required"));
    if (password.length < MIN_PASSWORD) return setLocal(t("errors.passwordLength", { min: MIN_PASSWORD }));
    if (password !== confirm) return setLocal(t("errors.passwordMatch"));
    if (!terms) return setLocal(t("errors.terms"));
    setLocal(undefined);
    run(() => createAccountFromInvitation({ token: view.token, fullName, password }));
  };
  return (
    <AuthLayout title={t("inviteTitle", { company: view.company })} company={view.company}>
      <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
        <FormError message={local ?? (error ? t(`errors.${error}`) : undefined)} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="inv-email">{t("email")}</Label>
          <Input id="inv-email" value={view.email} readOnly disabled />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="inv-name">{t("fullName")}</Label>
          <Input id="inv-name" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={120} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="inv-password">{t("password")}</Label>
          <PasswordInput id="inv-password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="text-xs text-muted-foreground">{t("passwordRule", { min: MIN_PASSWORD })}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="inv-confirm">{t("confirmPassword")}</Label>
          <PasswordInput id="inv-confirm" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="inv-terms" checked={terms} onCheckedChange={(v) => setTerms(v === true)} />
          <Label htmlFor="inv-terms" className="font-normal">
            {t("terms")}
          </Label>
        </div>
        <Button type="submit" disabled={pending}>
          {t("createAndJoin")}
        </Button>
      </form>
    </AuthLayout>
  );
}
