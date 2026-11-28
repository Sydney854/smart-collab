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

import {
  ArrowLeftIcon,
  CheckIcon,
  LogOutIcon,
  MinusIcon,
  MoreHorizontalIcon,
  PaletteIcon,
  PictureInPicture2Icon,
  SettingsIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useReducer, useRef, useState } from "react";
import { toast } from "sonner";
import { useAppearance } from "../appearance";
import { useScTheme } from "../context";
import { ACCENT_PRESETS, type AccentPreset } from "../tokens";
import { useIsMobile } from "../hooks/use-mobile";
import { ModuleIcon } from "./ModuleIcon";
import { type SearchAction, SearchDialog, type SearchScope, ShellSearchContext } from "./SearchDialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import {
  Sidebar,
  SidebarContent,
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
import { OpenScreenContext, ScreenContainerContext } from "./workspace/context";
import { MinimizedBar } from "./workspace/MinimizedBar";
import { ModeSwitch } from "./workspace/ModeSwitch";
import { MosaicTiles } from "./workspace/MosaicTiles";
import { ScreenWindow } from "./workspace/ScreenWindow";
import { type LayoutMode, MAX_OPEN, canOpen, initialWorkspace, workspaceReducer } from "./workspace/state";
import { TabsBar } from "./workspace/TabsBar";
import type { ScreenDef } from "./workspace/types";

export type ShellUser = { name: string; role: string; initials: string };
/** Actions du menu utilisateur (profil, paramètres, déconnexion) */
export type UserActions = { onProfile?: () => void; onSettings?: () => void; onSignOut?: () => void };
export type ShellCompany = { name: string; detail: string; logo: ReactNode };

function UserMenuContent({ user, side, actions }: { user: ShellUser; side: "bottom" | "right"; actions: UserActions }) {
  const t = useTranslations("ui.shell");
  return (
    <DropdownMenuContent className="min-w-56" side={side} align="end" sideOffset={4}>
      <DropdownMenuLabel className="font-normal">
        <span className="block font-medium text-foreground">{user.name}</span>
        <span className="block text-xs text-muted-foreground">{user.role}</span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {/* « Mon profil » seulement quand l'écran Profil existe (pas de bouton « bientôt ») */}
        {actions.onProfile && (
          <DropdownMenuItem onSelect={actions.onProfile}>
            <UserIcon /> {t("profile")}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={actions.onSettings}>
          <SettingsIcon /> {t("settings")}
        </DropdownMenuItem>
        {/* Couleur principale : déplacée de la barre du haut vers le profil (décision du 28/11/2026) */}
        <ColorsSubMenu />
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onSelect={actions.onSignOut}>
        <LogOutIcon /> {t("signOut")}
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

function ColorsSubMenu() {
  const tt = useTranslations("ui.theme");
  const { accent, setAccent } = useScTheme();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <PaletteIcon className="size-4 text-muted-foreground" /> {tt("color")}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="p-2">
        <div className="flex gap-2" role="radiogroup" aria-label={tt("color")}>
          {(Object.keys(ACCENT_PRESETS) as AccentPreset[]).map((key) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={accent === key}
              aria-label={tt(`accents.${key}`)}
              title={tt(`accents.${key}`)}
              onClick={() => setAccent(key)}
              style={{ background: ACCENT_PRESETS[key].accent, color: ACCENT_PRESETS[key].on }}
              className="flex size-7 items-center justify-center rounded-full ring-offset-2 ring-offset-popover outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            >
              {accent === key && <CheckIcon className="size-4" aria-hidden />}
            </button>
          ))}
        </div>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

/** Profil, à droite de la barre du haut, dans les deux modes (maquette validée le 28/11/2026) */
function HeaderUserMenu({ user, actions }: { user: ShellUser; actions: UserActions }) {
  const t = useTranslations("ui.shell");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={t("userMenu")} title={user.name} className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:ring-2 data-[state=open]:ring-foreground">
          <Avatar className="size-[34px]">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">{user.initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <UserMenuContent user={user} side="bottom" actions={actions} />
    </DropdownMenu>
  );
}

/** Entreprise en mode Mosaïque (pas de menu latéral) : « ··· » pour voir le détail ou en changer */
function CompanyMenu({ company, onSwitch }: { company: ShellCompany; onSwitch?: () => void }) {
  const t = useTranslations("ui.shell");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("companyMenu", { name: company.name })}
          className="flex min-w-0 items-center gap-2 rounded-lg border bg-card p-0.5 text-sm font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:py-1 sm:pr-2 sm:pl-1"
        >
          <span className="grid size-6 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground [&_svg]:size-3.5">{company.logo}</span>
          <span className="hidden truncate sm:inline">{company.name}</span>
          <MoreHorizontalIcon className="hidden size-4 shrink-0 text-muted-foreground sm:block" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        <DropdownMenuLabel className="font-normal">
          <span className="block font-medium text-foreground">{company.name}</span>
          <span className="block text-xs text-muted-foreground">{company.detail}</span>
        </DropdownMenuLabel>
        {onSwitch && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onSwitch}>{t("switchCompany")}</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
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
  // Les modules gardent dans le menu leur icône illustrée, au style choisi dans Paramètres → Apparence (décision du 28/11/2026)
  const { iconStyle } = useAppearance();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("apps")}</SidebarGroupLabel>
      <SidebarMenu>
        {screens.filter((s) => !s.hidden).map((s) => (
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
              {s.moduleIcon ? (
                <ModuleIcon module={s.moduleIcon} iconStyle={iconStyle} data-nav-icon className="!size-5 shrink-0" />
              ) : (
                s.icon
              )}
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
  // section : ancien fil d'Ariane, remplacé par la barre du haut (28/11/2026)
  headerRight,
  banner,
  defaultSidebarOpen = true,
  onModeChange,
  onScreenChange,
  userActions = {},
  onSearch,
  searchActions = [],
  onSwitchCompany,
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
  userActions?: UserActions;
  /** Recherche globale : appelée quand on lance une recherche (limitée ou non à un module) */
  onSearch?: (query: string, scope: SearchScope | null) => void;
  /** Actions rapides de la recherche (ex. inviter une personne) */
  searchActions?: SearchAction[];
  /** Changer d'entreprise (personne rattachée à plusieurs entreprises) */
  onSwitchCompany?: () => void;
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

  const { iconStyle } = useAppearance();
  // Même icône partout pour un écran : tuile, menu, barre, fenêtre (icône illustrée du module au style choisi)
  const iconOf = (key: string) => {
    const s = screen(key);
    return s?.moduleIcon ? <ModuleIcon module={s.moduleIcon} iconStyle={iconStyle} className="!size-4 shrink-0" /> : s?.icon;
  };
  const tabs = state.open.map((o) => ({
    key: o.key,
    label: screen(o.key)?.label ?? o.key,
    icon: iconOf(o.key),
    active: o.key === state.current && !o.minimized,
    minimized: state.mode === "mosaic" && o.minimized,
  }));

  // Barre des écrans ouverts : en haut ou en bas selon Paramètres → Apparence (décision du 28/11/2026)
  const { barPosition } = useAppearance();
  // Mode Liste : un seul écran ouvert → pas de barre ; l'écran affiché vient en premier
  const openScreensBar = tabs.length > 1 && <TabsBar
          position={barPosition}
          items={[...tabs].sort((a, b) => Number(b.active) - Number(a.active))}
          closable={tabs.length > 1}
          onSelect={(key) => dispatch({ type: "focus", key })}
          onClose={(key) => dispatch({ type: "close", key, fallback })}
        />;
  const twin = useTranslations("ui.window");
  // Fenêtre agrandie au premier plan (ordinateur) : sa barre d'outils s'affiche sous le profil
  const topOpen = state.mode === "mosaic" && !isMobile ? state.open.find((o) => o.key === state.current && !o.minimized && o.maximized) : undefined;
  const maximizedTop = topOpen?.key ?? null;
  const maximizedLabel = topOpen ? (screen(topOpen.key)?.label ?? topOpen.key) : "";
  const minimizedBar = (
    <MinimizedBar
          position={barPosition}
          items={state.open.map((o) => ({
            key: o.key,
            label: screen(o.key)?.label ?? o.key,
            icon: iconOf(o.key),
            maximized: o.maximized,
            state: o.minimized ? ("minimized" as const) : o.key === state.current ? ("front" as const) : ("open" as const),
          }))}
          onRestore={(key) => {
            // Comme une barre des tâches : fenêtre au premier plan → elle se replie ; sinon elle revient au premier plan
            // dans son dernier format, agrandie ou en fenêtre (décision du 28/11/2026)
            if (key === state.current) dispatch({ type: "minimize", key });
            else dispatch({ type: "focus", key });
          }}
          onClose={(key) => dispatch({ type: "close", key, fallback })}
        />
  );

  // Recherche globale (maquette validée le 28/11/2026) : loupe de l'en-tête ou Ctrl + K
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const visibleScreens = screens.filter((s) => !s.hidden);
  const searchDialog = (
    <SearchDialog
      open={searchOpen}
      onOpenChange={setSearchOpen}
      // « Je recherche » : seulement les modules installés (les écrans affichés dans le menu)
      scopes={visibleScreens.filter((s) => s.app).map((s) => ({ key: s.key, label: s.label }))}
      screens={screens.map((s) => ({ key: `screen:${s.key}`, label: s.label, keywords: s.description, icon: iconOf(s.key), run: () => open(s.key) }))}
      // Actions rapides : seulement celles dont l'écran est permis à la personne (droits lus côté serveur)
      actions={searchActions
        .filter((a) => !a.screen || screen(a.screen))
        .map((a) => (a.screen ? { ...a, icon: a.icon ?? iconOf(a.screen), run: () => open(a.screen as string) } : a))}
      onSearch={(q, scope) => onSearch?.(q, scope)}
    />
  );
  // Paramètres du menu du profil : ouvre l'écran Paramètres s'il est disponible
  const actions: UserActions = {
    ...userActions,
    onSettings: userActions.onSettings ?? (screen("settings") ? () => open("settings") : undefined),
  };

  // Barre du haut en carte arrondie : à droite réseau, recherche, langue, nuit / jour, cloche (headerRight), puis le profil
  const right = (
    <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2">
      {headerRight}
      <Separator orientation="vertical" className="mx-0.5 data-vertical:h-6 data-vertical:self-auto" />
      <HeaderUserMenu user={user} actions={actions} />
    </div>
  );
  const topBar = (left: ReactNode) => (
    <div className="shrink-0 px-2 pt-2 sm:px-3 sm:pt-3 md:px-4">
      <header className="flex h-14 items-center gap-1 rounded-xl border bg-card px-2 shadow-card sm:gap-2 md:px-3" data-testid="top-bar">
        {left}
        {right}
      </header>
    </div>
  );

  // ----- Mode Mosaïque -----
  if (state.mode === "mosaic") {
    return (
      <OpenScreenContext.Provider value={open}>
      <ShellSearchContext.Provider value={() => setSearchOpen(true)}>
      <div className="flex h-dvh flex-col bg-background" data-layout="mosaic">
        {topBar(
          <>
            <ModeSwitch mode={state.mode} onChange={setMode} />
            <Separator orientation="vertical" className="mx-0.5 data-vertical:h-6 data-vertical:self-auto" />
            <CompanyMenu company={company} onSwitch={onSwitchCompany} />
          </>,
        )}
        {/* Pas de barre d'onglets en Mosaïque (décision du 26/11/2026) : les fenêtres réduites vont dans la barre du bas */}
        {banner && <div className="shrink-0 px-4 pt-4 md:px-6">{banner}</div>}
        {barPosition === "top" && minimizedBar}
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
                icon={iconOf(o.key)}
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
          {/* Fenêtre agrandie : petite barre d'outils sous le profil (accueil, replier, fenêtre surgissante, fermer) */}
          {maximizedTop && (
            <div
              role="toolbar"
              aria-label={twin("maximizedTools")}
              data-testid="maximized-tools"
              className="absolute top-2 right-3 z-[9999] flex flex-col gap-1.5 rounded-full border bg-card/90 p-1 shadow-card backdrop-blur"
            >
              <button type="button" title={twin("home")} aria-label={twin("home")} onClick={() => dispatch({ type: "minimizeAll" })}
                className="grid size-8 place-items-center rounded-full bg-primary/15 text-gold-strong outline-none hover:bg-primary/25 focus-visible:ring-2 focus-visible:ring-ring">
                <ArrowLeftIcon className="size-4" />
              </button>
              <button type="button" title={twin("minimize", { name: maximizedLabel })} aria-label={twin("minimize", { name: maximizedLabel })} onClick={() => dispatch({ type: "minimize", key: maximizedTop })}
                className="grid size-8 place-items-center rounded-full bg-amber-l text-amber outline-none hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ring">
                <MinusIcon className="size-4" />
              </button>
              <button type="button" title={twin("float", { name: maximizedLabel })} aria-label={twin("float", { name: maximizedLabel })} onClick={() => dispatch({ type: "toggleMaximize", key: maximizedTop })}
                className="grid size-8 place-items-center rounded-full bg-blue-l text-blue outline-none hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ring">
                <PictureInPicture2Icon className="size-4" />
              </button>
              <button type="button" title={twin("close", { name: maximizedLabel })} aria-label={twin("close", { name: maximizedLabel })} onClick={() => dispatch({ type: "close", key: maximizedTop, fallback })}
                className="grid size-8 place-items-center rounded-full bg-red-l text-red outline-none hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ring">
                <XIcon className="size-4" />
              </button>
            </div>
          )}
        </main>
        {barPosition === "bottom" && minimizedBar}
      </div>
      {searchDialog}
      </ShellSearchContext.Provider>
      </OpenScreenContext.Provider>
    );
  }

  // ----- Mode Liste -----
  return (
    <OpenScreenContext.Provider value={open}>
    <ShellSearchContext.Provider value={() => setSearchOpen(true)}>
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
        {/* Libellé traduit (le composant shadcn d'origine dit « Toggle Sidebar ») */}
        <SidebarRail aria-label={t("menuEdge")} title={t("menuEdge")} />
      </Sidebar>
      <SidebarInset className="min-w-0">
        <div className="sticky top-0 z-10 bg-background">
          {topBar(
            <>
              <SidebarTrigger aria-label={t("toggleMenu")} className="size-8" />
              <Separator orientation="vertical" className="mx-0.5 data-vertical:h-6 data-vertical:self-auto" />
              <ModeSwitch mode={state.mode} onChange={setMode} />
            </>,
          )}
        </div>
        {barPosition === "top" && openScreensBar}
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
        {/* Écrans ouverts : en bas, dans le style de la barre de la Mosaïque (plus de barre d'onglets en haut) */}
        {barPosition === "bottom" && openScreensBar}
      </SidebarInset>
    </SidebarProvider>
    {searchDialog}
    </ShellSearchContext.Provider>
    </OpenScreenContext.Provider>
  );
}
