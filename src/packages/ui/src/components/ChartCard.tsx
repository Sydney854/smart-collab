"use client";

import type { ApexOptions } from "apexcharts";
import { EllipsisVerticalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { type ReactNode, useMemo, useState } from "react";
import { useScTheme } from "../context";
import type { ColorToken } from "../tokens";
import { Button } from "./ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// ApexCharts a besoin du navigateur : chargé uniquement côté client
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export type ChartType = "area" | "bar" | "line";
export type ChartSeries = { name: string; data: number[]; color?: ColorToken };

/**
 * Carte de graphique (ApexCharts) avec menu de personnalisation
 * (type de graphique) et export en image PNG.
 */
export function ChartCard({
  id,
  title,
  description,
  categories,
  series,
  defaultType = "area",
  height = 260,
  valueFormatter,
  toolbar,
}: {
  id: string;
  title: string;
  description?: string;
  categories: string[];
  series: ChartSeries[];
  defaultType?: ChartType;
  height?: number;
  valueFormatter?: (value: number) => string;
  /** Contrôles supplémentaires dans l'en-tête (ex. choix de période) */
  toolbar?: ReactNode;
}) {
  const t = useTranslations("ui.chart");
  const { colors, mode } = useScTheme();
  const [type, setType] = useState<ChartType>(defaultType);

  const options = useMemo<ApexOptions>(
    () => ({
      chart: { id, toolbar: { show: false }, background: "transparent", fontFamily: "inherit", animations: { enabled: false }, zoom: { enabled: false } },
      theme: { mode },
      colors: series.map((s, i) => colors[s.color ?? (i === 0 ? "accent" : "blue")]),
      xaxis: {
        categories,
        labels: { style: { colors: colors.muted } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: colors.muted }, formatter: valueFormatter } },
      grid: { borderColor: colors.line, strokeDashArray: 4 },
      legend: { position: "top", horizontalAlign: "right", labels: { colors: colors["ink-2"] } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: type === "bar" ? 0 : 2 },
      plotOptions: { bar: { borderRadius: 4, columnWidth: "45%" } },
      fill: type === "area" ? { type: "gradient", gradient: { opacityFrom: 0.35, opacityTo: 0.02 } } : { opacity: 1 },
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
    <Card className="@container/card shadow-card" aria-label={title}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <CardAction className="flex items-center gap-2">
          {toolbar}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("menu")}>
                <EllipsisVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("type")}</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={type} onValueChange={(v) => setType(v as ChartType)}>
                <DropdownMenuRadioItem value="area">{t("area")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bar">{t("bar")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="line">{t("line")}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => void exportPng()}>{t("exportPng")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 @lg/card:px-6">
        <Chart key={`${type}-${mode}`} type={type} height={height} options={options} series={series.map(({ name, data }) => ({ name, data }))} />
      </CardContent>
    </Card>
  );
}
