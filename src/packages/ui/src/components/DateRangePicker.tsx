"use client";

import { endOfDay, endOfMonth, endOfYear, startOfDay, startOfMonth, startOfYear, subDays, subMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { useIsMobile } from "../hooks/use-mobile";
import { useDateLocale, useFormatDate } from "../lib/dates";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

/** Raccourcis du calendrier global (décision du 28/11/2026) */
export const RANGE_PRESETS = ["today", "yesterday", "last7", "last30", "thisMonth", "lastMonth", "thisYear"] as const;
export type RangePreset = (typeof RANGE_PRESETS)[number];
export type RangeValue = { preset: RangePreset | "custom"; from: Date; to: Date };

/** Dates d'un raccourci, calculées par rapport à aujourd'hui (fin de journée incluse). */
export function presetRange(preset: RangePreset, today: Date = new Date()): { from: Date; to: Date } {
  const end = endOfDay(today);
  switch (preset) {
    case "today":
      return { from: startOfDay(today), to: end };
    case "yesterday": {
      const y = subDays(today, 1);
      return { from: startOfDay(y), to: endOfDay(y) };
    }
    case "last7":
      return { from: startOfDay(subDays(today, 6)), to: end };
    case "last30":
      return { from: startOfDay(subDays(today, 29)), to: end };
    case "thisMonth":
      return { from: startOfMonth(today), to: end };
    case "lastMonth": {
      const m = subMonths(today, 1);
      return { from: startOfMonth(m), to: endOfMonth(m) };
    }
    case "thisYear":
      return { from: startOfYear(today), to: end > endOfYear(today) ? endOfYear(today) : end };
  }
}

/**
 * Calendrier global d'un module (ex. Tableau de bord) : raccourcis à gauche, deux mois côte à côte,
 * « Appliquer » valide la période (un seul mois sur téléphone). Le module décide où retenir la période.
 */
export function DateRangePicker({ value, onChange }: { value: RangeValue; onChange: (value: RangeValue) => void }) {
  const t = useTranslations("ui.range");
  const locale = useDateLocale();
  const formatDate = useFormatDate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<RangeValue>(value);
  const [month, setMonth] = useState<Date>(subMonths(value.to, 1));

  const label = `${formatDate(value.from, "dd MMM yyyy")} – ${formatDate(value.to, "dd MMM yyyy")}`;

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          // À chaque ouverture, on repart de la période en cours
          setDraft(value);
          setMonth(isMobile ? value.to : subMonths(value.to, 1));
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" className="bg-card font-medium tabular-nums data-[state=open]:border-primary" aria-label={t("open", { period: label })} data-testid="range-button">
          <CalendarIcon aria-hidden />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" collisionPadding={8} className="w-auto max-w-[calc(100vw-1rem)] p-0" data-testid="range-panel">
        <div className="flex flex-col sm:flex-row">
          <div role="radiogroup" aria-label={t("presets")} className="flex flex-wrap gap-1 border-b p-2 sm:w-44 sm:flex-col sm:flex-nowrap sm:border-r sm:border-b-0">
            {[...RANGE_PRESETS, "custom" as const].map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={draft.preset === p}
                onClick={() => {
                  if (p === "custom") setDraft({ ...draft, preset: "custom" });
                  else {
                    const r = presetRange(p);
                    setDraft({ preset: p, ...r });
                    setMonth(isMobile ? r.to : subMonths(r.to, 1));
                  }
                }}
                className="shrink-0 rounded-lg px-3 py-2 text-left text-sm whitespace-nowrap outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring aria-checked:bg-primary/15 aria-checked:font-semibold aria-checked:text-gold-strong"
              >
                {t(p)}
              </button>
            ))}
          </div>
          <Calendar
            mode="range"
            locale={locale}
            numberOfMonths={isMobile ? 1 : 2}
            showOutsideDays={false}
            // Nom du mois avec une majuscule (« Octobre 2026 »), comme sur la maquette
            formatters={{ formatCaption: (d) => {
              const s = formatDate(d, "LLLL yyyy");
              return s.charAt(0).toUpperCase() + s.slice(1);
            } }}
            month={month}
            onMonthChange={setMonth}
            selected={{ from: draft.from, to: draft.to } satisfies DateRange}
            onSelect={(r) => {
              if (!r?.from) return;
              setDraft({ preset: "custom", from: startOfDay(r.from), to: endOfDay(r.to ?? r.from) });
            }}
            className="p-3 [--cell-size:--spacing(9)]"
          />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 border-t px-3 py-2.5">
          <span className="mr-auto text-sm text-muted-foreground tabular-nums" data-testid="range-draft">
            {formatDate(draft.from, "dd/MM/yyyy")} – {formatDate(draft.to, "dd/MM/yyyy")}
          </span>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onChange(draft);
              setOpen(false);
            }}
          >
            {t("apply")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
