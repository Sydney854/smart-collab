"use client";

import { AppShell, type LayoutMode, OfflineBanner } from "@smart-collab/ui";
import { PackageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { LAYOUT_COOKIE, writeCookie } from "@/lib/preferences";
import { useScreens } from "@/screens/registry";
import { HeaderControls } from "./HeaderControls";

/** Cadre de l'application de démonstration (entreprise et utilisatrice fictives). */
export function Workspace({ initialMode, initialScreen, sidebarOpen }: { initialMode: LayoutMode; initialScreen?: string; sidebarOpen: boolean }) {
  const t = useTranslations("dashboard");
  const tHeader = useTranslations("header");
  const screens = useScreens();

  // L'adresse suit l'écran courant (/?ecran=…), sans recharger la page
  const syncUrl = useCallback((key: string | null) => {
    const url = new URL(window.location.href);
    if (key) url.searchParams.set("ecran", key);
    else url.searchParams.delete("ecran");
    window.history.replaceState(window.history.state, "", url);
  }, []);

  return (
    <AppShell
      screens={screens}
      initialMode={initialMode}
      initialScreen={initialScreen}
      defaultSidebarOpen={sidebarOpen}
      company={{ name: t("company"), detail: t("plan"), logo: <PackageIcon className="size-4" /> }}
      section={t("section")}
      user={{ name: tHeader("demoUser"), role: tHeader("demoRole"), initials: "AK" }}
      headerRight={<HeaderControls />}
      banner={<OfflineBanner />}
      onModeChange={(mode) => writeCookie(LAYOUT_COOKIE, mode)}
      onScreenChange={syncUrl}
    />
  );
}
