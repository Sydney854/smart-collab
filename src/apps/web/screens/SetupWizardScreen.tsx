"use client";

/**
 * Assistant de première connexion — étape « choix des modules » (maquette du lot 0).
 * 05_UI_UX/ICONES_MODULES.md § 4 : deux présentations, réglées dans Paramètres → Apparence
 * (pas de sélecteur dans l'assistant : fiche core.setup-wizard, décision du 26/11/2026)
 * (proposition 1 par défaut ; la proposition 3 est écartée).
 * L'assistant réel (entreprise → métier → modules → utilisateurs → récapitulatif) arrive au lot 1.
 */

import { ModuleIcon, type ModuleIconKey, iconSizeVars, useAppearance, useToast } from "@smart-collab/ui";
import { Button } from "@smart-collab/ui/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type KeyboardEvent, type ReactNode, useState } from "react";
import { CATALOG, FAMILIES, WIZARD_INITIAL_SELECTION } from "@/lib/modules";

const CORE = CATALOG.filter((m) => m.core).map((m) => m.key);

/** Cadre net autour de l'icône (styles autres que « pastille », qui porte son propre fond). */
function IconFrame({ module, children }: { module: ModuleIconKey; children?: ReactNode }) {
  const { iconStyle } = useAppearance();
  const pill = iconStyle === "pill";
  return (
    <span className="relative inline-grid shrink-0 leading-none">
      <span
        data-pill={pill}
        className="grid size-[var(--sc-icon-box)] place-items-center rounded-[22%] border bg-card shadow-card data-[pill=true]:border-0 data-[pill=true]:bg-transparent data-[pill=true]:shadow-none"
      >
        <ModuleIcon module={module} iconStyle={iconStyle} className={pill ? "size-[var(--sc-icon-box)]" : "size-[var(--sc-icon-draw)]"} />
      </span>
      {children}
    </span>
  );
}

export function SetupWizardScreen() {
  const t = useTranslations("wizard");
  const tm = useTranslations("modules");
  const tf = useTranslations("families");
  const toast = useToast();
  const { iconSize, iconStyle, wizardLayout } = useAppearance();
  const [selected, setSelected] = useState<ModuleIconKey[]>(WIZARD_INITIAL_SELECTION);

  const isOn = (k: ModuleIconKey) => CORE.includes(k) || selected.includes(k);
  const toggle = (k: ModuleIconKey) => {
    if (CORE.includes(k)) return;
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  };
  // Une tuile se coche au clic, à la touche Espace ou Entrée (rôle checkbox)
  const checkboxProps = (k: ModuleIconKey) =>
    CORE.includes(k)
      ? { "aria-disabled": true as const }
      : {
          role: "checkbox" as const,
          "aria-checked": isOn(k),
          tabIndex: 0,
          onClick: () => toggle(k),
          onKeyDown: (e: KeyboardEvent) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              toggle(k);
            }
          },
        };
  const chosen = CATALOG.filter((m) => isOn(m.key));
  const groups = FAMILIES.map((f) => ({ family: f, modules: CATALOG.filter((m) => m.family === f) })).filter((g) => g.modules.length);
  const groupTitle = (f: (typeof FAMILIES)[number]) => (
    <h3 className="font-semibold">
      {tf(f)}
      {f === "hr" && <small className="ml-2 text-xs font-medium text-muted-foreground">· {t("hrExample")}</small>}
    </h3>
  );
  const proceed = () => toast.info(t("continueToast", { count: chosen.length }));

  // Proposition 1 : tuile horizontale, coche verte sur l'icône, icône grisée si non choisie
  const layout1 = groups.map(({ family, modules }) => (
    <section key={family} className="flex flex-col gap-3">
      {groupTitle(family)}
      <div className="grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-3">
        {modules.map((m) => {
          const on = isOn(m.key);
          return (
            <div
              key={m.key}
              data-module={m.key}
              data-on={on}
              {...checkboxProps(m.key)}
              className="group flex min-w-0 cursor-pointer items-center gap-4 rounded-2xl border border-border/60 bg-muted/40 p-3.5 outline-none transition hover:border-green focus-visible:ring-2 focus-visible:ring-ring aria-disabled:cursor-default aria-disabled:hover:border-border/60 data-[on=false]:[&_svg[data-module]]:opacity-40 data-[on=false]:[&_svg[data-module]]:grayscale"
            >
              <IconFrame module={m.key}>
                <span
                  aria-hidden
                  className="absolute -top-2 -right-2 grid size-6 scale-0 place-items-center rounded-full border-2 border-card bg-green text-on-strong transition group-data-[on=true]:scale-100 motion-reduce:transition-none"
                >
                  <CheckIcon className="size-3.5" strokeWidth={3} />
                </span>
              </IconFrame>
              <div className="min-w-0">
                <p className="font-semibold">{tm(`${m.key}.name`)}</p>
                <p className="text-sm text-muted-foreground">{tm(`${m.key}.desc`)}</p>
                {m.core && <p className="mt-0.5 text-xs font-semibold text-green">{t("alwaysOn")}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  ));

  // Proposition 2 : cartes carrées + récapitulatif « Votre sélection »
  const layout2 = (
    <div className="grid items-start gap-4 @4xl:grid-cols-[minmax(0,1fr)_270px]">
      <div className="flex min-w-0 flex-col gap-6">
        {groups.map(({ family, modules }) => (
          <section key={family} className="flex flex-col gap-3">
            {groupTitle(family)}
            <div className="grid grid-cols-2 gap-3 @xl:grid-cols-3 @3xl:grid-cols-4">
              {modules.map((m) => {
                const on = isOn(m.key);
                return (
                  <div
                    key={m.key}
                    data-module={m.key}
                    data-on={on}
                    {...checkboxProps(m.key)}
                    className="relative flex min-w-0 cursor-pointer flex-col items-center gap-2.5 rounded-2xl border-2 border-border/60 bg-muted/40 px-2.5 pt-5 pb-3.5 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring data-[on=true]:border-primary/60 data-[on=true]:bg-primary/5 aria-disabled:cursor-default"
                  >
                    {m.core && <span className="absolute top-2 left-2 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{t("core")}</span>}
                    <span
                      aria-hidden
                      className="absolute top-2 right-2 grid size-[22px] place-items-center rounded-full border-2 bg-card text-primary-foreground data-[on=true]:border-primary data-[on=true]:bg-primary"
                      data-on={on}
                    >
                      {on && <CheckIcon className="size-3" strokeWidth={3} />}
                    </span>
                    <IconFrame module={m.key} />
                    <p className="text-sm leading-tight font-semibold">{tm(`${m.key}.name`)}</p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <aside aria-label={t("selection")} className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-card @4xl:sticky @4xl:top-4">
        <p className="font-semibold">{t("selection")}</p>
        <p>
          <span className="text-3xl font-bold tabular-nums">{chosen.length}</span>{" "}
          <span className="text-sm text-muted-foreground">{t("modulesWord", { count: chosen.length })}</span>
        </p>
        <ul className="flex flex-col gap-2">
          {chosen.map((m) => (
            <li key={m.key} className="flex items-center gap-2.5 text-sm">
              <ModuleIcon module={m.key} iconStyle={iconStyle} className="size-7 shrink-0" />
              {tm(`${m.key}.name`)}
            </li>
          ))}
        </ul>
        <Button onClick={proceed}>{t("continue")}</Button>
        <p className="text-xs text-muted-foreground">{t("laterShort")}</p>
      </aside>
    </div>
  );

  return (
    <div className="sc-icon-sized mx-auto flex max-w-7xl flex-col gap-5" style={iconSizeVars(iconSize)} data-wizard={wizardLayout}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-gold-strong uppercase">{t("step")}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">{t("intro")}</p>
        </div>
      </header>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">{t("later")}</p>
        <p className="font-semibold whitespace-nowrap text-gold-strong" data-testid="wizard-count">
          {t("count", { count: chosen.length })}
        </p>
      </div>
      {wizardLayout === "1" ? <div className="flex flex-col gap-6">{layout1}</div> : layout2}
      {wizardLayout === "1" && (
        <div className="flex justify-end">
          <Button onClick={proceed}>{t("continue")}</Button>
        </div>
      )}
    </div>
  );
}
