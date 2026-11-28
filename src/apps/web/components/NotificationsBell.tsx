"use client";

import { HEADER_ICON_BUTTON } from "@smart-collab/ui";
import { Button } from "@smart-collab/ui/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@smart-collab/ui/components/ui/popover";
import { Switch } from "@smart-collab/ui/components/ui/switch";
import { BellIcon, BellOffIcon, CheckIcon, HourglassIcon, PackageMinusIcon, UserPlusIcon, XIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { type NotificationItem, loadNotifications } from "@/lib/notifications/actions";

const READ_KEY = "sc-notifications-read";
const FIRST = 5;

function readIds(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(READ_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}
function saveIds(ids: string[]) {
  try {
    // On ne garde que les 200 derniers identifiants lus
    window.localStorage.setItem(READ_KEY, JSON.stringify(ids.slice(-200)));
  } catch {
    // Stockage indisponible : tout reste « non lu » sur cet appareil
  }
}

const TONES: Record<NotificationItem["kind"], { icon: React.ReactNode; className: string }> = {
  appInstalled: { icon: <CheckIcon />, className: "bg-green-l text-green" },
  appUninstalled: { icon: <PackageMinusIcon />, className: "bg-amber-l text-amber" },
  invitationAccepted: { icon: <UserPlusIcon />, className: "bg-blue-l text-blue" },
  trialEnds: { icon: <HourglassIcon />, className: "bg-purple-l text-purple" },
};

/**
 * Cloche de la barre du haut (maquette validée le 28/11/2026) : point rouge s'il reste du non lu,
 * « Uniquement non lu », « Marquer tout comme lu », « Afficher toutes les notifications ».
 * L'état « lu » est retenu sur cet appareil.
 */
export function NotificationsBell() {
  const t = useTranslations("notifications");
  const format = useFormatter();
  const locale = useLocale() as "fr" | "en";
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [read, setRead] = useState<string[]>([]);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState(false);

  const refresh = () =>
    loadNotifications()
      .then(setItems)
      .catch(() => setItems([]));
  useEffect(() => {
    setRead(readIds());
    void refresh();
  }, []);

  const unread = items.filter((n) => !read.includes(n.id));
  const shown = (unreadOnly ? unread : items).slice(0, all ? undefined : FIRST);
  const markRead = (ids: string[]) => {
    const next = [...new Set([...read, ...ids])];
    setRead(next);
    saveIds(next);
  };

  const text = (n: NotificationItem) => {
    const app = n.app ? (n.app[locale] ?? n.app.fr) : "";
    switch (n.kind) {
      case "appInstalled":
        return { title: t("appInstalled.title"), body: t("appInstalled.body", { app }) };
      case "appUninstalled":
        return { title: t("appUninstalled.title"), body: t("appUninstalled.body", { app }) };
      case "invitationAccepted":
        return { title: t("invitationAccepted.title"), body: t("invitationAccepted.body", { person: n.person ?? "" }) };
      case "trialEnds":
        return { title: t("trialEnds.title"), body: t("trialEnds.body", { days: n.days ?? 0 }) };
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setAll(false);
          void refresh();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`relative ${HEADER_ICON_BUTTON} data-[state=open]:ring-2 data-[state=open]:ring-foreground`}
          aria-label={unread.length ? t("openUnread", { count: unread.length }) : t("open")}
          title={t("title")}
          data-testid="notifications-button"
        >
          <BellIcon />
          {unread.length > 0 && <span className="absolute top-1 right-1 size-2 rounded-full bg-red ring-2 ring-card" data-testid="notifications-dot" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-[min(26rem,calc(100vw-1rem))] p-0" data-testid="notifications-panel">
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <h2 className="flex-1 font-semibold">{t("title")}</h2>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Switch checked={unreadOnly} onCheckedChange={setUnreadOnly} aria-label={t("unreadOnly")} />
            {t("unreadOnly")}
          </label>
          <Button variant="outline" size="icon" className="size-7" aria-label={t("close")} onClick={() => setOpen(false)}>
            <XIcon />
          </Button>
        </div>
        {shown.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-muted-foreground" data-testid="notifications-empty">
            <BellOffIcon className="size-6" aria-hidden />
            {unreadOnly && items.length > 0 ? t("noUnread") : t("empty")}
          </div>
        ) : (
          <ul className="max-h-[60vh] overflow-y-auto">
            {shown.map((n) => {
              const { title, body } = text(n);
              const isUnread = !read.includes(n.id);
              return (
                <li key={n.id} data-notification={n.kind} className="flex gap-3 border-b px-4 py-3 last:border-b-0">
                  <span className={`grid size-9 shrink-0 place-items-center rounded-full [&_svg]:size-4 ${TONES[n.kind].className}`} aria-hidden>
                    {TONES[n.kind].icon}
                  </span>
                  <button type="button" className="min-w-0 flex-1 text-left outline-none focus-visible:underline" onClick={() => markRead([n.id])}>
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      {title}
                      {isUnread && <span className="size-1.5 rounded-full bg-red" aria-label={t("unread")} />}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{body}</span>
                  </button>
                  <time dateTime={n.at} className="shrink-0 text-xs text-muted-foreground">
                    {format.relativeTime(new Date(n.at))}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
        <div className="flex items-center justify-between gap-2 border-t px-4 py-2.5 text-sm">
          <button type="button" className="text-muted-foreground hover:text-foreground disabled:opacity-50" disabled={unread.length === 0} onClick={() => markRead(items.map((n) => n.id))}>
            {t("markAll")}
          </button>
          {!all && (unreadOnly ? unread : items).length > FIRST && (
            <button type="button" className="font-semibold text-gold-strong hover:underline" onClick={() => setAll(true)}>
              {t("showAll")}
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
