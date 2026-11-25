"use client";

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Badge } from "./ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "./ui/context-menu";

const TONES = {
  gold: "bg-primary/15 text-gold-strong",
  blue: "bg-blue-l text-blue",
  green: "bg-green-l text-green",
  amber: "bg-amber-l text-amber",
  red: "bg-red-l text-red",
  purple: "bg-purple-l text-purple",
  teal: "bg-teal-l text-teal",
} as const;

export type KpiAction = "edit" | "moveFirst" | "hide";
export type KpiCardProps = {
  label: string;
  value: string;
  /** Variation en % par rapport à la période précédente */
  delta?: number;
  hint?: string;
  icon?: ReactNode;
  tone?: keyof typeof TONES;
  onClick?: () => void;
  /** Actions du clic droit (personnaliser, masquer…) */
  onCustomize?: (action: KpiAction) => void;
};

/**
 * Carte de chiffre clé (bloc shadcn « dashboard-01 », section-cards),
 * cliquable et personnalisable au clic droit.
 */
export function KpiCard({ label, value, delta, hint, icon, tone = "gold", onClick, onCustomize }: KpiCardProps) {
  const t = useTranslations("ui.kpi");
  const format = useFormatter();
  const up = (delta ?? 0) >= 0;
  const card = (
    <Card
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      className="@container/card gap-3 bg-linear-to-t from-primary/5 to-card shadow-card transition-colors outline-none hover:ring-primary/60 focus-visible:ring-2 focus-visible:ring-ring data-[clickable=true]:cursor-pointer dark:bg-card"
      data-clickable={Boolean(onClick)}
      data-kpi=""
    >
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{value}</CardTitle>
        {icon && (
          <CardAction>
            <span className={`flex size-9 items-center justify-center rounded-lg [&_svg]:size-[18px] ${TONES[tone]}`}>{icon}</span>
          </CardAction>
        )}
      </CardHeader>
      {(delta !== undefined || hint) && (
        <CardFooter className="gap-2 text-sm">
          {delta !== undefined && (
            <Badge variant="outline" className={up ? "text-green" : "text-red"}>
              {up ? <TrendingUpIcon /> : <TrendingDownIcon />}
              {up ? "+" : "−"}
              {format.number(Math.abs(delta), { maximumFractionDigits: 1 })} %
            </Badge>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </CardFooter>
      )}
    </Card>
  );
  if (!onCustomize) return card;
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{card}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => onCustomize("edit")}>{t("customize")}</ContextMenuItem>
        <ContextMenuItem onSelect={() => onCustomize("moveFirst")}>{t("moveFirst")}</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onSelect={() => onCustomize("hide")}>
          {t("hide")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
