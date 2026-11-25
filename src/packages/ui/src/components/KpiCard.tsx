"use client";

import { Dropdown } from "antd";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";

const TONES = {
  accent: "bg-bg text-accent-strong",
  blue: "bg-blue-l text-blue",
  green: "bg-green-l text-green",
  amber: "bg-amber-l text-amber",
  red: "bg-red-l text-red",
  purple: "bg-purple-l text-purple",
  teal: "bg-teal-l text-teal",
} as const;

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
  onCustomize?: (action: "edit" | "hide" | "moveFirst") => void;
};

/** Carte de chiffre clé, cliquable, personnalisable au clic droit. */
export function KpiCard({ label, value, delta, hint, icon, tone = "accent", onClick, onCustomize }: KpiCardProps) {
  const t = useTranslations("ui.kpi");
  const format = useFormatter();
  const up = (delta ?? 0) >= 0;
  const card = (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col gap-2 rounded-card border border-line bg-card p-4 text-left shadow-card transition hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted">{label}</span>
        {icon && <span className={`flex size-9 items-center justify-center rounded-control ${TONES[tone]}`}>{icon}</span>}
      </div>
      <span className="text-2xl font-semibold tracking-tight text-ink">{value}</span>
      {(delta !== undefined || hint) && (
        <span className="flex items-center gap-1 text-xs">
          {delta !== undefined && (
            <span className={`inline-flex items-center gap-0.5 font-medium ${up ? "text-green" : "text-red"}`}>
              {up ? <ArrowUpRight className="size-3.5" aria-hidden /> : <ArrowDownRight className="size-3.5" aria-hidden />}
              {format.number(Math.abs(delta), { maximumFractionDigits: 1 })} %
            </span>
          )}
          {hint && <span className="text-muted">{hint}</span>}
        </span>
      )}
    </button>
  );
  if (!onCustomize) return card;
  return (
    <Dropdown
      trigger={["contextMenu"]}
      menu={{
        items: [
          { key: "edit", label: t("customize") },
          { key: "moveFirst", label: t("moveFirst") },
          { type: "divider" },
          { key: "hide", label: t("hide"), danger: true },
        ],
        onClick: ({ key }) => onCustomize(key as "edit" | "hide" | "moveFirst"),
      }}
    >
      <div>{card}</div>
    </Dropdown>
  );
}
