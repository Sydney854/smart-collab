"use client";

import type { ScreenDef } from "@smart-collab/ui";
import { AppWindowIcon, BoxesIcon, ComponentIcon, LayoutDashboardIcon, ReceiptIcon, StoreIcon, TruckIcon, WalletIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { ComponentsScreen } from "./ComponentsScreen";
import { DashboardScreen } from "./DashboardScreen";
import { PlannedScreen } from "./PlannedScreen";

/** Lot prévu pour chaque module de démonstration (02_SPECIFICATIONS/13_PLAN_LOTS.md). */
const PLANNED = { sales: 5, stock: 2, purchases: 4, pos: 3, finance: 7, apps: 1 } as const;

/**
 * Écrans de l'application de démonstration. Chaque écran est écrit une fois et
 * affiché par le cadre en page (mode Liste) ou en fenêtre (mode Mosaïque).
 */
export function useScreens(): ScreenDef[] {
  const t = useTranslations("apps");
  const d = useTranslations("screens.descriptions");
  return useMemo(() => {
    const planned = (key: keyof typeof PLANNED) => () => <PlannedScreen name={t(key)} lot={PLANNED[key]} />;
    return [
      { key: "dashboard", label: t("dashboard"), description: d("dashboard"), icon: <LayoutDashboardIcon />, render: () => <DashboardScreen /> },
      { key: "sales", label: t("sales"), description: d("sales"), icon: <ReceiptIcon />, render: planned("sales") },
      { key: "stock", label: t("stock"), description: d("stock"), icon: <BoxesIcon />, render: planned("stock") },
      { key: "purchases", label: t("purchases"), description: d("purchases"), icon: <TruckIcon />, render: planned("purchases") },
      { key: "pos", label: t("pos"), description: d("pos"), icon: <StoreIcon />, render: planned("pos") },
      { key: "finance", label: t("finance"), description: d("finance"), icon: <WalletIcon />, render: planned("finance") },
      { key: "apps", label: t("apps"), description: d("apps"), icon: <AppWindowIcon />, render: planned("apps") },
      { key: "components", label: t("components"), description: d("components"), icon: <ComponentIcon />, render: () => <ComponentsScreen /> },
    ];
  }, [t, d]);
}
