"use client";

import { Button, Dropdown } from "antd";
import type { ApexOptions } from "apexcharts";
import { EllipsisVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useScTheme } from "../context";
import type { ColorToken } from "../tokens";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export type ChartType = "bar" | "line" | "area";
export type ChartSeries = { name: string; data: number[]; color?: ColorToken };

/** Carte de graphique avec menu de personnalisation (type de graphique) et export image. */
export function ChartCard({
  id,
  title,
  categories,
  series,
  defaultType = "bar",
  height = 260,
  valueFormatter,
}: {
  id: string;
  title: string;
  categories: string[];
  series: ChartSeries[];
  defaultType?: ChartType;
  height?: number;
  valueFormatter?: (value: number) => string;
}) {
  const t = useTranslations("ui.chart");
  const { colors, mode } = useScTheme();
  const [type, setType] = useState<ChartType>(defaultType);

  const options = useMemo<ApexOptions>(
    () => ({
      chart: { id, toolbar: { show: false }, background: "transparent", fontFamily: "inherit", animations: { enabled: false } },
      theme: { mode },
      colors: series.map((s, i) => colors[s.color ?? (i === 0 ? "accent" : "blue")]),
      xaxis: { categories, labels: { style: { colors: colors.muted } }, axisBorder: { color: colors.line }, axisTicks: { color: colors.line } },
      yaxis: { labels: { style: { colors: colors.muted }, formatter: valueFormatter } },
      grid: { borderColor: colors.line, strokeDashArray: 4 },
      legend: { labels: { colors: colors["ink-2"] } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: type === "bar" ? 0 : 2 },
      plotOptions: { bar: { borderRadius: 4, columnWidth: "45%" } },
      fill: { opacity: type === "area" ? 0.25 : 1 },
      tooltip: { theme: mode, y: { formatter: valueFormatter } },
    }),
    [id, mode, colors, categories, series, type, valueFormatter],
  );

  async function exportPng() {
    const ApexCharts = (await import("apexcharts")).default;
    const { imgURI } = (await ApexCharts.exec(id, "dataURI")) as { imgURI: string };
    const link = document.createElement("a");
    link.href = imgURI;
    link.download = `${id}.png`;
    link.click();
  }

  return (
    <section className="rounded-card border border-line bg-card p-4 shadow-card" aria-label={title}>
      <header className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-ink">{title}</h3>
        <Dropdown
          trigger={["click"]}
          menu={{
            selectable: true,
            selectedKeys: [type],
            items: [
              { key: "bar", label: t("bar") },
              { key: "line", label: t("line") },
              { key: "area", label: t("area") },
              { type: "divider" },
              { key: "export", label: t("exportPng") },
            ],
            onClick: ({ key }) => (key === "export" ? void exportPng() : setType(key as ChartType)),
          }}
        >
          <Button type="text" aria-label={t("menu")} icon={<EllipsisVertical className="size-4" />} />
        </Dropdown>
      </header>
      <Chart key={`${type}-${mode}`} type={type} height={height} options={options} series={series.map(({ name, data }) => ({ name, data }))} />
    </section>
  );
}
