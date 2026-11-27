"use client";

import { PackageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { LocaleSwitch } from "@/components/HeaderControls";

/**
 * Disposition commune des écrans publics (fiche core.login) : panneau bleu marine à gauche (≥ 1 024 px),
 * formulaire à droite, choix FR / EN en haut à droite. Couleurs : jetons uniquement.
 */
export function AuthLayout({ title, subtitle, company, children }: { title: string; subtitle?: string; company?: string; children: ReactNode }) {
  const t = useTranslations("auth");
  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex" aria-hidden>
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <PackageIcon className="size-5" />
          </span>
          <span className="text-lg font-semibold">Smart Collab</span>
        </div>
        <div>
          {company && <p className="mb-2 text-2xl font-semibold">{company}</p>}
          <p className="max-w-sm text-sidebar-foreground/80">{t("brandTagline")}</p>
        </div>
        <p className="text-xs text-sidebar-foreground/60">{t("version", { version: "1.0 (lot 1)" })}</p>
      </aside>
      <main className="flex flex-col px-4 py-6 sm:px-10">
        <div className="flex justify-end">
          <LocaleSwitch />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 py-8">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <PackageIcon className="size-4" />
            </span>
            <span className="font-semibold">Smart Collab</span>
          </div>
          <header>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}

/** Message d'erreur annoncé aux lecteurs d'écran */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" data-testid="form-error" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  );
}
