"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@smart-collab/ui/components/ui/button";
import { Input } from "@smart-collab/ui/components/ui/input";
import { Label } from "@smart-collab/ui/components/ui/label";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { type AuthResult, signIn } from "@/lib/auth/actions";
import { FormError } from "./AuthLayout";
import { PasswordInput } from "./PasswordInput";

/** Formulaire de connexion (fiche core.login) */
export function LoginForm({ next }: { next: string }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<AuthResult["error"]>();
  const schema = z.object({
    email: z.string().trim().min(1, t("errors.required")).email(t("errors.emailFormat")),
    password: z.string().min(1, t("errors.required")),
  });
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const { errors } = form.formState;

  const submit = form.handleSubmit((values) => {
    setError(undefined);
    if (!navigator.onLine) {
      toast.error(t("errors.offline"));
      return;
    }
    startTransition(async () => {
      const result = await signIn(values, next);
      if (result.error) {
        setError(result.error);
        form.resetField("password");
      } else if (result.redirect) {
        router.replace(result.redirect);
        router.refresh();
      }
    });
  });

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4" data-testid="login-form">
      <FormError message={error ? t(`errors.${error}`) : undefined} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-email">{t("email")}</Label>
        <Input id="login-email" className="max-sm:h-11" type="email" inputMode="email" autoComplete="username" autoFocus disabled={pending} aria-invalid={!!errors.email} {...form.register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        {/* « Mot de passe oublié ? » : affiché quand l'écran core.forgot-password existera (pas de lien sans effet) */}
        <Label htmlFor="login-password">{t("password")}</Label>
        <PasswordInput id="login-password" autoComplete="current-password" disabled={pending} aria-invalid={!!errors.password} {...form.register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="max-sm:h-11" disabled={pending}>
        {pending ? t("signingIn") : t("signIn")}
      </Button>
    </form>
  );
}
