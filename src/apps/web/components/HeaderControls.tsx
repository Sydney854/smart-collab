"use client";

import { LOCALE_COOKIE, type Locale } from "@smart-collab/i18n";
import { ThemePicker, useScTheme } from "@smart-collab/ui";
import { Button, Segmented } from "antd";
import { ChevronDown, LogOut, Moon, Settings, Sun, User } from "lucide-react";
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
    <Segmented<Locale>
      size="small"
      aria-label={t("language")}
      value={locale}
      disabled={pending}
      options={[
        { value: "fr", label: <span title={t("french")}>FR</span> },
        { value: "en", label: <span title={t("english")}>EN</span> },
      ]}
      onChange={(next) => {
        writeCookie(LOCALE_COOKIE, next);
        startTransition(() => router.refresh());
      }}
    />
  );
}

/** Bouton rapide clair / sombre. */
export function ThemeToggle() {
  const t = useTranslations("header");
  const { mode, setMode } = useScTheme();
  const dark = mode === "dark";
  return (
    <Button
      type="text"
      shape="circle"
      aria-label={dark ? t("switchToLight") : t("switchToDark")}
      icon={dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
      onClick={() => setMode(dark ? "light" : "dark")}
    />
  );
}

/** Menu utilisateur (composant Preline « dropdown », habillé avec nos jetons). */
export function UserMenu() {
  const t = useTranslations("header");
  const item = "flex w-full items-center gap-2 rounded-control px-3 py-2 text-sm text-ink-2 hover:bg-bg hover:text-ink focus:bg-bg focus:outline-none";
  return (
    <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
      <button
        id="sc-user-menu"
        type="button"
        className="hs-dropdown-toggle flex items-center gap-2 rounded-control px-2 py-1 text-left hover:bg-bg"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label={t("userMenu")}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-on-accent">AK</span>
        <span className="hidden leading-tight sm:block">
          <span className="block text-sm font-medium text-ink">{t("demoUser")}</span>
          <span className="block text-xs text-muted">{t("demoRole")}</span>
        </span>
        <ChevronDown className="size-4 text-muted hs-dropdown-open:rotate-180" aria-hidden />
      </button>
      <div
        className="hs-dropdown-menu duration hidden min-w-52 rounded-card border border-line bg-card p-1 opacity-0 shadow-card transition-[opacity,margin] hs-dropdown-open:opacity-100 z-50"
        role="menu"
        aria-labelledby="sc-user-menu"
      >
        <button type="button" role="menuitem" className={item}>
          <User className="size-4" aria-hidden /> {t("profile")}
        </button>
        <button type="button" role="menuitem" className={item}>
          <Settings className="size-4" aria-hidden /> {t("settings")}
        </button>
        <div className="my-1 border-t border-line" />
        <button type="button" role="menuitem" className={`${item} text-red hover:text-red`}>
          <LogOut className="size-4" aria-hidden /> {t("signOut")}
        </button>
      </div>
    </div>
  );
}

export function HeaderControls() {
  return (
    <>
      <LocaleSwitch />
      <ThemeToggle />
      <ThemePicker />
      <UserMenu />
    </>
  );
}
