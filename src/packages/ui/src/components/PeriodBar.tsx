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

/** Bouton de date : un seul mois de calendrier, qui se referme dès qu'une date est choisie. */
function DateButton({
  label,
  value,
  onSelect,
  disabled,
}: {
  label: string;
  value: Date;
  onSelect: (date: Date) => void;
  disabled?: (date: Date) => boolean;
}) {
  const locale = useDateLocale();
  const formatDate = useFormatDate();
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" aria-label={`${label} : ${formatDate(value, "dd/MM/yyyy")}`} className="font-normal tabular-nums">
          <CalendarDaysIcon />
          <span className="text-muted-foreground">{label}</span>
          {formatDate(value, "dd/MM/yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          required
          locale={locale}
          selected={value}
          defaultMonth={value}
          disabled={disabled}
          onSelect={(date) => {
            if (!date) return;
            onSelect(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * Barre de période en tête de module (même composant partout) :
 * périodes prédéfinies, ou date de début puis date de fin (décision du 25/11/2026).
 */
export function PeriodBar({ value, onChange }: { value: PeriodValue; onChange: (value: PeriodValue) => void }) {
  const t = useTranslations("ui.period");

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
            if (key === "custom") onChange({ ...value, key: "custom" });
            else onChange({ key: key as PeriodKey, ...periodRange(key as Exclude<PeriodKey, "custom">) });
          }}
        >
          {PERIODS.map((k) => (
            <ToggleGroupItem key={k} value={k}>
              {t(k)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <DateButton
          label={t("from")}
          value={value.from}
          onSelect={(date) => {
            const from = startOfDay(date);
            // Si la date de début dépasse la date de fin, la fin suit
            onChange({ key: "custom", from, to: from > value.to ? endOfDay(date) : value.to });
          }}
        />
        <DateButton
          label={t("to")}
          value={value.to}
          disabled={(date) => date < startOfDay(value.from)}
          onSelect={(date) => onChange({ key: "custom", from: value.from, to: endOfDay(date) })}
        />
      </div>
    </div>
  );
}
