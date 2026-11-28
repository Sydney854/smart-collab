"use client";

import { ClockIcon, CornerDownLeftIcon, SearchIcon, ZapIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

/** Une entrée de la recherche : écran à ouvrir ou action rapide */
/** Une entrée de la recherche : écran à ouvrir (screen) ou action quelconque (run) */
export type SearchAction = { key: string; label: string; icon?: ReactNode; keywords?: string; screen?: string; run?: () => void };
export type SearchScope = { key: string; label: string };

/** Boutons carrés de la barre du haut (taille B validée le 28/11/2026 : 32 px, dessin 16 px) */
export const HEADER_ICON_BUTTON = "size-8 rounded-lg border bg-card text-foreground shadow-none hover:bg-muted [&_svg]:size-4";

const RECENT_KEY = "sc-recent-searches";

/**
 * Portée du stockage de l'appareil : personne + entreprise (identifiants techniques seulement).
 * Sur un poste partagé, chacun garde ses recherches récentes, notifications lues et période.
 */
export const StorageScopeContext = createContext("demo");
export function useStorageKey(base: string) {
  return `${base}:${useContext(StorageScopeContext)}`;
}
/** Efface l'historique de recherche d'une personne (à la déconnexion) */
export function clearRecentSearches(scope: string) {
  try {
    window.localStorage.removeItem(`${RECENT_KEY}:${scope}`);
  } catch {
    // Stockage indisponible : rien à effacer
  }
}
const MAX_RECENT = 5;

function readRecent(key: string): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}
function saveRecent(key: string, list: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(list.slice(0, MAX_RECENT)));
  } catch {
    // Stockage indisponible (navigation privée) : la recherche marche sans historique
  }
}
/** Comparaison sans accents ni majuscules */
const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** Ouverture de la recherche depuis n'importe quel bouton de l'en-tête */
export const ShellSearchContext = createContext<() => void>(() => {});

/** Bouton loupe de la barre du haut */
export function SearchButton() {
  const t = useTranslations("ui.search");
  const open = useContext(ShellSearchContext);
  return (
    <Button variant="outline" size="icon" className={HEADER_ICON_BUTTON} aria-label={t("open")} title={t("openHint")} onClick={open} data-testid="search-button">
      <SearchIcon />
    </Button>
  );
}

type Item = { key: string; label: string; icon: ReactNode; hint?: string; run: () => void };

/**
 * Recherche globale (maquette validée le 28/11/2026) : fenêtre centrée, « Je recherche » limite la recherche
 * à un module installé, actions rapides, recherches récentes (retenues sur cet appareil). Flèches + Entrée.
 */
export function SearchDialog({
  open,
  onOpenChange,
  scopes,
  screens,
  actions,
  onSearch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scopes: SearchScope[];
  screens: SearchAction[];
  actions: SearchAction[];
  onSearch: (query: string, scope: SearchScope | null) => void;
}) {
  const t = useTranslations("ui.search");
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const recentKey = useStorageKey(RECENT_KEY);

  useEffect(() => {
    if (open) {
      setQuery("");
      setScope(null);
      setActive(0);
      setRecent(readRecent(recentKey));
    }
  }, [open]);

  const scopeDef = scopes.find((s) => s.key === scope) ?? null;
  const close = () => onOpenChange(false);
  const runSearch = (q: string) => {
    const text = q.trim();
    if (!text) return;
    const next = [text, ...readRecent(recentKey).filter((r) => r !== text)];
    saveRecent(recentKey, next);
    close();
    onSearch(text, scopeDef);
  };
  const wrap = (a: SearchAction, icon: ReactNode): Item => ({
    key: a.key,
    label: a.label,
    icon: a.icon ?? icon,
    run: () => {
      close();
      a.run?.();
    },
  });

  // Liste unique (pour le clavier) : selon que l'on a tapé quelque chose ou non
  const groups = useMemo(() => {
    const q = fold(query.trim());
    if (!q) {
      return [
        { title: t("quickActions"), items: actions.map((a) => wrap(a, <ZapIcon />)) },
        { title: t("recent"), items: recent.map((r) => ({ key: `recent:${r}`, label: r, icon: <ClockIcon />, run: () => runSearch(r) })) },
      ];
    }
    const match = (a: SearchAction) => fold(`${a.label} ${a.keywords ?? ""}`).includes(q);
    return [
      { title: t("screens"), items: screens.filter(match).map((a) => wrap(a, <SearchIcon />)) },
      { title: t("quickActions"), items: actions.filter(match).map((a) => wrap(a, <ZapIcon />)) },
      {
        title: t("everywhere"),
        items: [
          {
            key: "search",
            label: scopeDef ? t("searchIn", { query: query.trim(), scope: scopeDef.label }) : t("searchAll", { query: query.trim() }),
            icon: <SearchIcon />,
            run: () => runSearch(query),
          },
        ],
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, recent, actions, screens, scopeDef, t]);
  const flat = groups.flatMap((g) => g.items);
  const current = Math.min(active, Math.max(flat.length - 1, 0));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[12vh] translate-y-0 gap-0 p-0 sm:max-w-xl" data-testid="search-dialog">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription className="sr-only">{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 px-5 pb-5">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              // biome-ignore lint/a11y/noAutofocus: la fenêtre de recherche sert à taper tout de suite
              autoFocus
              type="search"
              value={query}
              placeholder={t("placeholder")}
              aria-label={t("placeholder")}
              role="combobox"
              aria-expanded
              aria-controls="sc-search-results"
              aria-activedescendant={flat[current] ? `sc-search-${current}` : undefined}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((i) => Math.min(i + 1, flat.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((i) => Math.max(i - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  flat[current]?.run();
                }
              }}
              className="h-10 w-full rounded-lg border border-primary bg-background pr-9 pl-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>

          {scopes.length > 0 && (
            <section>
              <h3 className="mb-2 text-sm font-semibold">{t("scope")}</h3>
              <div className="flex flex-wrap gap-2" role="group" aria-label={t("scope")}>
                {scopes.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    aria-pressed={scope === s.key}
                    onClick={() => setScope(scope === s.key ? null : s.key)}
                    className="rounded-lg border px-2.5 py-1 text-sm font-medium outline-none hover:border-primary focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-primary aria-pressed:bg-primary/15 aria-pressed:text-gold-strong"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          <div id="sc-search-results" role="listbox" aria-label={t("results")} className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto">
            {groups.map((g) => {
              if (g.items.length === 0) return null;
              return (
                <section key={g.title} role="group" aria-label={g.title}>
                  <h3 className="mb-1 text-sm font-semibold">{g.title}</h3>
                  {g.items.map((it) => {
                    const i = flat.indexOf(it);
                    return (
                      <div
                        key={it.key}
                        id={`sc-search-${i}`}
                        role="option"
                        aria-selected={i === current}
                        tabIndex={-1}
                        onMouseEnter={() => setActive(i)}
                        onClick={it.run}
                        onKeyDown={(e) => e.key === "Enter" && it.run()}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm aria-selected:bg-muted [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground"
                      >
                        {it.icon}
                        <span className="min-w-0 flex-1 truncate">{it.label}</span>
                        {i === current && (
                          <kbd className="inline-flex items-center gap-1 rounded border px-1.5 text-xs text-muted-foreground">
                            <CornerDownLeftIcon className="!size-3" aria-hidden />
                            {t("enter")}
                          </kbd>
                        )}
                      </div>
                    );
                  })}
                </section>
              );
            })}
            {query.trim() === "" && recent.length === 0 && actions.length === 0 && <p className="text-sm text-muted-foreground">{t("hint")}</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
