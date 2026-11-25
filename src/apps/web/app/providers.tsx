"use client";

import { ScThemeContext } from "@smart-collab/ui";
import { Toaster } from "@smart-collab/ui/components/ui/sonner";
import { TooltipProvider } from "@smart-collab/ui/components/ui/tooltip";
import { type AccentPreset, type ThemeMode, cssVariables } from "@smart-collab/ui/tokens";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { ACCENT_COOKIE, THEME_COOKIE, writeCookie } from "@/lib/preferences";

export function Providers({
  initialMode,
  initialAccent,
  children,
}: {
  initialMode: ThemeMode;
  initialAccent: AccentPreset;
  children: ReactNode;
}) {
  const [mode, setModeState] = useState(initialMode);
  const [accent, setAccentState] = useState(initialAccent);

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
      <TooltipProvider>
        {children}
        <Toaster position="bottom-right" richColors={false} />
      </TooltipProvider>
    </ScThemeContext.Provider>
  );
}
