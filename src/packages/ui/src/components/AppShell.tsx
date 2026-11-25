"use client";

/**
 * Cadre de l'application à 2 modes d'affichage (décision du 25/11/2026) :
 *  - Liste : bloc shadcn « sidebar-07 » (menu latéral repliable en icônes), modules à gauche,
 *    écran à droite, onglets des écrans ouverts ;
 *  - Mosaïque : une tuile par module ; chaque écran s'ouvre dans une fenêtre déplaçable,
 *    redimensionnable, agrandissable et réductible (react-rnd). Fenêtres réduites dans les onglets ;
 *    plein écran sur téléphone ; 6 écrans ouverts au maximum.
 * Chaque écran (ScreenDef.render) est écrit une seule fois et affiché en page ou en fenêtre.
 * Le menu ne montre que les applications installées (EF-APP-04).
 */

import { ChevronsUpDownIcon, LogOutIcon, SearchIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useReducer, useRef } from "react";
import { toast } from "sonner";
import { useIsMobile } from "../hooks/use-mobile";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
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
import { ScreenContainerContext } from "./workspace/context";
import { ModeSwitch } from "./workspace/ModeSwitch";
import { MosaicTiles } from "./workspace/MosaicTiles";
import { ScreenWindow } from "./workspace/ScreenWindow";
import { type LayoutMode, MAX_OPEN, canOpen, initialWorkspace, workspaceReducer } from "./workspace/state";
import { TabsBar } from "./workspace/TabsBar";
import type { ScreenDef } from "./workspace/types";

export type ShellUser = { name: string; role: string; initials: string };
export type ShellCompany = { name: string; detail: string; logo: ReactNode };

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
                <AvatarFallback className="rounded-lg bg-sidebar-primary font-semibold text-sidebar-primary-foreground">{user.initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-sidebar-accent-foreground">{user.name}</span>
                <span className="truncate text-xs">{user.role}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <UserMenuContent user={user} side={isMobile ? "bottom" : "right"} onSignOut={onSignOut} />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserMenuContent({ user, side, onSignOut }: { user: ShellUser; side: "bottom" | "right"; onSignOut?: () => void }) {
  const t = useTranslations("ui.shell");
  return (
    <DropdownMenuContent className="min-w-56" side={side} align="end" sideOffset={4}>
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
  );
}

/** Menu utilisateur compact de l'en-tête (mode Mosaïque, sans menu latéral). */
function HeaderUserMenu({ user, onSignOut }: { user: ShellUser; onSignOut?: () => void }) {
  const t = useTranslations("ui.shell");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={t("userMenu")} className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="size-8 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary font-semibold text-primary-foreground">{user.initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <UserMenuContent user={user} side="bottom" onSignOut={onSignOut} />
    </DropdownMenu>
  );
}

function CompanyBadge({ company, onSidebar }: { company: ShellCompany; onSidebar: boolean }) {
  return (
    <>
      <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">{company.logo}</div>
      {/* En-tête du mode Mosaïque sur téléphone : logo seul, faute de place */}
      <div className={`min-w-0 flex-1 text-left text-sm leading-tight ${onSidebar ? "grid" : "hidden sm:grid"}`}>
        <span className={`truncate font-semibold ${onSidebar ? "text-sidebar-accent-foreground" : ""}`}>{company.name}</span>
        <span className={`truncate text-xs ${onSidebar ? "" : "text-muted-foreground"}`}>{company.detail}</span>
      </div>
    </>
  );
}

function AppNav({ screens, current, onOpen }: { screens: ScreenDef[]; current: string | null; onOpen: (key: string) => void }) {
  const t = useTranslations("ui.shell");
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("apps")}</SidebarGroupLabel>
      <SidebarMenu>
        {screens.map((s) => (
          <SidebarMenuItem key={s.key}>
            <SidebarMenuButton
              tooltip={s.label}
              isActive={s.key === current}
              // Écran actif en or, comme dans le prototype
              className="data-[active=true]:bg-sidebar-primary data-[active=true]:font-medium data-[active=true]:text-sidebar-primary-foreground"
              onClick={() => {
                onOpen(s.key);
                if (isMobile) setOpenMobile(false);
              }}
            >
              {s.icon}
              <span>{s.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function AppShell({
  screens,
  initialMode,
  initialScreen,
  company,
  user,
  section,
  headerRight,
  banner,
  defaultSidebarOpen = true,
  onModeChange,
  onScreenChange,
  onSignOut,
}: {
  /** Écrans des applications installées (EF-APP-04) */
  screens: ScreenDef[];
  initialMode: LayoutMode;
  /** Écran ouvert au chargement (par défaut : le premier) */
  initialScreen?: string;
  company: ShellCompany;
  user: ShellUser;
  /** Premier élément du fil d'Ariane (ex. nom de l'entreprise) */
  section?: string;
  headerRight?: ReactNode;
  banner?: ReactNode;
  /** Menu ouvert ou réduit au chargement (cookie `sidebar_state` de shadcn/ui) */
  defaultSidebarOpen?: boolean;
  /** Appelé quand l'utilisateur change de mode (pour retenir son choix) */
  onModeChange?: (mode: LayoutMode) => void;
  /** Appelé quand l'écran courant change (ex. pour mettre à jour l'adresse) */
  onScreenChange?: (key: string | null) => void;
  onSignOut?: () => void;
}) {
  const t = useTranslations("ui.shell");
  const tw = useTranslations("ui.workspace");
  const isMobile = useIsMobile();
  const fallback = screens[0]?.key ?? "";
  const start = screens.some((s) => s.key === initialScreen) ? (initialScreen as string) : fallback;
  const [state, dispatch] = useReducer(workspaceReducer, undefined, () =>
    initialWorkspace(initialMode, initialMode === "list" ? start : initialScreen && screens.some((s) => s.key === initialScreen) ? initialScreen : null),
  );
  const desktopRef = useRef<HTMLDivElement>(null);
  const screen = (key: string | null) => screens.find((s) => s.key === key);

  const deskSize = () => ({ w: desktopRef.current?.clientWidth ?? window.innerWidth - 32, h: desktopRef.current?.clientHeight ?? window.innerHeight - 160 });

  useEffect(() => {
    onScreenChange?.(state.current);
  }, [state.current, onScreenChange]);

  function open(key: string) {
    if (!canOpen(state, key)) {
      toast.warning(tw("tooMany", { count: MAX_OPEN }));
      return;
    }
    dispatch({ type: "open", key, desk: deskSize() });
  }

  function setMode(mode: LayoutMode) {
    dispatch({ type: "setMode", mode, desk: deskSize(), fallback });
    onModeChange?.(mode);
  }

  const tabs = state.open.map((o) => ({
    key: o.key,
    label: screen(o.key)?.label ?? o.key,
    active: o.key === state.current && !o.minimized,
    minimized: state.mode === "mosaic" && o.minimized,
  }));

  const searchBox = (
    <div className="relative ml-2 hidden max-w-72 flex-1 lg:block">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input type="search" placeholder={t("search")} aria-label={t("search")} className="pl-8" />
    </div>
  );

  const right = (
    <div className="ml-auto flex min-w-0 items-center gap-1">
      <ModeSwitch mode={state.mode} onChange={setMode} />
      {headerRight}
      {state.mode === "mosaic" && <HeaderUserMenu user={user} onSignOut={onSignOut} />}
    </div>
  );

  // ----- Mode Mosaïque -----
  if (state.mode === "mosaic") {
    return (
      <div className="flex h-dvh flex-col bg-background" data-layout="mosaic">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-card px-3 md:px-4">
          <div className="flex min-w-0 items-center gap-2 md:w-60">
            <CompanyBadge company={company} onSidebar={false} />
          </div>
          {searchBox}
          {right}
        </header>
        <TabsBar
          items={tabs}
          closable
          onSelect={(key) => dispatch({ type: "focus", key })}
          onClose={(key) => dispatch({ type: "close", key, fallback })}
        />
        {banner && <div className="shrink-0 px-4 pt-4 md:px-6">{banner}</div>}
        <main ref={desktopRef} className="relative min-h-0 flex-1 overflow-hidden" aria-label={tw("desktop")}>
          <div className="absolute inset-0 overflow-auto p-4 md:p-6">
            <MosaicTiles screens={screens} openKeys={state.open.map((o) => o.key)} onOpen={open} />
          </div>
          {state.open.map((o) => {
            const s = screen(o.key);
            if (!s) return null;
            return (
              <ScreenWindow
                key={o.key}
                win={o}
                title={s.label}
                icon={s.icon}
                active={o.key === state.current}
                fullScreen={isMobile}
                // Ne rien renvoyer : pour react-rnd, « false » annulerait le déplacement
                onFocus={() => {
                  if (o.key !== state.current) dispatch({ type: "focus", key: o.key });
                }}
                onMinimize={() => dispatch({ type: "minimize", key: o.key })}
                onToggleMaximize={() => dispatch({ type: "toggleMaximize", key: o.key })}
                onClose={() => dispatch({ type: "close", key: o.key, fallback })}
                onPlace={(rect) => dispatch({ type: "place", key: o.key, rect })}
              >
                {s.render()}
              </ScreenWindow>
            );
          })}
        </main>
      </div>
    );
  }

  // ----- Mode Liste -----
  const currentScreen = screen(state.current);
  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen} data-layout="list">
      <Sidebar collapsible="icon" aria-label={t("navigation")}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="pointer-events-none">
                <CompanyBadge company={company} onSidebar />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <AppNav screens={screens} current={state.current} onOpen={open} />
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
                <BreadcrumbPage>{currentScreen?.label}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {searchBox}
          {right}
        </header>
        <TabsBar
          items={tabs}
          closable={tabs.length > 1}
          onSelect={(key) => dispatch({ type: "focus", key })}
          onClose={(key) => dispatch({ type: "close", key, fallback })}
        />
        {banner && <div className="px-4 pt-4 md:px-6">{banner}</div>}
        <main className="@container min-w-0 flex-1 p-4 md:p-6">
          {/* Tous les écrans ouverts restent montés (saisie conservée) ; seul l'onglet actif est visible */}
          <ScreenContainerContext.Provider value="page">
            {state.open.map((o) => (
              <div key={o.key} data-screen={o.key} hidden={o.key !== state.current}>
                {screen(o.key)?.render()}
              </div>
            ))}
          </ScreenContainerContext.Provider>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
