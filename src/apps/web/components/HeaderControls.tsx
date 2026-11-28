"use client";

import { LOCALE_COOKIE, type Locale, isLocale } from "@smart-collab/i18n";
import { HEADER_ICON_BUTTON, NetworkStatus, SearchButton, useScTheme } from "@smart-collab/ui";
import { Button } from "@smart-collab/ui/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@smart-collab/ui/components/ui/toggle-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@smart-collab/ui/components/ui/dropdown-menu";
import { LanguagesIcon, MoonIcon, SunIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { writeCookie } from "@/lib/preferences";
import { NotificationsBell } from "./NotificationsBell";

/** Langue : un bouton, et un petit menu Français / English (maquette validée le 28/11/2026). */
export function LocaleSwitch() {
  const t = useTranslations("header");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={HEADER_ICON_BUTTON} aria-label={t("languageCurrent", { language: locale === "fr" ? t("french") : t("english") })} title={t("language")} disabled={pending}>
          <LanguagesIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(next) => {
            if (!isLocale(next) || next === locale) return;
            writeCookie(LOCALE_COOKIE, next);
            startTransition(() => router.refresh());
          }}
        >
          <DropdownMenuRadioItem value="fr">{t("french")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">{t("english")}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Double bouton FR / EN des pages de connexion (sans barre du haut). */
export function LocaleToggle() {
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
    // Seul endroit du choix clair / sombre (la palette ne propose plus que les couleurs, décision du 28/11/2026)
    <Button
      variant="outline"
      size="icon"
      className={HEADER_ICON_BUTTON}
      aria-label={dark ? t("switchToLight") : t("switchToDark")}
      onClick={() => setMode(dark ? "light" : "dark")}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}

export function HeaderControls() {
  // Ordre choisi par la cheffe de projet (28/11/2026) : réseau, recherche, langue, nuit / jour, cloche ; le profil suit
  return (
    <>
      <NetworkStatus className="size-8 rounded-lg border bg-card" />
      <SearchButton />
      <LocaleSwitch />
      <ThemeToggle />
      <NotificationsBell />
    </>
  );
}
