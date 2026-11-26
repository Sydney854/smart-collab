"use client";

import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export type MinimizedItem = { key: string; label: string; icon: ReactNode };

/**
 * Barre des fenêtres réduites du mode Mosaïque, en bas à gauche du bureau (décision du 26/11/2026) :
 * un petit bouton par fenêtre réduite (icône + titre) ; un clic la restaure, la croix la ferme.
 * La barre n'apparaît que s'il y a au moins une fenêtre réduite.
 */
export function MinimizedBar({
  items,
  onRestore,
  onClose,
}: {
  items: MinimizedItem[];
  onRestore: (key: string) => void;
  onClose: (key: string) => void;
}) {
  const t = useTranslations("ui.workspace");
  const tw = useTranslations("ui.window");
  if (items.length === 0) return null;
  return (
    <nav aria-label={t("minimizedBar")} className="flex h-11 shrink-0 items-center max-sm:h-14 gap-2 overflow-x-auto border-t bg-card px-3" data-testid="minimized-bar">
      {items.map((item) => (
        <span
          key={item.key}
          data-minimized-window={item.key}
          className="flex h-8 max-w-56 shrink-0 max-sm:h-11 items-center rounded-lg border bg-background text-sm shadow-card hover:border-primary"
        >
          <button
            type="button"
            title={tw("restore", { name: item.label })}
            aria-label={tw("restore", { name: item.label })}
            onClick={() => onRestore(item.key)}
            className="flex h-full min-w-0 items-center gap-2 rounded-l-lg pr-1 pl-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-gold-strong"
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </button>
          <button
            type="button"
            title={tw("close", { name: item.label })}
            aria-label={tw("close", { name: item.label })}
            onClick={() => onClose(item.key)}
            className="grid h-full w-7 shrink-0 max-sm:w-11 place-items-center rounded-r-lg text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <XIcon className="size-3.5" aria-hidden />
          </button>
        </span>
      ))}
    </nav>
  );
}
