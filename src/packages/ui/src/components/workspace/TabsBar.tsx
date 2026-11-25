"use client";

import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export type TabItem = { key: string; label: string; active: boolean; minimized: boolean };

/**
 * Barre d'onglets : écrans ouverts (mode Liste) ou fenêtres ouvertes (mode Mosaïque).
 * Une fenêtre réduite y reste, en italique ; un clic la fait revenir.
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
    <nav aria-label={t("openTabs")} className="flex min-h-[41px] shrink-0 gap-1 overflow-x-auto border-b bg-card px-3 pt-2 md:px-4">
      {items.map((item) => (
        <div
          key={item.key}
          data-tab={item.key}
          data-active={item.active}
          data-minimized={item.minimized}
          className="group flex shrink-0 items-center rounded-t-lg border border-b-0 border-transparent text-sm text-muted-foreground data-[active=true]:border-border data-[active=true]:bg-background data-[active=true]:font-medium data-[active=true]:text-foreground data-[minimized=true]:italic"
        >
          <button
            type="button"
            className="px-3 py-1.5"
            aria-current={item.active ? "page" : undefined}
            title={item.minimized ? tw("restore", { name: item.label }) : undefined}
            onClick={() => onSelect(item.key)}
          >
            {item.label}
          </button>
          {closable && (
            <button type="button" aria-label={t("closeTab", { name: item.label })} className="mr-1 rounded p-0.5 hover:bg-accent" onClick={() => onClose(item.key)}>
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}
