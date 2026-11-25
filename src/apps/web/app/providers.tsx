"use client";

import type { Locale } from "@smart-collab/i18n";
import { ScThemeContext, buildAntdTheme } from "@smart-collab/ui";
import { type AccentPreset, type ThemeMode, cssVariables } from "@smart-collab/ui/tokens";
import { App, ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import frFR from "antd/locale/fr_FR";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fr";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { ACCENT_COOKIE, THEME_COOKIE, writeCookie } from "@/lib/preferences";
import { PrelineInit } from "@/components/PrelineInit";

const ANTD_LOCALES = { fr: frFR, en: enUS } as const;

export function Providers({
  locale,
  initialMode,
  initialAccent,
  children,
}: {
  locale: Locale;
  initialMode: ThemeMode;
  initialAccent: AccentPreset;
  children: ReactNode;
}) {
  const [mode, setModeState] = useState(initialMode);
  const [accent, setAccentState] = useState(initialAccent);
  dayjs.locale(locale);

  // Signal « page prête » (interface active) utilisé par les tests d'écran
  useEffect(() => {
    document.documentElement.dataset.ready = "true";
  }, []);

  const themeValue = useMemo(
    () => ({
      mode,
      accent,
      setMode: (next: ThemeMode) => {
        setModeState(next);
        document.documentElement.dataset.theme = next;
        writeCookie(THEME_COOKIE, next);
      },
      setAccent: (next: AccentPreset) => {
        setAccentState(next);
        const style = document.getElementById("sc-tokens");
        if (style) style.textContent = cssVariables(next);
        writeCookie(ACCENT_COOKIE, next);
      },
    }),
    [mode, accent],
  );

  return (
    <ScThemeContext.Provider value={themeValue}>
      <ConfigProvider theme={buildAntdTheme(mode, accent)} locale={ANTD_LOCALES[locale]}>
        <App>{children}</App>
      </ConfigProvider>
      <PrelineInit />
    </ScThemeContext.Provider>
  );
}
