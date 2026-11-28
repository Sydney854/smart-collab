"use client";

import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export type TabItem = { key: string; label: string; active: boolean; minimized: boolean; icon?: ReactNode };

/**
 * Barre des écrans ouverts du mode Liste, en bas de l'écran, dans le style de la barre des fenêtres réduites
 * de la Mosaïque (décision du 28/11/2026 : plus de barre d'onglets en haut). L'écran affiché est en or.
 */
export function TabsBar({
  items,
  closable,
  onSelect,
  onClose,
}: {
  items: TabItem[];
  closable: boolean;
  onSelect: (key: string) => void;
  onClose: (key: string) => void;
}) {
  const t = useTranslations("ui.shell");
  const tw = useTranslations("ui.window");
  return (
    <nav
      aria-label={t("openTabs")}
      data-testid="open-screens-bar"
      className="sticky bottom-0 z-10 flex h-11 shrink-0 items-center gap-2 overflow-x-auto border-t bg-card px-3 max-sm:h-14"
    >
      {items.map((item) => (
        <div
          key={item.key}
          data-tab={item.key}
          data-active={item.active}
          data-minimized={item.minimized}
          className="flex h-8 max-w-56 shrink-0 items-center rounded-lg border bg-background text-sm shadow-card hover:border-primary data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:font-medium max-sm:h-11"
        >
          <button
            type="button"
            className="flex h-full min-w-0 items-center gap-2 rounded-l-lg pr-1 pl-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-gold-strong"
            aria-current={item.active ? "page" : undefined}
            title={item.minimized ? tw("restore", { name: item.label }) : undefined}
            onClick={() => onSelect(item.key)}
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </button>
          {closable && (
            <button
              type="button"
              aria-label={t("closeTab", { name: item.label })}
              className="grid h-full w-7 shrink-0 place-items-center rounded-r-lg text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring max-sm:w-11"
              onClick={() => onClose(item.key)}
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}
