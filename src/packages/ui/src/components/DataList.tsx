"use client";

/**
 * Liste standard (EF-GEN-04) sur le modèle « data-table » de shadcn/ui + TanStack Table :
 * recherche, filtre, tri, pagination, sélection multiple, colonnes visibles,
 * export CSV, impression, et panneau de détail à l'ouverture d'une ligne.
 */

import {
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Columns3Icon,
  DownloadIcon,
  FilterIcon,
  PrinterIcon,
  SearchIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useMemo, useState } from "react";
import { downloadText, toCsv } from "../csv";
import { EmptyState } from "./EmptyState";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export type DataListColumn<T> = {
  id: string;
  header: string;
  /** Valeur texte : recherche, tri alphabétique, export */
  text: (row: T) => string;
  /** Valeur de tri (sinon : le texte) */
  sortValue?: (row: T) => number | string;
  cell?: (row: T) => ReactNode;
  align?: "left" | "right";
  /** Colonne proposée dans le filtre */
  filterable?: boolean;
};

export function DataList<T>({
  title,
  columns,
  data,
  getRowId,
  exportName = "export",
  pageSize = 5,
  renderDetail,
  detailTitle,
  bulkActions,
}: {
  title?: string;
  columns: DataListColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  exportName?: string;
  pageSize?: number;
  renderDetail?: (row: T) => ReactNode;
  detailTitle?: (row: T) => string;
  bulkActions?: (selected: T[]) => ReactNode;
}) {
  const t = useTranslations("ui.list");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [open, setOpen] = useState<T | null>(null);

  const tableColumns = useMemo<ColumnDef<T>[]>(
    () => [
      {
        id: "select",
        enableSorting: false,
        enableHiding: false,
        header: ({ table }) => (
          <Checkbox
            aria-label={t("selectAll")}
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(Boolean(v))}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label={t("selectRow")}
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(Boolean(v))}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      ...columns.map<ColumnDef<T>>((c) => ({
        id: c.id,
        header: c.header,
        accessorFn: (row) => c.sortValue?.(row) ?? c.text(row),
        cell: ({ row }) => c.cell?.(row.original) ?? c.text(row.original),
        filterFn: (row, _id, value: string) => !value || c.text(row.original) === value,
        meta: { align: c.align },
      })),
    ],
    [columns, t],
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    getRowId,
    state: { sorting, globalFilter, columnFilters, rowSelection, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: (row, _id, value: string) =>
      columns.some((c) => c.text(row.original).toLowerCase().includes(value.trim().toLowerCase())),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const filterColumn = columns.find((c) => c.filterable);
  const filterValues = filterColumn ? [...new Set(data.map(filterColumn.text))].sort() : [];
  const activeFilter = (filterColumn && (table.getColumn(filterColumn.id)?.getFilterValue() as string)) || "";
  const selected = table.getSelectedRowModel().rows.map((r) => r.original);
  const visibleColumns = columns.filter((c) => table.getColumn(c.id)?.getIsVisible());

  function exportCsv() {
    const rows = selected.length > 0 ? selected : table.getFilteredRowModel().rows.map((r) => r.original);
    downloadText(`${exportName}.csv`, toCsv(visibleColumns.map((c) => c.header), rows.map((r) => visibleColumns.map((c) => c.text(r)))));
  }

  return (
    <section className="@container rounded-xl border bg-card shadow-card" aria-label={title}>
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        {title && <h3 className="mr-auto font-semibold">{title}</h3>}
        {selected.length > 0 && (
          <span className="flex items-center gap-2 text-sm text-ink-2">
            {t("selected", { count: selected.length })}
            {bulkActions?.(selected)}
          </span>
        )}
        <div className="relative w-full @lg:w-56">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            type="search"
            placeholder={t("search")}
            aria-label={t("search")}
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              table.setPageIndex(0);
            }}
            className="pl-8"
          />
        </div>
        {filterColumn && (
          <Select
            value={activeFilter || "__all"}
            onValueChange={(v) => table.getColumn(filterColumn.id)?.setFilterValue(v === "__all" ? undefined : v)}
          >
            <SelectTrigger aria-label={t("filterBy", { name: filterColumn.header })} className="w-44">
              <FilterIcon />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t("allValues", { name: filterColumn.header })}</SelectItem>
              {filterValues.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label={t("columns")}>
              <Columns3Icon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("columns")}</DropdownMenuLabel>
            {columns.map((c) => (
              <DropdownMenuCheckboxItem
                key={c.id}
                checked={table.getColumn(c.id)?.getIsVisible()}
                onCheckedChange={(v) => table.getColumn(c.id)?.toggleVisibility(Boolean(v))}
              >
                {c.header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <DownloadIcon /> {t("export")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={exportCsv}>{t("exportCsv")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>{t("exportExcel")}</DropdownMenuItem>
            <DropdownMenuItem disabled>{t("exportPdf")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" onClick={() => window.print()}>
          <PrinterIcon /> {t("print")}
        </Button>
      </div>

      <Table>
        <TableHeader className="bg-muted">
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const align = (header.column.columnDef.meta as { align?: string } | undefined)?.align;
                const sorted = header.column.getIsSorted();
                return (
                  <TableHead key={header.id} className={align === "right" ? "text-right" : undefined}>
                    {header.column.getCanSort() ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`-mx-2 ${align === "right" ? "ml-auto flex" : ""}`}
                        onClick={header.column.getToggleSortingHandler()}
                        aria-label={t("sortBy", { name: String(header.column.columnDef.header) })}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sorted === "asc" ? <ArrowUpIcon /> : sorted === "desc" ? <ArrowDownIcon /> : <ArrowUpDownIcon className="opacity-40" />}
                      </Button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={tableColumns.length}>
                <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                onClick={() => renderDetail && setOpen(row.original)}
                className={renderDetail ? "cursor-pointer" : undefined}
              >
                {row.getVisibleCells().map((cell) => {
                  const align = (cell.column.columnDef.meta as { align?: string } | undefined)?.align;
                  return (
                    <TableCell key={cell.id} className={align === "right" ? "text-right tabular-nums" : undefined}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t p-3 text-sm text-muted-foreground">
        <span>{t("total", { count: table.getFilteredRowModel().rows.length })}</span>
        <div className="flex items-center gap-2">
          <Select value={String(table.getState().pagination.pageSize)} onValueChange={(v) => table.setPageSize(Number(v))}>
            <SelectTrigger size="sm" aria-label={t("rowsPerPage")} className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>{t("page", { page: table.getState().pagination.pageIndex + 1, pages: Math.max(table.getPageCount(), 1) })}</span>
          <Button variant="outline" size="icon-sm" aria-label={t("previous")} disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
            <ChevronLeftIcon />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label={t("next")} disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      {renderDetail && (
        <Sheet open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{open && detailTitle ? detailTitle(open) : t("detail")}</SheetTitle>
              <SheetDescription className="sr-only">{t("detail")}</SheetDescription>
            </SheetHeader>
            <div className="px-4">{open && renderDetail(open)}</div>
          </SheetContent>
        </Sheet>
      )}
    </section>
  );
}
