"use client";

import { Button, Input, Layout, Menu, Tabs } from "antd";
import { PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import { shape } from "../tokens";

export type ShellApp = { key: string; label: string; icon: ReactNode };

/**
 * Cadre de l'application : menu latéral (applications installées uniquement, EF-APP-04),
 * barre du haut et onglets des écrans ouverts.
 */
export function AppShell({
  apps,
  activeKey,
  onNavigate,
  brand,
  headerRight,
  banner,
  children,
}: {
  apps: ShellApp[];
  activeKey: string;
  onNavigate?: (key: string) => void;
  brand: { name: string; logo: ReactNode };
  headerRight?: ReactNode;
  banner?: ReactNode;
  children: ReactNode;
}) {
  const t = useTranslations("ui.shell");
  const [collapsed, setCollapsed] = useState(false);
  // Sur téléphone (écran < 992 px) le menu est masqué et s'ouvre par-dessus la page
  const [mobile, setMobile] = useState(false);
  const [openTabs, setOpenTabs] = useState<string[]>([activeKey]);
  const [current, setCurrent] = useState(activeKey);

  function open(key: string) {
    setOpenTabs((tabs) => (tabs.includes(key) ? tabs : [...tabs, key]));
    setCurrent(key);
    if (mobile) setCollapsed(true);
    onNavigate?.(key);
  }

  function close(key: string) {
    setOpenTabs((tabs) => {
      const next = tabs.filter((k) => k !== key);
      if (current === key && next.length > 0) open(next[next.length - 1]);
      return next.length > 0 ? next : [activeKey];
    });
  }

  const label = (key: string) => apps.find((a) => a.key === key)?.label ?? key;

  return (
    <Layout className="min-h-dvh">
      {mobile && !collapsed && (
        <div aria-hidden className="fixed inset-0 z-20 bg-overlay" onClick={() => setCollapsed(true)} />
      )}
      <Layout.Sider
        width={shape.sidebarWidth}
        collapsedWidth={mobile ? 0 : shape.sidebarCollapsedWidth}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          setMobile(broken);
          setCollapsed(broken);
        }}
        trigger={null}
        className={`sc-sider top-0 h-dvh ${mobile ? "!fixed left-0 z-30" : "!sticky"}`}
        aria-label={t("navigation")}
      >
        <div className="flex h-16 items-center gap-2 px-4 text-nav-text-active">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-control bg-accent text-on-accent">{brand.logo}</span>
          {!collapsed && <span className="truncate font-semibold">{brand.name}</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current]}
          items={apps.map((a) => ({ key: a.key, icon: a.icon, label: a.label }))}
          onClick={({ key }) => open(key)}
          className="px-2"
        />
      </Layout.Sider>
      <Layout className="min-w-0">
        <Layout.Header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-line">
          <Button
            type="text"
            aria-label={collapsed ? t("expand") : t("collapse")}
            icon={collapsed ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Input
            prefix={<Search className="size-4 text-muted" aria-hidden />}
            placeholder={t("search")}
            aria-label={t("search")}
            className="hidden max-w-80 md:flex"
          />
          <div className="ml-auto flex min-w-0 items-center gap-1">{headerRight}</div>
        </Layout.Header>
        <div className="border-b border-line bg-card px-4">
          <Tabs
            type="editable-card"
            hideAdd
            size="small"
            activeKey={current}
            onChange={open}
            onEdit={(key, action) => action === "remove" && close(String(key))}
            items={openTabs.map((k) => ({ key: k, label: label(k), closable: openTabs.length > 1 }))}
            aria-label={t("openTabs")}
            className="sc-open-tabs"
          />
        </div>
        {banner && <div className="px-4 pt-4 md:px-6">{banner}</div>}
        <Layout.Content className="min-w-0 p-4 md:p-6">{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}
