"use client";

import {
  AppCard,
  AppShell,
  ChartCard,
  ConfirmDialog,
  DataList,
  type DataListColumn,
  EmptyState,
  EntityForm,
  KpiCard,
  OfflineBanner,
  PeriodBar,
  type PeriodValue,
  PrintPreview,
  type ShellApp,
  StatusBadge,
  STATUS_TONES,
  type Status,
  formatMoney,
  periodRange,
  useToast,
} from "@smart-collab/ui";
import { Button, Switch } from "antd";
import {
  AppWindow,
  Banknote,
  Boxes,
  FileWarning,
  LayoutDashboard,
  Package,
  Receipt,
  ShoppingCart,
  Store,
  Truck,
  Wallet,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { HeaderControls } from "@/components/HeaderControls";
import { DEMO_COMPANY, type DemoProduct, demoProducts, demoReportLines, demoSales } from "@/lib/demo-data";

function Section({ id, title, hint, children }: { id: string; title: string; hint?: string; children: ReactNode }) {
  return (
    <section id={id} data-testid={`section-${id}`} aria-labelledby={`${id}-title`} className="min-w-0 scroll-mt-24">
      <h2 id={`${id}-title`} className="text-base font-semibold text-ink">
        {title}
      </h2>
      {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function DemoClient() {
  const t = useTranslations("demo");
  const tApps = useTranslations("apps");
  const toast = useToast();
  const format = useFormatter();

  const [period, setPeriod] = useState<PeriodValue>(() => ({ key: "month", ...periodRange("month") }));
  const [printOpen, setPrintOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [offline, setOffline] = useState(false);
  const [installed, setInstalled] = useState(false);

  const apps: ShellApp[] = [
    { key: "dashboard", label: tApps("dashboard"), icon: <LayoutDashboard className="size-4" /> },
    { key: "sales", label: tApps("sales"), icon: <Receipt className="size-4" /> },
    { key: "stock", label: tApps("stock"), icon: <Boxes className="size-4" /> },
    { key: "purchases", label: tApps("purchases"), icon: <Truck className="size-4" /> },
    { key: "pos", label: tApps("pos"), icon: <Store className="size-4" /> },
    { key: "finance", label: tApps("finance"), icon: <Wallet className="size-4" /> },
    { key: "apps", label: tApps("apps"), icon: <AppWindow className="size-4" /> },
  ];

  const columns = useMemo<DataListColumn<DemoProduct>[]>(
    () => [
      { key: "reference", dataIndex: "reference", title: t("list.reference"), text: (r) => r.reference, sorter: (a, b) => a.reference.localeCompare(b.reference) },
      { key: "name", dataIndex: "name", title: t("list.name"), text: (r) => r.name, sorter: (a, b) => a.name.localeCompare(b.name) },
      {
        key: "category",
        dataIndex: "category",
        title: t("list.category"),
        text: (r) => r.category,
        filters: [...new Set(demoProducts.map((p) => p.category))].map((c) => ({ text: c, value: c })),
        onFilter: (value, r) => r.category === value,
      },
      {
        key: "price",
        dataIndex: "price",
        title: t("list.price"),
        align: "right",
        text: (r) => formatMoney(r.price),
        render: (v: string) => formatMoney(v),
        sorter: (a, b) => Number(a.price) - Number(b.price),
      },
      { key: "stock", dataIndex: "stock", title: t("list.stock"), align: "right", text: (r) => String(r.stock), sorter: (a, b) => a.stock - b.stock },
      { key: "status", dataIndex: "status", title: t("list.status"), text: (r) => r.status, render: (s: Status) => <StatusBadge status={s} /> },
    ],
    [t],
  );

  const months = t.raw("chart.months") as string[];
  const millions = useCallback((v: number) => `${format.number(v, { maximumFractionDigits: 1 })} M F`, [format]);
  const series = useMemo(
    () => [
      { name: t("chart.thisYear"), data: demoSales.thisYear, color: "accent" as const },
      { name: t("chart.lastYear"), data: demoSales.lastYear, color: "blue" as const },
    ],
    [t],
  );
  const reportTotal = demoReportLines.reduce((sum, l) => sum + BigInt(l.amount), 0n);

  return (
    <AppShell
      apps={apps}
      activeKey="dashboard"
      brand={{ name: "Smart Collab", logo: <Package className="size-4" aria-hidden /> }}
      headerRight={<HeaderControls />}
      banner={<OfflineBanner forceOffline={offline} pendingCount={offline ? 3 : 0} />}
      onNavigate={(key) => toast.info(t("navigated", { name: apps.find((a) => a.key === key)?.label ?? key }))}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{t("title")}</h1>
          <p className="mt-1 max-w-3xl text-ink-2">{t("intro")}</p>
        </header>

        <Section id="shell" title={t("sections.shell")} hint={t("sections.shellHint")}>
          <p className="text-sm text-muted">{t("sections.themeHint")}</p>
        </Section>

        <Section id="period" title={t("sections.period")}>
          <PeriodBar value={period} onChange={setPeriod} />
          <p className="mt-2 text-sm text-muted" data-testid="period-label">
            {t("sections.periodSelected", { from: period.from.format("DD/MM/YYYY"), to: period.to.format("DD/MM/YYYY") })}
          </p>
        </Section>

        <Section id="kpi" title={t("sections.kpi")} hint={t("sections.kpiHint")}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { key: "revenue", value: formatMoney("12450000"), delta: 12.4, icon: <Banknote className="size-[18px]" />, tone: "accent" as const },
              { key: "orders", value: "186", delta: 4.1, icon: <ShoppingCart className="size-[18px]" />, tone: "blue" as const },
              { key: "stockAlerts", value: "7", delta: -2, icon: <FileWarning className="size-[18px]" />, tone: "amber" as const },
              { key: "receivables", value: formatMoney("1980500"), delta: -6.3, icon: <Wallet className="size-[18px]" />, tone: "purple" as const },
            ].map((k) => (
              <KpiCard
                key={k.key}
                label={t(`kpi.${k.key}`)}
                value={k.value}
                delta={k.delta}
                hint={t("kpi.vsPrevious")}
                icon={k.icon}
                tone={k.tone}
                onClick={() => toast.info(t("kpi.clicked", { name: t(`kpi.${k.key}`) }))}
                onCustomize={(action) => toast.info(t("kpi.customize", { action }))}
              />
            ))}
          </div>
        </Section>

        <Section id="chart" title={t("sections.chart")}>
          <ChartCard id="demo-sales" title={t("chart.title")} categories={months} series={series} valueFormatter={millions} />
        </Section>

        <Section id="list" title={t("sections.list")}>
          <DataList<DemoProduct>
            title={t("list.title")}
            columns={columns}
            data={demoProducts}
            rowKey="id"
            exportName="produits"
            detailTitle={(r) => r.name}
            renderDetail={(r) => (
              <div className="flex flex-col gap-3 text-ink-2">
                <p className="text-sm text-muted">{r.reference}</p>
                <p className="text-2xl font-semibold text-ink">{formatMoney(r.price)}</p>
                <p>{t("list.detailStock", { count: r.stock })}</p>
                <StatusBadge status={r.status} />
              </div>
            )}
            bulkActions={() => <Button size="small">{t("list.archive")}</Button>}
          />
        </Section>

        <Section id="form" title={t("sections.form")}>
          <EntityForm
            initialValues={{ name: "Riz parfumé 5 kg", reference: "PRD-0001", category: "grocery", salePrice: "4500", taxable: true }}
            onSubmit={() => toast.success(t("form.saved"))}
            tabs={[
              {
                key: "general",
                label: t("form.general"),
                fields: [
                  { name: "name", label: t("form.name"), type: "text", required: true },
                  { name: "reference", label: t("form.reference"), type: "text", required: true },
                  {
                    name: "category",
                    label: t("form.category"),
                    type: "select",
                    options: [
                      { value: "grocery", label: t("form.categories.grocery") },
                      { value: "drinks", label: t("form.categories.drinks") },
                      { value: "household", label: t("form.categories.household") },
                    ],
                  },
                  { name: "origin", label: t("form.origin"), type: "text", custom: true },
                  { name: "description", label: t("form.description"), type: "textarea" },
                ],
              },
              {
                key: "pricing",
                label: t("form.pricing"),
                fields: [
                  { name: "salePrice", label: t("form.salePrice"), type: "money", required: true },
                  { name: "costPrice", label: t("form.costPrice"), type: "money" },
                  { name: "taxable", label: t("form.taxable"), type: "switch" },
                ],
              },
              {
                key: "stock",
                label: t("form.stock"),
                fields: [
                  { name: "minStock", label: t("form.minStock"), type: "number" },
                  { name: "lastInventory", label: t("form.lastInventory"), type: "date" },
                ],
              },
            ]}
          />
        </Section>

        <div className="grid gap-10 lg:grid-cols-2">
          <Section id="status" title={t("sections.status")}>
            <div className="flex flex-wrap gap-2 rounded-card border border-line bg-card p-4 shadow-card">
              {(Object.keys(STATUS_TONES) as Status[]).map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </div>
          </Section>

          <Section id="offline" title={t("sections.offline")}>
            <div className="flex flex-col gap-3 rounded-card border border-line bg-card p-4 shadow-card">
              <label className="flex items-center gap-3 text-sm text-ink-2">
                <Switch checked={offline} onChange={setOffline} aria-label={t("offline.simulate")} />
                {t("offline.simulate")}
              </label>
              <OfflineBanner forceOffline={offline} pendingCount={offline ? 3 : 0} />
            </div>
          </Section>
        </div>

        <Section id="print" title={t("sections.print")}>
          <Button type="primary" onClick={() => setPrintOpen(true)}>
            {t("print.open")}
          </Button>
          <PrintPreview open={printOpen} onClose={() => setPrintOpen(false)} title={t("print.reportTitle")} companyName={DEMO_COMPANY}>
            <p className="mb-4 text-muted">{t("print.period")}</p>
            <table className="w-full border-collapse">
              <tbody>
                {demoReportLines.map((l) => (
                  <tr key={l.label} className="border-b border-line">
                    <td className="py-2">{l.label}</td>
                    <td className="py-2 text-right tabular-nums">{formatMoney(l.amount)}</td>
                  </tr>
                ))}
                <tr className="font-semibold text-print">
                  <td className="py-2">{t("print.total")}</td>
                  <td className="py-2 text-right tabular-nums">{formatMoney(reportTotal)}</td>
                </tr>
              </tbody>
            </table>
          </PrintPreview>
        </Section>

        <Section id="app-card" title={t("sections.appCard")}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AppCard
              name={tApps("sales")}
              category={t("appCard.commerce")}
              description={t("appCard.salesDesc")}
              icon={<Receipt className="size-5" />}
              installed
              onOpen={() => toast.info(tApps("sales"))}
            />
            <AppCard
              name={tApps("pos")}
              category={t("appCard.commerce")}
              description={t("appCard.posDesc")}
              icon={<Store className="size-5" />}
              installed={installed}
              dependencies={[tApps("sales"), tApps("stock")]}
              onInstall={() => {
                setInstalled(true);
                toast.success(t("appCard.installedToast"));
              }}
              onOpen={() => toast.info(tApps("pos"))}
            />
            <AppCard
              name={tApps("finance")}
              category={t("appCard.management")}
              description={t("appCard.financeDesc")}
              icon={<Wallet className="size-5" />}
              installed={false}
              onInstall={() => toast.success(t("appCard.installedToast"))}
            />
          </div>
        </Section>

        <Section id="feedback" title={t("sections.feedback")}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-card border border-line bg-card shadow-card">
              <EmptyState action={<Button type="primary">{t("list.title")}</Button>} />
            </div>
            <div className="flex flex-col items-start gap-3 rounded-card border border-line bg-card p-4 shadow-card">
              <Button danger onClick={() => setConfirmOpen(true)}>
                {t("feedback.openConfirm")}
              </Button>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => toast.success()}>{t("feedback.toastSuccess")}</Button>
                <Button onClick={() => toast.error()}>{t("feedback.toastError")}</Button>
              </div>
            </div>
          </div>
          <ConfirmDialog
            open={confirmOpen}
            danger
            requireReason
            title={t("feedback.confirmTitle")}
            description={t("feedback.confirmText")}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={(reason) => {
              setConfirmOpen(false);
              toast.success(t("feedback.cancelled", { reason: reason ?? "" }));
            }}
          />
        </Section>
      </div>
    </AppShell>
  );
}
