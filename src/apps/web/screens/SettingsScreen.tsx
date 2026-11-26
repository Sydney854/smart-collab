"use client";

import {
  ICON_SIZES,
  ICON_STYLES,
  type IconSize,
  type IconStyle,
  ModuleIcon,
  type ModuleIconKey,
  WIZARD_LAYOUTS,
  type WizardLayout,
  iconSizeVars,
  useAppearance,
} from "@smart-collab/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@smart-collab/ui/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@smart-collab/ui/components/ui/toggle-group";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

const PREVIEW: ModuleIconKey[] = ["dashboard", "sales", "pos", "stock", "purchases", "finance"];

/** Carte de choix (bouton radio) : aperçu + nom, bordure or quand choisie. */
function Choice({ checked, onSelect, label, hint, children }: { checked: boolean; onSelect: () => void; label: string; hint?: string; children?: ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className="relative flex min-w-0 flex-col items-center gap-2 rounded-xl border-2 bg-card p-3 text-center text-sm font-medium outline-none transition hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring aria-checked:border-primary aria-checked:bg-primary/5"
    >
      {checked && (
        <span className="absolute top-2 right-2 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
          <CheckIcon className="size-3" aria-hidden />
        </span>
      )}
      {children}
      <span className="leading-tight">{label}</span>
      {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
    </button>
  );
}

/**
 * Écran « Paramètres » — partie Apparence (05_UI_UX/ICONES_MODULES.md § 5).
 * Les autres parties des Paramètres (société, utilisateurs, droits…) arrivent au lot 1.
 */
export function SettingsScreen() {
  const t = useTranslations("settings");
  const { iconStyle, iconSize, wizardLayout, set } = useAppearance();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </header>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>{t("appearance")}</CardTitle>
          <CardDescription>{t("appearanceHint")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <section aria-labelledby="set-style" data-testid="setting-style">
            <h2 id="set-style" className="font-semibold">{t("iconStyle")}</h2>
            <p className="mb-3 text-sm text-muted-foreground">{t("iconStyleHint")}</p>
            <div role="radiogroup" aria-labelledby="set-style" className="grid grid-cols-2 gap-3 @xl:grid-cols-3 @4xl:grid-cols-6">
              {ICON_STYLES.map((s: IconStyle) => (
                <Choice key={s} checked={iconStyle === s} onSelect={() => set("iconStyle", s)} label={t(`styles.${s}`)}>
                  <span className="flex gap-1.5">
                    {(["dashboard", "sales", "stock"] as ModuleIconKey[]).map((k) => (
                      <ModuleIcon key={k} module={k} iconStyle={s} className="size-9" />
                    ))}
                  </span>
                </Choice>
              ))}
            </div>
          </section>

          <section aria-labelledby="set-size" data-testid="setting-size">
            <h2 id="set-size" className="font-semibold">{t("iconSize")}</h2>
            <p className="mb-3 text-sm text-muted-foreground">{t("iconSizeHint")}</p>
            <ToggleGroup
              type="single"
              variant="outline"
              aria-labelledby="set-size"
              value={iconSize}
              onValueChange={(v) => v && set("iconSize", v as IconSize)}
              className="flex-wrap"
            >
              {(Object.keys(ICON_SIZES) as IconSize[]).map((s) => (
                <ToggleGroupItem key={s} value={s}>
                  {t(`sizes.${s}`)} · {ICON_SIZES[s][0]} px
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {/* Aperçu de la mosaïque à la taille choisie */}
            <div className="sc-icon-sized mt-4 flex flex-wrap gap-4 rounded-xl border bg-muted p-4" style={iconSizeVars(iconSize)} aria-label={t("preview")}>
              {PREVIEW.map((k) => (
                <span key={k} className="grid size-[calc(var(--sc-icon-box)+40px)] place-items-center rounded-[24%] border bg-card shadow-card">
                  <ModuleIcon module={k} iconStyle={iconStyle} className="size-[var(--sc-icon-box)]" />
                </span>
              ))}
            </div>
          </section>

          <section aria-labelledby="set-wizard" data-testid="setting-wizard">
            <h2 id="set-wizard" className="font-semibold">{t("wizard")}</h2>
            <p className="mb-3 text-sm text-muted-foreground">{t("wizardHint")}</p>
            <div role="radiogroup" aria-labelledby="set-wizard" className="grid gap-3 @xl:grid-cols-2">
              {WIZARD_LAYOUTS.map((w: WizardLayout) => (
                <Choice key={w} checked={wizardLayout === w} onSelect={() => set("wizardLayout", w)} label={t(`wizards.${w}`)} hint={t(`wizardsHint.${w}`)} />
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">{t("otherSettings")}</p>
    </div>
  );
}
