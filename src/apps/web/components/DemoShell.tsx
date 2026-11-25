"use client";

import { AppShell, type ShellApp } from "@smart-collab/ui";
import { AppWindowIcon, BoxesIcon, LayoutDashboardIcon, PackageIcon, ReceiptIcon, StoreIcon, TruckIcon, WalletIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { HeaderControls } from "./HeaderControls";

/** Cadre commun aux pages de démonstration (entreprise et utilisatrice fictives). */
export function DemoShell({ sidebarOpen, children, banner }: { sidebarOpen: boolean; children: ReactNode; banner?: ReactNode }) {
  const tApps = useTranslations("apps");
  const t = useTranslations("dashboard");
  const tHeader = useTranslations("header");
  const apps: ShellApp[] = [
    { key: "dashboard", label: tApps("dashboard"), icon: <LayoutDashboardIcon /> },
    { key: "sales", label: tApps("sales"), icon: <ReceiptIcon /> },
    { key: "stock", label: tApps("stock"), icon: <BoxesIcon /> },
    { key: "purchases", label: tApps("purchases"), icon: <TruckIcon /> },
    { key: "pos", label: tApps("pos"), icon: <StoreIcon /> },
    { key: "finance", label: tApps("finance"), icon: <WalletIcon /> },
    { key: "apps", label: tApps("apps"), icon: <AppWindowIcon /> },
  ];
  return (
    <AppShell
      defaultOpen={sidebarOpen}
      company={{ name: t("company"), detail: t("plan"), logo: <PackageIcon className="size-4" /> }}
      section={t("section")}
      apps={apps}
      activeKey="dashboard"
      user={{ name: tHeader("demoUser"), role: tHeader("demoRole"), initials: "AK" }}
      headerRight={<HeaderControls />}
      banner={banner}
      onNavigate={(key) => toast(tApps(key as "dashboard"))}
    >
      {children}
    </AppShell>
  );
}
