/**
 * Jetons de design Smart Collab — SOURCE UNIQUE des couleurs.
 *
 * Valeurs du thème clair : 05_UI_UX/DESIGN_TOKENS.md (relevées dans le prototype).
 * Valeurs du thème sombre : proposition du lot 0, à valider par la cheffe de projet.
 *
 * Ce fichier est le SEUL endroit du code où une couleur est écrite en dur
 * (un test automatique le vérifie). Tout le reste utilise :
 *  - les variables CSS (`var(--accent)`) ou les classes Tailwind (`bg-accent`) ;
 *  - le thème Ant Design construit par `buildAntdTheme` (theme.ts).
 */

export const THEME_MODES = ["light", "dark"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const COLOR_TOKENS = [
  "nav-1",
  "nav-2",
  "nav-text",
  "nav-text-active",
  "accent",
  "accent-strong",
  "on-accent",
  "ink",
  "ink-2",
  "muted",
  "faint",
  "bg",
  "card",
  "line",
  "blue",
  "blue-l",
  "green",
  "green-l",
  "amber",
  "amber-l",
  "red",
  "red-l",
  "purple",
  "purple-l",
  "teal",
  "teal-l",
  "print",
  "overlay",
] as const;
export type ColorToken = (typeof COLOR_TOKENS)[number];

export const colors: Record<ThemeMode, Record<ColorToken, string>> = {
  light: {
    "nav-1": "#0c1e37",
    "nav-2": "#132a4b",
    "nav-text": "#a7b6cc",
    "nav-text-active": "#ffffff",
    accent: "#d9a441",
    "accent-strong": "#c08d2e",
    // Texte posé sur l'or : foncé pour rester lisible (contraste AA)
    "on-accent": "#16233a",
    ink: "#16233a",
    "ink-2": "#3d4d66",
    muted: "#7b8aa1",
    faint: "#a8b4c5",
    bg: "#f4f7fb",
    card: "#ffffff",
    line: "#e6ecf4",
    blue: "#2563eb",
    "blue-l": "#e8f0fe",
    green: "#10b981",
    "green-l": "#e6f8f1",
    amber: "#f59e0b",
    "amber-l": "#fef4e2",
    red: "#ef4444",
    "red-l": "#fdeaea",
    purple: "#7c3aed",
    "purple-l": "#f1ecfe",
    teal: "#0d9488",
    "teal-l": "#e3f5f3",
    print: "#1e4d8f",
    overlay: "rgba(12, 30, 55, 0.45)",
  },
  dark: {
    "nav-1": "#08152a",
    "nav-2": "#0d1d36",
    "nav-text": "#a7b6cc",
    "nav-text-active": "#ffffff",
    accent: "#d9a441",
    "accent-strong": "#e6b65a",
    "on-accent": "#16233a",
    ink: "#e6edf7",
    "ink-2": "#b8c4d6",
    muted: "#8a99b0",
    faint: "#5f6f87",
    bg: "#0b1220",
    card: "#131c2e",
    line: "#24324a",
    blue: "#60a5fa",
    "blue-l": "#13233f",
    green: "#34d399",
    "green-l": "#0f2e26",
    amber: "#fbbf24",
    "amber-l": "#33270f",
    red: "#f87171",
    "red-l": "#3a1717",
    purple: "#a78bfa",
    "purple-l": "#241a3d",
    teal: "#2dd4bf",
    "teal-l": "#0e2b2a",
    print: "#1e4d8f",
    overlay: "rgba(0, 0, 0, 0.6)",
  },
};

/** Couleurs principales proposées par le sélecteur de thème (chaque entreprise peut choisir). */
export const ACCENT_PRESETS = {
  gold: { accent: "#d9a441", strong: "#c08d2e", on: "#16233a" },
  blue: { accent: "#2563eb", strong: "#1d4ed8", on: "#ffffff" },
  green: { accent: "#0d9488", strong: "#0f766e", on: "#ffffff" },
  purple: { accent: "#7c3aed", strong: "#6d28d9", on: "#ffffff" },
  red: { accent: "#dc2626", strong: "#b91c1c", on: "#ffffff" },
} as const;
export type AccentPreset = keyof typeof ACCENT_PRESETS;
export const DEFAULT_ACCENT: AccentPreset = "gold";

export const shape = {
  fontFamily:
    "'Inter Variable', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  radiusCard: 12,
  radiusControl: 8,
  sidebarWidth: 222,
  sidebarCollapsedWidth: 64,
  shadowCard: "0 1px 2px rgba(16,35,64,.04), 0 1px 3px rgba(16,35,64,.06)",
} as const;

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && (THEME_MODES as readonly string[]).includes(value);
}

export function isAccentPreset(value: unknown): value is AccentPreset {
  return typeof value === "string" && value in ACCENT_PRESETS;
}

/** Palette effective : thème + couleur principale choisie. */
export function resolveColors(mode: ThemeMode, accent: AccentPreset = DEFAULT_ACCENT) {
  const preset = ACCENT_PRESETS[accent];
  return {
    ...colors[mode],
    accent: preset.accent,
    "accent-strong": accent === DEFAULT_ACCENT ? colors[mode]["accent-strong"] : preset.strong,
    "on-accent": preset.on,
  } satisfies Record<ColorToken, string>;
}

function block(selector: string, values: Record<string, string>) {
  const lines = Object.entries(values).map(([k, v]) => `  --${k}: ${v};`);
  return `${selector} {\n${lines.join("\n")}\n}`;
}

/**
 * Feuille de style des variables CSS, injectée dans le <head> par l'application.
 * Le thème sombre s'active avec l'attribut `data-theme="dark"` sur <html>.
 */
export function cssVariables(accent: AccentPreset = DEFAULT_ACCENT): string {
  // Les noms préfixés « sc- » alimentent les jetons Tailwind (styles.css)
  const common = {
    "sc-font": shape.fontFamily,
    "sc-radius-card": `${shape.radiusCard}px`,
    "sc-radius-control": `${shape.radiusControl}px`,
    "sc-shadow-card": shape.shadowCard,
  };
  return [
    block(":root", { ...common, ...resolveColors("light", accent) }),
    block(':root[data-theme="dark"]', resolveColors("dark", accent)),
    ':root { color-scheme: light; }\n:root[data-theme="dark"] { color-scheme: dark; }',
  ].join("\n");
}
