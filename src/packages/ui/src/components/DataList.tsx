"use client";

import { Button, Drawer, Dropdown, Input, Table } from "antd";
import type { ColumnType } from "antd/es/table";
import { Download, Printer, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { type Key, type ReactNode, useMemo, useState } from "react";
import { downloadText, toCsv } from "../csv";
import { EmptyState } from "./EmptyState";

export type DataListColumn<T> = ColumnType<T> & {
  key: string;
  title: string;
  /** Valeur texte utilisée pour la recherche et l'export */
  text: (record: T) => string;
};

/**
 * Liste standard (EF-GEN-04) : recherche, filtres, tri, pagination, sélection multiple,
 * export CSV, impression, et panneau de détail à l'ouverture d'une ligne.
 */
export function DataList<T extends object>({
  title,
  columns,
  data,
  rowKey,
  loading,
  exportName = "export",
  renderDetail,
  detailTitle,
  bulkActions,
}: {
  title?: string;
  columns: DataListColumn<T>[];
  data: T[];
  rowKey: keyof T & string;
  loading?: boolean;
  exportName?: string;
  renderDetail?: (record: T) => ReactNode;
  detailTitle?: (record: T) => string;
  bulkActions?: (selected: T[]) => ReactNode;
}) {
  const t = useTranslations("ui.list");
  const [query, setQuery] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [open, setOpen] = useState<T | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((r) => columns.some((c) => c.text(r).toLowerCase().includes(q)));
  }, [data, columns, query]);

  const selected = data.filter((r) => selectedKeys.includes(r[rowKey] as Key));
  const exportRows = selected.length > 0 ? selected : filtered;

  function exportCsv() {
    downloadText(`${exportName}.csv`, toCsv(columns.map((c) => c.title), exportRows.map((r) => columns.map((c) => c.text(r)))));
  }

  return (
    <section className="rounded-card border border-line bg-card shadow-card" aria-label={title}>
      <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
        {title && <h3 className="mr-auto font-semibold text-ink">{title}</h3>}
        {selected.length > 0 && (
          <span className="flex items-center gap-2 text-sm text-ink-2">
            {t("selected", { count: selected.length })}
            {bulkActions?.(selected)}
          </span>
        )}
        <Input
          allowClear
          prefix={<Search className="size-4 text-muted" aria-hidden />}
          placeholder={t("search")}
          aria-label={t("search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-64"
        />
        <Dropdown
          menu={{
            items: [
              { key: "csv", label: t("exportCsv"), onClick: exportCsv },
              { key: "xlsx", label: t("exportExcel"), disabled: true },
              { key: "pdf", label: t("exportPdf"), disabled: true },
            ],
          }}
        >
          <Button icon={<Download className="size-4" />}>{t("export")}</Button>
        </Dropdown>
        <Button icon={<Printer className="size-4" />} onClick={() => window.print()}>
          {t("print")}
        </Button>
      </div>
      <Table<T>
        rowKey={rowKey}
        size="middle"
        loading={loading}
        columns={columns}
        dataSource={filtered}
        rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
        pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: [5, 10, 25, 50], showTotal: (total) => t("total", { count: total }) }}
        locale={{ emptyText: <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} /> }}
        onRow={(record) => ({
          onClick: () => renderDetail && setOpen(record),
          className: renderDetail ? "cursor-pointer" : undefined,
        })}
        scroll={{ x: "max-content" }}
      />
      {renderDetail && (
        <Drawer open={open !== null} onClose={() => setOpen(null)} title={open && detailTitle ? detailTitle(open) : t("detail")} size="default">
          {open && renderDetail(open)}
        </Drawer>
      )}
    </section>
  );
}
