"use client";

import { Button } from "antd";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export type AppCardProps = {
  name: string;
  description: string;
  category: string;
  icon: ReactNode;
  installed: boolean;
  dependencies?: string[];
  onInstall?: () => void;
  onOpen?: () => void;
};

/** Carte d'une application dans l'écran « Applications » (EF-APP-01). */
export function AppCard({ name, description, category, icon, installed, dependencies = [], onInstall, onOpen }: AppCardProps) {
  const t = useTranslations("ui.appCard");
  return (
    <article className="flex h-full flex-col gap-3 rounded-card border border-line bg-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-bg text-accent-strong">{icon}</div>
        <div className="min-w-0">
          <h3 className="font-semibold text-ink">{name}</h3>
          <p className="text-xs text-muted">{category}</p>
        </div>
        {installed && <span className="ml-auto rounded-full bg-green-l px-2 py-0.5 text-xs text-green">{t("installed")}</span>}
      </div>
      <p className="flex-1 text-sm text-ink-2">{description}</p>
      {dependencies.length > 0 && (
        <p className="text-xs text-muted">
          {t("requires")} {dependencies.join(", ")}
        </p>
      )}
      {installed ? (
        <Button onClick={onOpen}>{t("open")}</Button>
      ) : (
        <Button type="primary" onClick={onInstall}>
          {t("install")}
        </Button>
      )}
    </article>
  );
}
