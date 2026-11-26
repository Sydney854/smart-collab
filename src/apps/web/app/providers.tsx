"use client";

import { APPEARANCE_COOKIES, type Appearance, AppearanceContext, ScThemeContext } from "@smart-collab/ui";
import { Toaster } from "@smart-collab/ui/components/ui/sonner";
import { TooltipProvider } from "@smart-collab/ui/components/ui/tooltip";
import { type AccentPreset, type ThemeMode, cssVariables } from "@smart-collab/ui/tokens";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { ACCENT_COOKIE, THEME_COOKIE, writeCookie } from "@/lib/preferences";

export function Providers({
  initialMode,
  initialAccent,
  initialAppearance,
  children,
}: {
  initialMode: ThemeMode;
  initialAccent: AccentPreset;
  initialAppearance: Appearance;
  children: ReactNode;
}) {
  const [mode, setModeState] = useState(initialMode);
  const [accent, setAccentState] = useState(initialAccent);
  const [appearance, setAppearance] = useState(initialAppearance);
  const appearanceValue = useMemo(
    () => ({
      ...appearance,
      set: <K extends keyof Appearance>(key: K, value: Appearance[K]) => {
        setAppearance((a) => ({ ...a, [key]: value }));
        writeCookie(APPEARANCE_COOKIES[key], value);
      },
    }),
    [appearance],
  );

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
      <AppearanceContext.Provider value={appearanceValue}>
      <TooltipProvider>
        {children}
        <Toaster position="bottom-right" richColors={false} />
      </TooltipProvider>
      </AppearanceContext.Provider>
    </ScThemeContext.Provider>
  );
}
