/**
 * Jetons de design Smart Collab — SOURCE UNIQUE des couleurs.
 *
 * Valeurs du thème clair : 05_UI_UX/DESIGN_TOKENS.md (relevées dans le prototype).
 * Valeurs du thème sombre et jetons ajoutés : proposition du lot 0, à valider.
 *
 * Ce fichier est le SEUL endroit du code où une couleur est écrite en dur
 * (un test automatique le vérifie). Il produit deux familles de variables CSS :
 *  - nos jetons, préfixés `--sc-` (ex. `--sc-accent` = l'or) ;
 *  - les noms attendus par shadcn/ui (`--primary`, `--background`, `--sidebar`…),
 *    qui pointent vers nos jetons (table SHADCN_MAPPING ci-dessous).
 */

export const THEME_MODES = ["light", "dark"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const COLOR_TOKENS = [
  "nav-1",
  "nav-2",
  "nav-text",
  "nav-text-active",
  "nav-hover",
  "nav-line",
  "accent",
  "accent-strong",
  "on-accent",
  "on-strong",
  "ink",
  "ink-2",
  "muted",
  "faint",
  "bg",
  "card",
  "hover",
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
    "nav-hover": "rgba(255, 255, 255, 0.08)",
    "nav-line": "rgba(255, 255, 255, 0.1)",
    accent: "#d9a441",
    "accent-strong": "#c08d2e",
    // Texte posé sur l'or : foncé pour rester lisible (contraste AA)
    "on-accent": "#16233a",
    // Texte posé sur une couleur franche (rouge, bleu…)
    "on-strong": "#ffffff",
    ink: "#16233a",
    "ink-2": "#3d4d66",
    muted: "#7b8aa1",
    faint: "#a8b4c5",
    bg: "#f4f7fb",
    card: "#ffffff",
    hover: "#eef2f8",
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
    "nav-hover": "rgba(255, 255, 255, 0.08)",
    "nav-line": "rgba(255, 255, 255, 0.08)",
    accent: "#d9a441",
    "accent-strong": "#e6b65a",
    "on-accent": "#16233a",
    "on-strong": "#ffffff",
    ink: "#e6edf7",
    "ink-2": "#b8c4d6",
    muted: "#8a99b0",
    faint: "#5f6f87",
    bg: "#0b1220",
    card: "#131c2e",
    hover: "#1b2639",
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

/**
 * Correspondance entre les noms shadcn/ui et nos jetons.
 * Attention au vocabulaire : chez shadcn, `primary` est la couleur principale (notre or)
 * et `accent` est le fond de survol ; `muted-foreground` est notre texte discret.
 */
export const SHADCN_MAPPING = {
  background: "bg",
  foreground: "ink",
  card: "card",
  "card-foreground": "ink",
  popover: "card",
  "popover-foreground": "ink",
  primary: "accent",
  "primary-foreground": "on-accent",
  secondary: "hover",
  "secondary-foreground": "ink",
  muted: "bg",
  "muted-foreground": "muted",
  accent: "hover",
  "accent-foreground": "ink",
  destructive: "red",
  border: "line",
  input: "line",
  ring: "accent",
  "chart-1": "accent",
  "chart-2": "blue",
  "chart-3": "green",
  "chart-4": "purple",
  "chart-5": "teal",
  sidebar: "nav-1",
  "sidebar-foreground": "nav-text",
  "sidebar-primary": "accent",
  "sidebar-primary-foreground": "on-accent",
  "sidebar-accent": "nav-hover",
  "sidebar-accent-foreground": "nav-text-active",
  "sidebar-border": "nav-line",
  "sidebar-ring": "accent",
} as const satisfies Record<string, ColorToken>;
export type ShadcnColor = keyof typeof SHADCN_MAPPING;

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
  sidebarWidth: 240,
  shadowCard: "0 1px 2px rgba(16,35,64,.04), 0 1px 3px rgba(16,35,64,.06)",
} as const;

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && (THEME_MODES as readonly string[]).includes(value);
}

export function isAccentPreset(value: unknown): value is AccentPreset {
  // Liste fermée : « in » accepterait aussi des noms internes comme « toString »
  return typeof value === "string" && Object.hasOwn(ACCENT_PRESETS, value);
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

function prefixed(values: Record<string, string>) {
  return Object.fromEntries(Object.entries(values).map(([k, v]) => [`sc-${k}`, v]));
}

/**
 * Feuille de style des variables CSS, injectée dans le <head> par l'application.
 * Le thème sombre s'active avec l'attribut `data-theme="dark"` sur <html>.
 */
export function cssVariables(accent: AccentPreset = DEFAULT_ACCENT): string {
  const common = {
    "sc-font": shape.fontFamily,
    "sc-shadow-card": shape.shadowCard,
    radius: `${shape.radiusControl}px`,
    "sc-radius-card": `${shape.radiusCard}px`,
    "sidebar-width": `${shape.sidebarWidth}px`,
  };
  const semantic = Object.fromEntries(Object.entries(SHADCN_MAPPING).map(([name, token]) => [name, `var(--sc-${token})`]));
  return [
    block(":root", { ...common, ...prefixed(resolveColors("light", accent)), ...semantic }),
    block(':root[data-theme="dark"]', prefixed(resolveColors("dark", accent))),
    ':root { color-scheme: light; }\n:root[data-theme="dark"] { color-scheme: dark; }',
  ].join("\n");
}

/* ------------------------------------------------------------------------------------------
 * Icônes illustrées des modules (05_UI_UX/ICONES_MODULES.md, validé le 26/11/2026).
 * Ces couleurs ne servent QU'aux tuiles des modules (mosaïque, App Store, assistant).
 * ---------------------------------------------------------------------------------------- */

/** Palette des modules : chaque module a une couleur propre et un trio pris dans cette liste. */
export const MODULE_PALETTE = {
  gold: "#d9a13b",
  coral: "#e2674a",
  teal: "#1e9e8f",
  blue: "#3478c6",
  orange: "#ee8a2a",
  green: "#2f9a5c",
  violet: "#7b5ac8",
  pink: "#d1508a",
  plum: "#a24e9a",
  sky: "#2a9fd6",
  indigo: "#4a5bd0",
} as const;
export type ModuleColor = keyof typeof MODULE_PALETTE;

/** Encres des icônes, en clair et en sombre (bleu marine éclairci en sombre pour rester lisible). */
export const ICON_INKS: Record<ThemeMode, { navy: string; navyMulti: string; white: string; hole: string }> = {
  light: { navy: "#1e2a4a", navyMulti: "#2b3a67", white: "#ffffff", hole: "#ffffff" },
  dark: { navy: "#3b4e7e", navyMulti: "#3b4e7e", white: "#ffffff", hole: "#1f2b42" },
};

/** Mélange deux couleurs #rrggbb (a = 0 : première, a = 1 : seconde). */
export function mixHex(from: string, to: string, a: number): string {
  const rgb = (h: string) => [1, 3, 5].map((i) => Number.parseInt(h.slice(i, i + 2), 16));
  const p = rgb(from);
  const q = rgb(to);
  return `#${p.map((v, i) => Math.round(v + (q[i] - v) * a).toString(16).padStart(2, "0")).join("")}`;
}
export const tintHex = (hex: string, a: number) => mixHex(hex, "#ffffff", a);
export const shadeHex = (hex: string, a: number) => mixHex(hex, "#000000", a);
