"use client";

import { DatePicker, Segmented } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";

export const PERIODS = ["today", "week", "month", "quarter", "year", "custom"] as const;
export type PeriodKey = (typeof PERIODS)[number];
export type PeriodValue = { key: PeriodKey; from: Dayjs; to: Dayjs };

/** Calcule les dates d'une période prédéfinie à partir d'aujourd'hui. */
export function periodRange(key: Exclude<PeriodKey, "custom">, today: Dayjs = dayjs()): { from: Dayjs; to: Dayjs } {
  switch (key) {
    case "today":
      return { from: today.startOf("day"), to: today.endOf("day") };
    case "week":
      // Semaine du lundi au dimanche
      return { from: today.subtract((today.day() + 6) % 7, "day").startOf("day"), to: today.endOf("day") };
    case "month":
      return { from: today.startOf("month"), to: today.endOf("day") };
    case "quarter": {
      const start = today.month(Math.floor(today.month() / 3) * 3).startOf("month");
      return { from: start, to: today.endOf("day") };
    }
    case "year":
      return { from: today.startOf("year"), to: today.endOf("day") };
  }
}

/** Barre de période en tête de module (même composant partout). */
export function PeriodBar({ value, onChange }: { value: PeriodValue; onChange: (value: PeriodValue) => void }) {
  const t = useTranslations("ui.period");
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-3 rounded-card border border-line bg-card p-2 shadow-card">
      <CalendarDays className="ml-1 hidden size-4 text-muted sm:block" aria-hidden />
      <div className="max-w-full overflow-x-auto">
      <Segmented<PeriodKey>
        value={value.key}
        options={PERIODS.map((k) => ({ value: k, label: t(k) }))}
        onChange={(key) => {
          if (key === "custom") onChange({ ...value, key });
          else onChange({ key, ...periodRange(key) });
        }}
      />
      </div>
      <DatePicker.RangePicker
        aria-label={t("range")}
        value={[value.from, value.to]}
        format="DD/MM/YYYY"
        allowClear={false}
        onChange={(range) => {
          if (range?.[0] && range[1]) onChange({ key: "custom", from: range[0], to: range[1] });
        }}
      />
    </div>
  );
}
