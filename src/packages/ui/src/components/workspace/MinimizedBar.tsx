"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export type MinimizedItem = { key: string; label: string; icon: ReactNode };

/**
 * Barre des fenêtres réduites du mode Mosaïque, en bas à gauche du bureau
 * (comportement de la vidéo de référence du 26/11/2026) : un petit bouton par fenêtre réduite,
 * avec son icône et son titre ; un clic la fait revenir au premier plan.
 */
export function MinimizedBar({ items, onRestore }: { items: MinimizedItem[]; onRestore: (key: string) => void }) {
  const t = useTranslations("ui.workspace");
  const tw = useTranslations("ui.window");
  return (
    <nav aria-label={t("minimizedBar")} className="flex h-11 shrink-0 items-center gap-2 overflow-x-auto border-t bg-card px-3" data-testid="minimized-bar">
      {items.length === 0 ? (
        <span className="text-xs text-muted-foreground">{t("noMinimized")}</span>
      ) : (
        items.map((item) => (
          <button
            key={item.key}
            type="button"
            data-minimized-window={item.key}
            title={tw("restore", { name: item.label })}
            aria-label={tw("restore", { name: item.label })}
            onClick={() => onRestore(item.key)}
            className="flex h-8 max-w-48 shrink-0 items-center gap-2 rounded-lg border bg-background px-2.5 text-sm shadow-card outline-none hover:border-primary focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-gold-strong"
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </button>
        ))
      )}
    </nav>
  );
}
