import "@fontsource-variable/inter";
import "./globals.css";
import type { Locale } from "@smart-collab/i18n";
import { cssVariables } from "@smart-collab/ui/tokens";
import { readAppearance } from "@smart-collab/ui/appearance";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { readPreferences } from "@/lib/preferences";
import { Providers } from "./providers";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return { title: t("title"), description: t("description") };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = (await getLocale()) as Locale;
  const store = await cookies();
  const { mode, accent } = readPreferences((name) => store.get(name)?.value);
  // Réglages d'apparence (Paramètres → Apparence) : style, taille, présentation de l'assistant
  const appearance = readAppearance((name) => store.get(name)?.value);

  return (
    <html lang={locale} data-theme={mode} suppressHydrationWarning>
      <head>
        {/* Variables CSS des jetons : rendues côté serveur, donc aucun « flash » de thème */}
        <style id="sc-tokens" dangerouslySetInnerHTML={{ __html: cssVariables(accent) }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers initialMode={mode} initialAccent={accent} initialAppearance={appearance}>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
