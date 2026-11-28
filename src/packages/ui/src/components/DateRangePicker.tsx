"use client";

import { endOfDay, endOfMonth, endOfYear, isSameMonth, startOfDay, startOfMonth, startOfYear, subDays, subMonths } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useIsMobile } from "../hooks/use-mobile";
import { useDateLocale, useFormatDate } from "../lib/dates";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { useStorageKey } from "./SearchDialog";
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

const VIEW_KEY = "sc-range-view";
const YEARS_BACK = 9;

/**
 * Vue « Mois » (maquette validée le 28/11/2026) : année au choix, 12 mois en grille.
 * 1 clic = tout le mois ; 2 clics = du premier au second mois. Mois à venir grisés.
 */
function MonthGrid({ draft, onPick }: { draft: RangeValue; onPick: (from: Date, to: Date) => void }) {
  const t = useTranslations("ui.range");
  const formatDate = useFormatDate();
  const today = new Date();
  const [year, setYear] = useState(draft.to.getFullYear());
  const [anchor, setAnchor] = useState<Date | null>(null);
  const first = today.getFullYear() - YEARS_BACK;
  const short = (d: Date) => {
    const s = formatDate(d, "MMM");
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  return (
    <div className="flex flex-col gap-3 p-3" data-testid="month-grid">
      <div className="flex items-center gap-1 rounded-lg border px-1">
        <Button variant="ghost" size="icon" className="size-8" aria-label={t("prevYear")} disabled={year <= first} onClick={() => setYear(year - 1)}>
          <ChevronLeftIcon />
        </Button>
        <select
          aria-label={t("year")}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="h-9 flex-1 cursor-pointer appearance-none bg-transparent text-center font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {Array.from({ length: YEARS_BACK + 1 }, (_, i) => today.getFullYear() - i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <Button variant="ghost" size="icon" className="size-8" aria-label={t("nextYear")} disabled={year >= today.getFullYear()} onClick={() => setYear(year + 1)}>
          <ChevronRightIcon />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2" role="grid" aria-label={t("months")}>
        {Array.from({ length: 12 }, (_, m) => {
          const d = new Date(year, m, 1);
          const future = d > today;
          const edge = isSameMonth(d, draft.from) || isSameMonth(d, draft.to);
          const inside = d > draft.from && d < startOfMonth(draft.to);
          return (
            <button
              key={m}
              type="button"
              disabled={future}
              aria-pressed={edge || inside}
              aria-label={formatDate(d, "LLLL yyyy")}
              data-current={isSameMonth(d, today) || undefined}
              data-edge={edge || undefined}
              data-inside={(inside && !edge) || undefined}
              onClick={() => {
                if (!anchor) {
                  setAnchor(d);
                  onPick(startOfMonth(d), endOfMonth(d));
                } else {
                  const [a, b] = anchor <= d ? [anchor, d] : [d, anchor];
                  setAnchor(null);
                  onPick(startOfMonth(a), endOfMonth(b));
                }
              }}
              className="h-11 w-24 rounded-lg border text-sm font-semibold outline-none hover:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:text-muted-foreground/50 disabled:hover:border-border data-[current]:ring-2 data-[current]:ring-foreground data-[current]:ring-inset data-[edge]:border-primary data-[edge]:bg-primary data-[edge]:text-primary-foreground data-[inside]:border-primary/40 data-[inside]:bg-primary/15 max-sm:w-full"
            >
              {short(d)}
            </button>
          );
        })}
      </div>
    </div>
  );
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
  // Onglet Jours / Mois : « Jours » par défaut, puis le dernier choix retenu sur l'appareil
  const viewKey = useStorageKey(VIEW_KEY);
  const [view, setView] = useState<"days" | "months">("days");
  useEffect(() => {
    try {
      if (window.localStorage.getItem(viewKey) === "months") setView("months");
    } catch {
      // Stockage indisponible : « Jours »
    }
  }, [viewKey]);
  const chooseView = (v: "days" | "months") => {
    setView(v);
    try {
      window.localStorage.setItem(viewKey, v);
    } catch {
      // Rien à faire
    }
  };

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
          <div className="flex flex-col">
            <div role="tablist" aria-label={t("view")} className="mx-3 mt-3 inline-flex self-start overflow-hidden rounded-lg border">
              {(["days", "months"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => chooseView(v)}
                  className="px-4 py-1.5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset aria-selected:bg-primary aria-selected:text-primary-foreground"
                >
                  {t(v)}
                </button>
              ))}
            </div>
            {view === "months" ? (
              <MonthGrid key={String(open)} draft={draft} onPick={(from, to) => setDraft({ preset: "custom", from, to: endOfDay(to) })} />
            ) : (
            <Calendar
              mode="range"
              locale={locale}
              numberOfMonths={isMobile ? 1 : 2}
              showOutsideDays={false}
              // Nom du mois avec une majuscule (« Octobre 2026 »), comme sur la maquette
              formatters={{
                formatCaption: (d) => {
                  const s = formatDate(d, "LLLL yyyy");
                  return s.charAt(0).toUpperCase() + s.slice(1);
                },
                // Jours en une lettre majuscule (L M M J V S D), comme sur la maquette
                formatWeekdayName: (d) => formatDate(d, "EEEEE").toUpperCase(),
              }}
              month={month}
              onMonthChange={setMonth}
              selected={{ from: draft.from, to: draft.to } satisfies DateRange}
              onSelect={(r) => {
                if (!r?.from) return;
                setDraft({ preset: "custom", from: startOfDay(r.from), to: endOfDay(r.to ?? r.from) });
              }}
              className="p-3 [--cell-size:--spacing(9)]"
            />
            )}
          </div>
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
