/**
 * Réglages d'apparence (Paramètres → Apparence, 05_UI_UX/ICONES_MODULES.md § 5) — règles pures,
 * utilisables côté serveur (lecture des cookies) comme dans le navigateur.
 * Style des icônes de modules, taille des icônes, présentation de l'assistant de choix des modules.
 * Retenus d'abord dans le navigateur (listes fermées : toute autre valeur est ignorée),
 * puis dans le profil quand la connexion existera (lot 1).
 */

import type { CSSProperties } from "react";

export const ICON_STYLES = ["trait", "bi", "multi", "grad", "duo", "pill"] as const;
export type IconStyle = (typeof ICON_STYLES)[number];
/** Style par défaut (B · Multicolore), modifiable par l'entreprise. */
export const DEFAULT_ICON_STYLE: IconStyle = "multi";

export function isIconStyle(value: unknown): value is IconStyle {
  return typeof value === "string" && (ICON_STYLES as readonly string[]).includes(value);
}

/** Taille du cadre et du dessin, en pixels. */
export const ICON_SIZES = { s: [44, 30], m: [56, 40], l: [72, 52], xl: [88, 64] } as const;
export type IconSize = keyof typeof ICON_SIZES;
export const DEFAULT_ICON_SIZE: IconSize = "l";
/** Sous cette largeur d'écran, la taille est ramenée à Moyenne (deux tuiles par ligne). */
export const PHONE_ICON_BREAKPOINT = 560;

export const WIZARD_LAYOUTS = ["1", "2"] as const;
export type WizardLayout = (typeof WIZARD_LAYOUTS)[number];
export const DEFAULT_WIZARD_LAYOUT: WizardLayout = "1";

/** Position de la barre des écrans ouverts (modes Liste et Mosaïque), décision du 28/11/2026 */
export const BAR_POSITIONS = ["bottom", "top"] as const;
export type BarPosition = (typeof BAR_POSITIONS)[number];
export const DEFAULT_BAR_POSITION: BarPosition = "bottom";
export function isBarPosition(value: unknown): value is BarPosition {
  return typeof value === "string" && (BAR_POSITIONS as readonly string[]).includes(value);
}

export function isIconSize(value: unknown): value is IconSize {
  return typeof value === "string" && Object.hasOwn(ICON_SIZES, value);
}
export function isWizardLayout(value: unknown): value is WizardLayout {
  return typeof value === "string" && (WIZARD_LAYOUTS as readonly string[]).includes(value);
}

export type Appearance = { iconStyle: IconStyle; iconSize: IconSize; wizardLayout: WizardLayout; barPosition: BarPosition };

/** Lit les réglages (cookies ou autre source), valeurs par défaut sinon. */
export function readAppearance(get: (name: string) => string | undefined, companyDefaultStyle: IconStyle = DEFAULT_ICON_STYLE): Appearance {
  const style = get(APPEARANCE_COOKIES.iconStyle);
  const size = get(APPEARANCE_COOKIES.iconSize);
  const wizard = get(APPEARANCE_COOKIES.wizardLayout);
  const bar = get(APPEARANCE_COOKIES.barPosition);
  return {
    barPosition: isBarPosition(bar) ? bar : DEFAULT_BAR_POSITION,
    iconStyle: isIconStyle(style) ? style : companyDefaultStyle,
    iconSize: isIconSize(size) ? size : DEFAULT_ICON_SIZE,
    wizardLayout: isWizardLayout(wizard) ? wizard : DEFAULT_WIZARD_LAYOUT,
  };
}

export const APPEARANCE_COOKIES = { iconStyle: "sc-icon-style", iconSize: "sc-icon-size", wizardLayout: "sc-wizard", barPosition: "sc-bar-position" } as const;

/** Variables CSS de taille pour un conteneur de tuiles (ramenées à Moyenne sur téléphone par la classe sc-icon-sized). */
export function iconSizeVars(size: IconSize): CSSProperties {
  const [box, ico] = ICON_SIZES[size];
  return { "--sc-icon-box": `${box}px`, "--sc-icon-draw": `${ico}px` } as CSSProperties;
}
