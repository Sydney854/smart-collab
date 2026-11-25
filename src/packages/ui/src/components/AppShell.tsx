"use client";

/**
 * Cadre de l'application, construit sur le bloc shadcn/ui « sidebar-07 »
 * (menu latéral repliable en icônes) :
 *  - menu = applications installées uniquement (EF-APP-04) ;
 *  - barre du haut : bouton du menu, fil d'Ariane, recherche, contrôles à droite ;
 *  - onglets des écrans ouverts (comme dans le prototype).
 */

import { ChevronsUpDownIcon, LogOutIcon, SearchIcon, SettingsIcon, UserIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";

export type ShellApp = { key: string; label: string; icon: ReactNode };
export type ShellUser = { name: string; role: string; initials: string };

function UserMenu({ user, onSignOut }: { user: ShellUser; onSignOut?: () => void }) {
  const t = useTranslations("ui.shell");
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              aria-label={t("userMenu")}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-sidebar-primary font-semibold text-sidebar-primary-foreground">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-sidebar-accent-foreground">{user.name}</span>
                <span className="truncate text-xs">{user.role}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
            <DropdownMenuLabel className="font-normal">
              <span className="block font-medium text-foreground">{user.name}</span>
              <span className="block text-xs text-muted-foreground">{user.role}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon /> {t("profile")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon /> {t("settings")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onSignOut}>
              <LogOutIcon /> {t("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function AppNav({ apps, current, onOpen }: { apps: ShellApp[]; current: string; onOpen: (key: string) => void }) {
  const t = useTranslations("ui.shell");
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("apps")}</SidebarGroupLabel>
      <SidebarMenu>
        {apps.map((app) => (
          <SidebarMenuItem key={app.key}>
            <SidebarMenuButton
              tooltip={app.label}
              isActive={app.key === current}
              // Écran actif en or, comme dans le prototype
              className="data-[active=true]:bg-sidebar-primary data-[active=true]:font-medium data-[active=true]:text-sidebar-primary-foreground"
              onClick={() => {
                onOpen(app.key);
                if (isMobile) setOpenMobile(false);
              }}
            >
              {app.icon}
              <span>{app.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function AppShell({
  company,
  apps,
  activeKey,
  user,
  section,
  headerRight,
  banner,
  defaultOpen = true,
  onNavigate,
  onSignOut,
  children,
}: {
  company: { name: string; detail: string; logo: ReactNode };
  apps: ShellApp[];
  activeKey: string;
  user: ShellUser;
  /** Premier élément du fil d'Ariane (ex. nom de l'entreprise ou du module) */
  section?: string;
  headerRight?: ReactNode;
  banner?: ReactNode;
  /** Menu ouvert ou réduit au chargement (lu dans le cookie `sidebar_state`) */
  defaultOpen?: boolean;
  onNavigate?: (key: string) => void;
  onSignOut?: () => void;
  children: ReactNode;
}) {
  const t = useTranslations("ui.shell");
  const [openTabs, setOpenTabs] = useState<string[]>([activeKey]);
  const [current, setCurrent] = useState(activeKey);
  const label = (key: string) => apps.find((a) => a.key === key)?.label ?? key;

  function open(key: string) {
    setOpenTabs((tabs) => (tabs.includes(key) ? tabs : [...tabs, key]));
    setCurrent(key);
    onNavigate?.(key);
  }

  function close(key: string) {
    const next = openTabs.filter((k) => k !== key);
    setOpenTabs(next);
    if (current === key && next.length > 0) open(next[next.length - 1]);
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible="icon" aria-label={t("navigation")}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="pointer-events-none">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {company.logo}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-accent-foreground">{company.name}</span>
                  <span className="truncate text-xs">{company.detail}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <AppNav apps={apps} current={current} onOpen={open} />
        </SidebarContent>
        <SidebarFooter>
          <UserMenu user={user} onSignOut={onSignOut} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-card px-3 md:px-4">
          <SidebarTrigger aria-label={t("toggleMenu")} />
          <Separator orientation="vertical" className="mx-1 data-vertical:h-4 data-vertical:self-auto" />
          <Breadcrumb className="hidden min-w-0 sm:block">
            <BreadcrumbList>
              {section && (
                <>
                  <BreadcrumbItem className="hidden md:block">{section}</BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage>{label(current)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-4 hidden max-w-72 flex-1 lg:block">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input type="search" placeholder={t("search")} aria-label={t("search")} className="pl-8" />
          </div>
          <div className="ml-auto flex min-w-0 items-center gap-1">{headerRight}</div>
        </header>
        <nav aria-label={t("openTabs")} className="flex gap-1 overflow-x-auto border-b bg-card px-3 pt-2 md:px-4">
          {openTabs.map((key) => (
            <div
              key={key}
              data-active={key === current}
              className="group flex shrink-0 items-center rounded-t-lg border border-b-0 border-transparent text-sm text-muted-foreground data-[active=true]:border-border data-[active=true]:bg-background data-[active=true]:font-medium data-[active=true]:text-foreground"
            >
              <button type="button" className="px-3 py-1.5" aria-current={key === current ? "page" : undefined} onClick={() => open(key)}>
                {label(key)}
              </button>
              {openTabs.length > 1 && (
                <button
                  type="button"
                  aria-label={t("closeTab", { name: label(key) })}
                  className="mr-1 rounded p-0.5 hover:bg-accent"
                  onClick={() => close(key)}
                >
                  <XIcon className="size-3.5" />
                </button>
              )}
            </div>
          ))}
        </nav>
        {banner && <div className="px-4 pt-4 md:px-6">{banner}</div>}
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
