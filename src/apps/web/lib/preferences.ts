import { type AccentPreset, DEFAULT_ACCENT, type ThemeMode, isAccentPreset, isThemeMode } from "@smart-collab/ui/tokens";

export const THEME_COOKIE = "sc-theme";
export const ACCENT_COOKIE = "sc-accent";

/** Lit le thème et la couleur principale enregistrés (valeurs par défaut sinon). */
export function readPreferences(get: (name: string) => string | undefined): { mode: ThemeMode; accent: AccentPreset } {
  const mode = get(THEME_COOKIE);
  const accent = get(ACCENT_COOKIE);
  return {
    mode: isThemeMode(mode) ? mode : "light",
    accent: isAccentPreset(accent) ? accent : DEFAULT_ACCENT,
  };
}

/** Enregistre une préférence dans un cookie valable un an (côté navigateur). */
export function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}

/** Mode d'affichage du menu principal (Liste ou Mosaïque), retenu par utilisateur dans ce navigateur. */
export const LAYOUT_COOKIE = "sc-layout";
