"use client";

import {
  ChartCard,
  DataList,
  type DataListColumn,
  KpiCard,
  OfflineBanner,
  StatusBadge,
  formatMoney,
  useFormatDate,
} from "@smart-collab/ui";
import { ToggleGroup, ToggleGroupItem } from "@smart-collab/ui/components/ui/toggle-group";
import { addMonths } from "date-fns";
import { BanknoteIcon, FileWarningIcon, ShoppingCartIcon, WalletIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DemoShell } from "@/components/DemoShell";
import { type DemoSale, demoRecentSales, demoRevenue } from "@/lib/demo-data";

const RANGES = ["3", "6", "12"] as const;
type Range = (typeof RANGES)[number];

export function DashboardClient({ sidebarOpen }: { sidebarOpen: boolean }) {
  const t = useTranslations("dashboard");
  const tDemo = useTranslations("demo");
  const tStatus = useTranslations("ui.status");
  const format = useFormatter();
  const formatDate = useFormatDate();
  const [range, setRange] = useState<Range>("6");

  const n = Number(range);
  const months = demoRevenue.thisYear.map((_, i) => formatDate(addMonths(demoRevenue.start, i), "MMM yy"));
  const series = useMemo(
    () => [
      { name: tDemo("chart.thisYear"), data: demoRevenue.thisYear.slice(-n), color: "accent" as const },
      { name: tDemo("chart.lastYear"), data: demoRevenue.lastYear.slice(-n), color: "blue" as const },
    ],
    [n, tDemo],
  );
  const millions = useMemo(() => (v: number) => `${format.number(v, { maximumFractionDigits: 1 })} M F`, [format]);

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
    <DemoShell sidebarOpen={sidebarOpen} banner={<OfflineBanner />}>
      <div className="@container/main mx-auto flex max-w-7xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
        </header>

        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4" data-testid="kpis">
          <KpiCard label={tDemo("kpi.revenue")} value={formatMoney("12450000")} delta={12.4} hint={tDemo("kpi.vsPrevious")} icon={<BanknoteIcon />} tone="gold"
            onClick={() => toast(tDemo("kpi.clicked", { name: tDemo("kpi.revenue") }))} onCustomize={(a) => toast(tDemo("kpi.customize", { action: a }))} />
          <KpiCard label={tDemo("kpi.orders")} value="186" delta={4.1} hint={tDemo("kpi.vsPrevious")} icon={<ShoppingCartIcon />} tone="blue" />
          <KpiCard label={tDemo("kpi.stockAlerts")} value="7" delta={-2} hint={tDemo("kpi.vsPrevious")} icon={<FileWarningIcon />} tone="amber" />
          <KpiCard label={tDemo("kpi.receivables")} value={formatMoney("1980500")} delta={-6.3} hint={tDemo("kpi.vsPrevious")} icon={<WalletIcon />} tone="purple" />
        </div>

        <ChartCard
          id="dashboard-revenue"
          title={t("chartTitle")}
          description={t("chartDescription")}
          categories={months.slice(-n)}
          series={series}
          valueFormatter={millions}
          toolbar={
            <ToggleGroup type="single" variant="outline" size="sm" aria-label={t("rangeLabel")} value={range}
              onValueChange={(v) => v && setRange(v as Range)} className="hidden @[640px]/card:flex">
              {RANGES.map((r) => (
                <ToggleGroupItem key={r} value={r}>{t(`range${r}`)}</ToggleGroupItem>
              ))}
            </ToggleGroup>
          }
        />

        <DataList<DemoSale>
          title={t("recentSales")}
          columns={columns}
          data={demoRecentSales}
          getRowId={(r) => r.id}
          exportName="ventes"
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
    </DemoShell>
  );
}
