import en from "./messages/en.json";
import fr from "./messages/fr.json";

export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const messages = { fr, en } satisfies Record<Locale, unknown>;
export type Messages = typeof fr;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
