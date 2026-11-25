"use client";

import { useTranslations } from "next-intl";

export const STATUS_TONES = {
  draft: "muted",
  validated: "green",
  paid: "green",
  partial: "amber",
  late: "red",
  cancelled: "red",
  inStock: "green",
  lowStock: "amber",
  outOfStock: "red",
  info: "blue",
} as const;
export type Status = keyof typeof STATUS_TONES;

const TONE_CLASSES = {
  muted: "bg-bg text-ink-2 border-line",
  green: "bg-green-l text-green border-transparent",
  amber: "bg-amber-l text-amber border-transparent",
  red: "bg-red-l text-red border-transparent",
  blue: "bg-blue-l text-blue border-transparent",
} as const;

/** Badge de statut : la couleur dépend du statut, le texte vient des traductions. */
export function StatusBadge({ status, label }: { status: Status; label?: string }) {
  const t = useTranslations("ui.status");
  const tone = STATUS_TONES[status];
  return (
    <span
      data-status={status}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {label ?? t(status)}
    </span>
  );
}
