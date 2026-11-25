"use client";

import { endOfDay, startOfDay, startOfMonth, startOfQuarter, startOfWeek, startOfYear } from "date-fns";
import { CalendarDaysIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDateLocale, useFormatDate } from "../lib/dates";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export const PERIODS = ["today", "week", "month", "quarter", "year", "custom"] as const;
export type PeriodKey = (typeof PERIODS)[number];
export type PeriodValue = { key: PeriodKey; from: Date; to: Date };

/** Dates d'une période prédéfinie, jusqu'à aujourd'hui inclus (semaine du lundi au dimanche). */
export function periodRange(key: Exclude<PeriodKey, "custom">, today: Date = new Date()): { from: Date; to: Date } {
  const to = endOfDay(today);
  switch (key) {
    case "today":
      return { from: startOfDay(today), to };
    case "week":
      return { from: startOfWeek(today, { weekStartsOn: 1 }), to };
    case "month":
      return { from: startOfMonth(today), to };
    case "quarter":
      return { from: startOfQuarter(today), to };
    case "year":
      return { from: startOfYear(today), to };
  }
}

/** Barre de période en tête de module (même composant partout). */
export function PeriodBar({ value, onChange }: { value: PeriodValue; onChange: (value: PeriodValue) => void }) {
  const t = useTranslations("ui.period");
  const locale = useDateLocale();
  const formatDate = useFormatDate();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-xl border bg-card p-2 shadow-card">
      <div className="max-w-full overflow-x-auto">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          aria-label={t("label")}
          value={value.key}
          onValueChange={(key) => {
            if (!key) return;
            if (key === "custom") {
              onChange({ ...value, key: "custom" });
              setOpen(true);
            } else onChange({ key: key as PeriodKey, ...periodRange(key as Exclude<PeriodKey, "custom">) });
          }}
        >
          {PERIODS.map((k) => (
            <ToggleGroupItem key={k} value={k}>
              {t(k)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" aria-label={t("range")} className="font-normal tabular-nums">
            <CalendarDaysIcon />
            {formatDate(value.from, "dd/MM/yyyy")} → {formatDate(value.to, "dd/MM/yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            locale={locale}
            numberOfMonths={2}
            defaultMonth={value.from}
            selected={{ from: value.from, to: value.to }}
            onSelect={(range) => {
              if (range?.from) onChange({ key: "custom", from: startOfDay(range.from), to: endOfDay(range.to ?? range.from) });
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
