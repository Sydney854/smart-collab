"use client";

import {
  ChartCard,
  DataList,
  type DataListColumn,
  DateRangePicker,
  KpiCard,
  RANGE_PRESETS,
  type RangePreset,
  type RangeValue,
  StatusBadge,
  formatMoney,
  presetRange,
  useFormatDate,
  useStorageKey,
} from "@smart-collab/ui";
import { addMonths, differenceInCalendarDays, endOfMonth, isValid, startOfMonth } from "date-fns";
import { BanknoteIcon, FileWarningIcon, ShoppingCartIcon, WalletIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DEMO_CURRENCY, type DemoSale, demoRecentSales, demoRevenue } from "@/lib/demo-data";

/** Période du tableau de bord, retenue sur cet appareil (décision du 28/11/2026) */
const PERIOD_KEY = "sc-dashboard-period";
const DEFAULT_PRESET: RangePreset = "thisMonth";

function readPeriod(key: string): RangeValue {
  try {
    const v = JSON.parse(window.localStorage.getItem(key) ?? "null") as { preset?: string; from?: string; to?: string } | null;
    // Un raccourci se recalcule chaque jour (« ce mois-ci » reste « ce mois-ci ») ; une période choisie reste fixe
    if (v?.preset && (RANGE_PRESETS as readonly string[]).includes(v.preset)) return { preset: v.preset as RangePreset, ...presetRange(v.preset as RangePreset) };
    if (v?.preset === "custom" && v.from && v.to) {
      const from = new Date(v.from);
      const to = new Date(v.to);
      if (isValid(from) && isValid(to) && from <= to) return { preset: "custom", from, to };
    }
  } catch {
    // Stockage indisponible : période par défaut
  }
  return { preset: DEFAULT_PRESET, ...presetRange(DEFAULT_PRESET) };
}
function savePeriod(key: string, v: RangeValue) {
  try {
    window.localStorage.setItem(key, JSON.stringify(v.preset === "custom" ? { preset: "custom", from: v.from.toISOString(), to: v.to.toISOString() } : { preset: v.preset }));
  } catch {
    // Rien à faire : la période vaut pour cette visite
  }
}

/** Mois couverts par la période, limités aux 12 mois de données fictives (au moins un mois) */
function monthsIn(from: Date, to: Date): number[] {
  const out: number[] = [];
  for (let i = 0; i < demoRevenue.thisYear.length; i++) {
    const m = addMonths(demoRevenue.start, i);
    if (endOfMonth(m) >= from && startOfMonth(m) <= to) out.push(i);
  }
  const last = out.length > 0 ? (out[out.length - 1] as number) : to < demoRevenue.start ? 0 : demoRevenue.thisYear.length - 1;
  // Une courbe a besoin d'au moins 3 points : une période courte montre aussi les 2 mois qui la précèdent
  if (out.length >= 3) return out;
  const first = Math.max(0, last - 2);
  return Array.from({ length: last - first + 1 }, (_, k) => first + k);
}

/** Écran « Tableau de bord » (données fictives), affiché en page ou en fenêtre. */
export function DashboardScreen() {
  const t = useTranslations("dashboard");
  const tDemo = useTranslations("demo");
  const tStatus = useTranslations("ui.status");
  const format = useFormatter();
  const formatDate = useFormatDate();
  // Calendrier global : une seule période pour tout le tableau de bord (chiffres, graphique, dernières ventes)
  const [period, setPeriod] = useState<RangeValue>(() => ({ preset: DEFAULT_PRESET, ...presetRange(DEFAULT_PRESET) }));
  const periodKey = useStorageKey(PERIOD_KEY);
  useEffect(() => setPeriod(readPeriod(periodKey)), [periodKey]);
  const changePeriod = (v: RangeValue) => {
    setPeriod(v);
    savePeriod(periodKey, v);
  };

  const idx = useMemo(() => monthsIn(period.from, period.to), [period]);
  const months = idx.map((i) => formatDate(addMonths(demoRevenue.start, i), "MMM yy"));
  const series = useMemo(
    () => [
      { name: tDemo("chart.thisYear"), data: idx.map((i) => demoRevenue.thisYear[i] as number), color: "accent" as const },
      { name: tDemo("chart.lastYear"), data: idx.map((i) => demoRevenue.lastYear[i] as number), color: "blue" as const },
    ],
    [idx, tDemo],
  );
  // Chiffres fictifs proportionnels à la durée de la période (base : 30 jours)
  const days = differenceInCalendarDays(period.to, period.from) + 1;
  const factor = days / 30;
  const revenue = String(Math.round((12_450_000 * factor) / 1000) * 1000);
  const orders = String(Math.max(1, Math.round(186 * factor)));
  const receivables = String(Math.round((1_980_500 * Math.min(factor, 3)) / 500) * 500);
  const sales = useMemo(() => demoRecentSales.filter((r) => r.date >= period.from && r.date <= period.to), [period]);
  const millions = useMemo(
    () => (v: number) => tDemo("chart.millions", { value: format.number(v, { maximumFractionDigits: 1 }), currency: DEMO_CURRENCY }),
    [format, tDemo],
  );

  const columns = useMemo<DataListColumn<DemoSale>[]>(
    () => [
      { id: "invoice", header: t("invoice"), text: (r) => r.invoice },
      { id: "customer", header: t("customer"), text: (r) => r.customer },
      { id: "date", header: t("date"), text: (r) => formatDate(r.date, "dd/MM/yyyy"), sortValue: (r) => r.date.getTime() },
      { id: "amount", header: t("amount"), align: "right", text: (r) => formatMoney(r.amount), sortValue: (r) => Number(r.amount) },
      {
        id: "status",
        header: t("status"),
        filterable: true,
        text: (r) => tStatus(r.status),
        cell: (r) => <StatusBadge status={r.status} />,
      },
    ],
    [t, tStatus, formatDate],
  );

  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
            <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
          </div>
          <DateRangePicker value={period} onChange={changePeriod} />
        </header>

        <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @5xl:grid-cols-4" data-testid="kpis">
          <KpiCard label={tDemo("kpi.revenue")} value={formatMoney(revenue)} delta={12.4} hint={tDemo("kpi.vsPrevious")} icon={<BanknoteIcon />} tone="gold"
            onClick={() => toast(tDemo("kpi.clicked", { name: tDemo("kpi.revenue") }))} onCustomize={(a) => toast(tDemo("kpi.customize", { action: a }))} />
          <KpiCard label={t("kpiOrders")} value={orders} delta={4.1} hint={tDemo("kpi.vsPrevious")} icon={<ShoppingCartIcon />} tone="blue" />
          <KpiCard label={tDemo("kpi.stockAlerts")} value="7" delta={-2} hint={tDemo("kpi.vsPrevious")} icon={<FileWarningIcon />} tone="amber" />
          <KpiCard label={tDemo("kpi.receivables")} value={formatMoney(receivables)} delta={-6.3} hint={tDemo("kpi.vsPrevious")} icon={<WalletIcon />} tone="purple" />
        </div>

        <ChartCard
          id="dashboard-revenue"
          title={t("chartTitle")}
          description={t("chartDescription")}
          categories={months}
          series={series}
          valueFormatter={millions}
        />

        <DataList<DemoSale>
          title={t("recentSales")}
          columns={columns}
          data={sales}
          getRowId={(r) => r.id}
          exportName={t("exportName")}
          detailTitle={(r) => t("openSale", { name: r.invoice })}
          renderDetail={(r) => (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">{r.customer} · {formatDate(r.date, "PPP")}</p>
              <p className="text-2xl font-semibold tabular-nums">{formatMoney(r.amount)}</p>
              <StatusBadge status={r.status} />
            </div>
          )}
        />
      </div>
    </>
  );
}
