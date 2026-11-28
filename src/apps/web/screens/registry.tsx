"use client";

import type { ScreenDef } from "@smart-collab/ui";
import {
  AppWindowIcon,
  BoxesIcon,
  ComponentIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  ReceiptIcon,
  SettingsIcon,
  ShieldCheckIcon,
  StoreIcon,
  UsersIcon,
  TruckIcon,
  WalletIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useCan, useInstalled } from "@/lib/permissions";
import { PeopleScreen } from "./admin/PeopleScreen";
import { RolesScreen } from "./admin/RolesScreen";
import { AppStoreScreen } from "./AppStoreScreen";
import { ComponentsScreen } from "./ComponentsScreen";
import { DashboardScreen } from "./DashboardScreen";
import { PlannedScreen } from "./PlannedScreen";
import { SettingsScreen } from "./SettingsScreen";
import { SetupWizardScreen } from "./SetupWizardScreen";

/** Lot prévu pour chaque module de démonstration (02_SPECIFICATIONS/13_PLAN_LOTS.md). */
const PLANNED = { sales: 5, stock: 2, purchases: 4, pos: 3, finance: 7 } as const;

/**
 * Écrans de l'application de démonstration. Chaque écran est écrit une fois et
 * affiché par le cadre en page (mode Liste) ou en fenêtre (mode Mosaïque).
 * `icon` : Lucide (menu, onglets, fenêtres) ; `moduleIcon` : icône illustrée des tuiles.
 */
type GatedScreen = ScreenDef & { needs?: string };

export function useScreens(): ScreenDef[] {
  const t = useTranslations("apps");
  const d = useTranslations("screens.descriptions");
  const can = useCan();
  const installed = useInstalled();
  return useMemo(() => {
    const planned = (key: keyof typeof PLANNED) => () => <PlannedScreen name={t(key)} lot={PLANNED[key]} />;
    const list: GatedScreen[] = [
      { key: "dashboard", label: t("dashboard"), description: d("dashboard"), icon: <LayoutDashboardIcon />, moduleIcon: "dashboard", render: () => <DashboardScreen /> },
      { key: "sales", label: t("sales"), description: d("sales"), icon: <ReceiptIcon />, moduleIcon: "sales", render: planned("sales"), app: "sales" },
      { key: "stock", label: t("stock"), description: d("stock"), icon: <BoxesIcon />, moduleIcon: "stock", render: planned("stock"), app: "inventory" },
      { key: "purchases", label: t("purchases"), description: d("purchases"), icon: <TruckIcon />, moduleIcon: "purchases", render: planned("purchases"), app: "purchase" },
      { key: "pos", label: t("pos"), description: d("pos"), icon: <StoreIcon />, moduleIcon: "pos", render: planned("pos"), app: "pos" },
      { key: "finance", label: t("finance"), description: d("finance"), icon: <WalletIcon />, moduleIcon: "finance", render: planned("finance"), app: "finance" },
      { key: "apps", label: t("apps"), description: d("apps"), icon: <AppWindowIcon />, moduleIcon: "apps", render: () => <AppStoreScreen />, needs: "core.apps.view" },
      { key: "settings", label: t("settings"), description: d("settings"), icon: <SettingsIcon />, moduleIcon: "settings", render: () => <SettingsScreen />, needs: "core.settings.view" },
      // Administration : ouverte depuis Paramètres, de la même façon en Liste et en Mosaïque (décision G5) ; ni menu, ni tuile
      { key: "people", label: t("people"), description: d("people"), icon: <UsersIcon />, hidden: true, render: () => <PeopleScreen />, needs: "core.users.view" },
      { key: "roles", label: t("roles"), description: d("roles"), icon: <ShieldCheckIcon />, hidden: true, render: () => <RolesScreen />, needs: "core.roles.view" },
      { key: "setup", label: t("setup"), description: d("setup"), icon: <ListChecksIcon />, hidden: true, render: () => <SetupWizardScreen /> },
      { key: "components", label: t("components"), description: d("components"), icon: <ComponentIcon />, moduleIcon: "components", hidden: true, render: () => <ComponentsScreen /> },
    ];
    return list
      // Un écran sans le droit nécessaire n'existe pas pour la personne : ni menu, ni tuile, ni ouverture par l'adresse
      .filter((s) => (!s.needs || can(s.needs)) && (!s.app || installed(s.app)))
      .map(({ needs: _needs, ...s }) => s as ScreenDef);
  }, [t, d, can, installed]);
}
