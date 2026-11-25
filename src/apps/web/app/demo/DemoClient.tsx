"use client";

import {
  AppCard,
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
  STATUS_TONES,
  type Status,
  StatusBadge,
  ThemePicker,
  formatMoney,
  periodRange,
  useFormatDate,
  useToast,
} from "@smart-collab/ui";
import { Button } from "@smart-collab/ui/components/ui/button";
import { Switch } from "@smart-collab/ui/components/ui/switch";
import { BanknoteIcon, FileWarningIcon, ReceiptIcon, ShoppingCartIcon, StoreIcon, WalletIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { type ReactNode, useMemo, useState } from "react";
import { DemoShell } from "@/components/DemoShell";
import { DEMO_COMPANY, type DemoProduct, demoProducts, demoReportLines, demoSales } from "@/lib/demo-data";

/** Bloc de la page : titre, explication courte, puis le composant. */
function Section({ id, title, hint, children }: { id: string; title: string; hint?: string; children: ReactNode }) {
  return (
    <section id={id} data-testid={`section-${id}`} aria-labelledby={`${id}-title`} className="min-w-0 scroll-mt-24">
      <h2 id={`${id}-title`} className="text-base font-semibold">
        {title}
      </h2>
      {hint && <p className="mt-0.5 text-sm text-muted-foreground">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function DemoClient({ sidebarOpen }: { sidebarOpen: boolean }) {
  const t = useTranslations("demo");
  const tApps = useTranslations("apps");
  const tStatus = useTranslations("ui.status");
  const toast = useToast();
  const format = useFormatter();
  const formatDate = useFormatDate();

  const [period, setPeriod] = useState<PeriodValue>(() => ({ key: "month", ...periodRange("month") }));
  const [printOpen, setPrintOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [offline, setOffline] = useState(false);
  const [posInstalled, setPosInstalled] = useState(false);

  const columns = useMemo<DataListColumn<DemoProduct>[]>(
    () => [
      { id: "reference", header: t("list.reference"), text: (r) => r.reference },
      { id: "name", header: t("list.name"), text: (r) => r.name },
      { id: "category", header: t("list.category"), text: (r) => r.category, filterable: true },
      { id: "price", header: t("list.price"), align: "right", text: (r) => formatMoney(r.price), sortValue: (r) => Number(r.price) },
      { id: "stock", header: t("list.stock"), align: "right", text: (r) => String(r.stock), sortValue: (r) => r.stock },
      { id: "status", header: t("list.status"), text: (r) => tStatus(r.status), cell: (r) => <StatusBadge status={r.status} /> },
    ],
    [t, tStatus],
  );

  const months = t.raw("chart.months") as string[];
  const millions = useMemo(() => (v: number) => `${format.number(v, { maximumFractionDigits: 1 })} M F`, [format]);
  const series = useMemo(
    () => [
      { name: t("chart.thisYear"), data: demoSales.thisYear, color: "accent" as const },
      { name: t("chart.lastYear"), data: demoSales.lastYear, color: "blue" as const },
    ],
    [t],
  );
  const reportTotal = demoReportLines.reduce((sum, l) => sum + BigInt(l.amount), 0n);

  return (
    <DemoShell sidebarOpen={sidebarOpen} activeKey="components" banner={<OfflineBanner forceOffline={offline} pendingCount={offline ? 3 : 0} />}>
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-1 max-w-3xl text-ink-2">{t("intro")}</p>
        </header>

        <Section id="shell" title={t("sections.shell")} hint={t("sections.shellHint")}>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4 text-sm text-ink-2 shadow-card">
            <ThemePicker />
            <span>{t("sections.themeHint")}</span>
          </div>
        </Section>

        <Section id="period" title={t("sections.period")}>
          <PeriodBar value={period} onChange={setPeriod} />
          <p className="mt-2 text-sm text-muted-foreground" data-testid="period-label">
            {t("sections.periodSelected", { from: formatDate(period.from, "dd/MM/yyyy"), to: formatDate(period.to, "dd/MM/yyyy") })}
          </p>
        </Section>

        <Section id="kpi" title={t("sections.kpi")} hint={t("sections.kpiHint")}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { key: "revenue", value: formatMoney("12450000"), delta: 12.4, icon: <BanknoteIcon />, tone: "gold" as const },
              { key: "orders", value: "186", delta: 4.1, icon: <ShoppingCartIcon />, tone: "blue" as const },
              { key: "stockAlerts", value: "7", delta: -2, icon: <FileWarningIcon />, tone: "amber" as const },
              { key: "receivables", value: formatMoney("1980500"), delta: -6.3, icon: <WalletIcon />, tone: "purple" as const },
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
          <ChartCard id="demo-sales" title={t("chart.title")} defaultType="bar" categories={months} series={series} valueFormatter={millions} />
        </Section>

        <Section id="list" title={t("sections.list")}>
          <DataList<DemoProduct>
            title={t("list.title")}
            columns={columns}
            data={demoProducts}
            getRowId={(r) => r.id}
            exportName="produits"
            detailTitle={(r) => r.name}
            renderDetail={(r) => (
              <div className="flex flex-col gap-3 text-ink-2">
                <p className="text-sm text-muted-foreground">{r.reference}</p>
                <p className="text-2xl font-semibold text-foreground tabular-nums">{formatMoney(r.price)}</p>
                <p>{t("list.detailStock", { count: r.stock })}</p>
                <StatusBadge status={r.status} />
              </div>
            )}
            bulkActions={() => (
              <Button size="sm" variant="outline">
                {t("list.archive")}
              </Button>
            )}
          />
        </Section>

        <Section id="form" title={t("sections.form")}>
          <EntityForm
            defaultValues={{ name: "Riz parfumé 5 kg", reference: "PRD-0001", category: "grocery", salePrice: "4500", taxable: true }}
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
                  { name: "taxable", label: t("form.taxable"), type: "switch", wide: true },
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
            <div className="flex flex-wrap gap-2 rounded-xl border bg-card p-4 shadow-card">
              {(Object.keys(STATUS_TONES) as Status[]).map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </div>
          </Section>

          <Section id="offline" title={t("sections.offline")}>
            <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-card">
              <label className="flex items-center gap-3 text-sm text-ink-2">
                <Switch checked={offline} onCheckedChange={setOffline} aria-label={t("offline.simulate")} />
                {t("offline.simulate")}
              </label>
              <OfflineBanner forceOffline={offline} pendingCount={offline ? 3 : 0} />
            </div>
          </Section>
        </div>

        <Section id="print" title={t("sections.print")}>
          <Button onClick={() => setPrintOpen(true)}>{t("print.open")}</Button>
          <PrintPreview open={printOpen} onOpenChange={setPrintOpen} title={t("print.reportTitle")} companyName={DEMO_COMPANY}>
            <p className="mb-4 text-muted-foreground">{t("print.period")}</p>
            <table className="w-full border-collapse">
              <tbody>
                {demoReportLines.map((l) => (
                  <tr key={l.label} className="border-b">
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
              icon={<ReceiptIcon />}
              installed
              onOpen={() => toast.info(tApps("sales"))}
            />
            <AppCard
              name={tApps("pos")}
              category={t("appCard.commerce")}
              description={t("appCard.posDesc")}
              icon={<StoreIcon />}
              installed={posInstalled}
              dependencies={[tApps("sales"), tApps("stock")]}
              onInstall={() => {
                setPosInstalled(true);
                toast.success(t("appCard.installedToast"));
              }}
              onOpen={() => toast.info(tApps("pos"))}
            />
            <AppCard
              name={tApps("finance")}
              category={t("appCard.management")}
              description={t("appCard.financeDesc")}
              icon={<WalletIcon />}
              installed={false}
              included={false}
              onInstall={() => toast.info(t("appCard.planToast"))}
            />
          </div>
        </Section>

        <Section id="feedback" title={t("sections.feedback")}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border bg-card shadow-card">
              <EmptyState action={<Button>{t("list.title")}</Button>} />
            </div>
            <div className="flex flex-col items-start gap-3 rounded-xl border bg-card p-4 shadow-card">
              <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                {t("feedback.openConfirm")}
              </Button>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => toast.success()}>
                  {t("feedback.toastSuccess")}
                </Button>
                <Button variant="outline" onClick={() => toast.error()}>
                  {t("feedback.toastError")}
                </Button>
                <Button variant="outline" onClick={() => toast.undoable(t("feedback.draftDeleted"), () => toast.info(t("feedback.restored")))}>
                  {t("feedback.toastUndo")}
                </Button>
              </div>
            </div>
          </div>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            danger
            requireReason
            title={t("feedback.confirmTitle")}
            description={t("feedback.confirmText")}
            confirmLabel={t("feedback.confirmAction")}
            onConfirm={(reason) => {
              setConfirmOpen(false);
              toast.success(t("feedback.cancelled", { reason: reason ?? "" }));
            }}
          />
        </Section>
      </div>
    </DemoShell>
  );
}
