"use client";

import { LOCALE_COOKIE, type Locale, isLocale } from "@smart-collab/i18n";
import { ThemePicker, useScTheme } from "@smart-collab/ui";
import { Button } from "@smart-collab/ui/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@smart-collab/ui/components/ui/toggle-group";
import { MoonIcon, SunIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { writeCookie } from "@/lib/preferences";

/** Bascule français / anglais : enregistre le choix et recharge les textes. */
export function LocaleSwitch() {
  const t = useTranslations("header");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <ToggleGroup
      type="single"
      size="sm"
      variant="outline"
      aria-label={t("language")}
      value={locale}
      disabled={pending}
      onValueChange={(next) => {
        if (!isLocale(next) || next === locale) return;
        writeCookie(LOCALE_COOKIE, next);
        startTransition(() => router.refresh());
      }}
    >
      <ToggleGroupItem value="fr" aria-label={t("french")}>
        FR
      </ToggleGroupItem>
      <ToggleGroupItem value="en" aria-label={t("english")}>
        EN
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

/** Bouton rapide clair / sombre. */
export function ThemeToggle() {
  const t = useTranslations("header");
  const { mode, setMode } = useScTheme();
  const dark = mode === "dark";
  return (
    <Button variant="ghost" size="icon" aria-label={dark ? t("switchToLight") : t("switchToDark")} onClick={() => setMode(dark ? "light" : "dark")}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}

export function HeaderControls() {
  return (
    <>
      <LocaleSwitch />
      <ThemeToggle />
      <ThemePicker />
    </>
  );
}
