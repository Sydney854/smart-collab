"use client";

import { type Locale, format as formatDate } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { useLocale } from "next-intl";

const LOCALES: Record<string, Locale> = { fr, en: enUS };

/** Langue date-fns correspondant à la langue de l'interface (fr par défaut). */
export function useDateLocale(): Locale {
  return LOCALES[useLocale()] ?? fr;
}

/** Formatage de date dans la langue de l'interface. Ex. : useFormatDate()(date, "MMM yyyy"). */
export function useFormatDate() {
  const locale = useDateLocale();
  return (date: Date, pattern: string) => formatDate(date, pattern, { locale });
}
