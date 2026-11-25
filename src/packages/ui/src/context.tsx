"use client";

import { createContext, useContext } from "react";
import { type AccentPreset, DEFAULT_ACCENT, type ThemeMode, resolveColors } from "./tokens";

export type ScThemeValue = {
  mode: ThemeMode;
  accent: AccentPreset;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentPreset) => void;
};

export const ScThemeContext = createContext<ScThemeValue>({
  mode: "light",
  accent: DEFAULT_ACCENT,
  setMode: () => {},
  setAccent: () => {},
});

/** Thème courant (clair / sombre, couleur principale) et palette résolue. */
export function useScTheme() {
  const value = useContext(ScThemeContext);
  return { ...value, colors: resolveColors(value.mode, value.accent) };
}
