"use client";

import { useTranslations } from "next-intl";
import type { ScreenDef } from "./types";

/** Bureau du mode Mosaïque : une tuile par module. */
export function MosaicTiles({ screens, openKeys, onOpen }: { screens: ScreenDef[]; openKeys: string[]; onOpen: (key: string) => void }) {
  const t = useTranslations("ui.workspace");
  return (
    <div className="@container">
      <h1 className="sr-only">{t("tilesTitle")}</h1>
      <ul className="grid grid-cols-2 gap-3 @lg:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-6" aria-label={t("tilesTitle")}>
        {screens.map((s) => (
          <li key={s.key}>
            <button
              type="button"
              data-tile={s.key}
              onClick={() => onOpen(s.key)}
              className="group flex aspect-[4/3] w-full flex-col items-start justify-between rounded-xl border bg-card p-4 text-left shadow-card transition outline-none hover:border-primary hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary/15 text-gold-strong [&_svg]:size-6">{s.icon}</span>
              <span className="w-full">
                <span className="flex items-center gap-2 font-semibold">
                  {s.label}
                  {openKeys.includes(s.key) && <span className="size-2 rounded-full bg-primary" aria-label={t("isOpen")} />}
                </span>
                {s.description && <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{s.description}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
