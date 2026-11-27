"use client";

import { ModuleIcon, iconSizeVars, useAppearance, useToast } from "@smart-collab/ui";
import { Button } from "@smart-collab/ui/components/ui/button";
import { CheckIcon, LockIcon, ClockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { type StoreData, loadStore } from "@/lib/apps/actions";
import { StoreLive } from "./StoreLive";
import { CATALOG } from "@/lib/modules";

/**
 * Écran « Applications » (App Store) — maquette du lot 0 (05_UI_UX/ICONES_MODULES.md § 4).
 * Carte : icône dans son cadre, nom, description courte, famille du catalogue, statut.
 * L'installation réelle (registre, dépendances, menu) arrive au lot 1 : ici, l'état est de démonstration.
 */
/** Connecté : l'App Store réel (étape 4) ; démonstration sans connexion : la maquette du lot 0 */
export function AppStoreScreen() {
  const [live, setLive] = useState<StoreData | null | undefined>(undefined);
  useEffect(() => {
    loadStore()
      .then(setLive)
      .catch(() => setLive(null));
  }, []);
  if (live === undefined) return null;
  return live ? <StoreLive initial={live} /> : <AppStoreDemo />;
}

function AppStoreDemo() {
  const t = useTranslations("store");
  const tm = useTranslations("modules");
  const tf = useTranslations("families");
  const toast = useToast();
  const { iconStyle, iconSize } = useAppearance();
  const [installed, setInstalled] = useState(() => new Set(CATALOG.filter((m) => m.installed).map((m) => m.key)));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </header>
      <ul className="sc-icon-sized grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4" style={iconSizeVars(iconSize)} aria-label={t("title")}>
        {CATALOG.map((m) => {
          const isInstalled = m.core || installed.has(m.key);
          return (
            <li key={m.key} data-app={m.key} className="flex min-w-0 flex-col gap-3 rounded-2xl border bg-card p-4 shadow-card">
              <span className="grid size-[var(--sc-icon-box)] place-items-center rounded-[22%] border bg-card shadow-card data-[pill=true]:border-0 data-[pill=true]:shadow-none" data-pill={iconStyle === "pill"}>
                <ModuleIcon
                  module={m.key}
                  iconStyle={iconStyle}
                  className={iconStyle === "pill" ? "size-[var(--sc-icon-box)]" : "size-[var(--sc-icon-draw)]"}
                />
              </span>
              <div className="min-w-0">
                <h2 className="font-semibold">{tm(`${m.key}.name`)}</h2>
                <p className="text-sm text-muted-foreground">{tm(`${m.key}.desc`)}</p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                <span className="min-w-0 text-xs leading-tight text-muted-foreground">
                  {tf(m.family)}
                </span>
                {m.core ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    <LockIcon className="size-3" aria-hidden /> {t("alwaysOn")}
                  </span>
                ) : m.example ? (
                  // Module pas encore construit : statut inactif, pas de bouton qui ne ferait rien (décision du 26/11/2026)
                  <span data-status="upcoming" aria-disabled="true" className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    <ClockIcon className="size-3" aria-hidden /> {t("upcoming")}
                  </span>
                ) : isInstalled ? (
                  <span data-status="installed" className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-green-l px-2.5 py-1 text-xs font-semibold text-green">
                    <CheckIcon className="size-3.5" aria-hidden /> {t("installed")}
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 border-primary dark:border-primary"
                    onClick={() => {
                      setInstalled((s) => new Set(s).add(m.key));
                      toast.success(t("installedToast", { name: tm(`${m.key}.name`) }));
                    }}
                  >
                    {t("install")}
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-muted-foreground">{t("demoNote")}</p>
    </div>
  );
}
