import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, messages } from "@smart-collab/i18n";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

// Langue lue dans un cookie (pas de /fr ou /en dans l'adresse) ; français par défaut.
export default getRequestConfig(async () => {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(value) ? value : DEFAULT_LOCALE;
  return { locale, messages: messages[locale], timeZone: "Africa/Abidjan" };
});
