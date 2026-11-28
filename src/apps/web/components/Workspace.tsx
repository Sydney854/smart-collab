"use client";

import { AppShell, type LayoutMode } from "@smart-collab/ui";
import { PackageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { signOut } from "@/lib/auth/actions";
import { type InstalledApps, InstalledAppsContext, type Permissions, PermissionsContext } from "@/lib/permissions";
import { toast } from "sonner";
import { LAYOUT_COOKIE, writeCookie } from "@/lib/preferences";
import { useScreens } from "@/screens/registry";
import { HeaderControls } from "./HeaderControls";

/** Cadre de l'application de démonstration (entreprise et utilisatrice fictives). */
export type Account = { name: string; email: string; company: string; domain: string };

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

/**
 * Cadre de l'application. Avec une connexion : personne et entreprise réelles, déconnexion active.
 * Sans connexion (démonstration du lot 0 seulement) : entreprise et utilisatrice fictives.
 */
export function Workspace({
  initialMode,
  initialScreen,
  sidebarOpen,
  account,
  permissions,
  installedApps,
}: {
  initialMode: LayoutMode;
  initialScreen?: string;
  sidebarOpen: boolean;
  account: Account | null;
  permissions: Permissions;
  installedApps: InstalledApps;
}) {
  return (
    <PermissionsContext.Provider value={permissions}>
      <InstalledAppsContext.Provider value={installedApps}>
        <WorkspaceInner initialMode={initialMode} initialScreen={initialScreen} sidebarOpen={sidebarOpen} account={account} />
      </InstalledAppsContext.Provider>
    </PermissionsContext.Provider>
  );
}

function WorkspaceInner({
  initialMode,
  initialScreen,
  sidebarOpen,
  account,
}: { initialMode: LayoutMode; initialScreen?: string; sidebarOpen: boolean; account: Account | null }) {
  const router = useRouter();
  const tAuth = useTranslations("auth");
  const t = useTranslations("dashboard");
  const tHeader = useTranslations("header");
  const tScreens = useTranslations("screens");
  const screens = useScreens();
  // Connexion, profil, paramètres et recherche globale arrivent au lot 1 (13_PLAN_LOTS.md)
  const notYet = (name: string) => () => toast.info(tScreens("plannedShort", { name, lot: 1 }));
  const tShell = useTranslations("ui.shell");

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
      company={
        account
          ? { name: account.company, detail: tAuth.has(`domains.${account.domain}`) ? tAuth(`domains.${account.domain}`) : account.domain, logo: <PackageIcon className="size-4" /> }
          : { name: t("company"), detail: t("plan"), logo: <PackageIcon className="size-4" /> }
      }
      section={account ? account.company : t("section")}
      user={
        account
          ? { name: account.name, role: account.email, initials: initialsOf(account.name) }
          : { name: tHeader("demoUser"), role: tHeader("demoRole"), initials: "AK" }
      }
      headerRight={<HeaderControls />}
      onModeChange={(mode) => writeCookie(LAYOUT_COOKIE, mode)}
      onScreenChange={syncUrl}
      userActions={{ onProfile: notYet(tShell("profile")), onSettings: notYet(tShell("settings")), onSignOut: account
          ? async () => {
              const result = await signOut();
              if (result.redirect) {
                router.replace(result.redirect);
                router.refresh();
              }
            }
          : notYet(tShell("signOut")),
      }}
      onSearch={() => notYet(tShell("searchName"))()}
    />
  );
}
