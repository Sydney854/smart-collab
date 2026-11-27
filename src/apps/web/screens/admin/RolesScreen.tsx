"use client";

import { EmptyState } from "@smart-collab/ui";
import { Label } from "@smart-collab/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@smart-collab/ui/components/ui/select";
import { Skeleton } from "@smart-collab/ui/components/ui/skeleton";
import { Switch } from "@smart-collab/ui/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@smart-collab/ui/components/ui/tabs";
import { ShieldCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { type Role, setFieldMask, setRolePermission } from "@/lib/admin/actions";
import { useCan } from "@/lib/permissions";
import { useAdminData, useLabel } from "./useAdminData";

type Row = { key: string; label: string };

/**
 * Matrice rôle × élément (droit ou champ sensible).
 * Grand écran : tableau, une colonne par rôle (avec en-tête). Petit écran (fiches core.roles et core.field-masks,
 * « Version mobile ») : on choisit un rôle, puis la liste de ses éléments avec leur interrupteur.
 */
function RoleMatrix({
  rows,
  roles,
  rowsTitle,
  isOn,
  isLocked,
  onChange,
  stateLabel,
}: {
  rows: Row[];
  roles: Role[];
  rowsTitle: string;
  isOn: (role: Role, row: Row) => boolean;
  isLocked: (role: Role) => boolean;
  onChange: (role: Role, row: Row, on: boolean) => void;
  stateLabel?: (on: boolean) => string;
}) {
  const t = useTranslations("admin");
  const label = useLabel();
  const [roleId, setRoleId] = useState(roles[0]?.id);
  const current = roles.find((r) => r.id === roleId) ?? roles[0];
  const cell = (role: Role, row: Row) => {
    const on = isOn(role, row);
    return (
      <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <Switch
          checked={on}
          disabled={isLocked(role)}
          aria-label={`${row.label} · ${label(role.name)}`}
          data-item={row.key}
          data-role={role.code}
          onCheckedChange={(v) => onChange(role, row, v)}
        />
        {stateLabel?.(on)}
      </span>
    );
  };
  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border bg-card @3xl:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th scope="col" className="sticky left-0 bg-muted/50 p-3 text-left font-medium">
                {rowsTitle}
              </th>
              {roles.map((r) => (
                <th key={r.id} scope="col" className="min-w-28 p-3 text-center font-medium">
                  {label(r.name)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b last:border-0">
                <th scope="row" className="sticky left-0 bg-card p-3 text-left font-normal">
                  {row.label}
                </th>
                {roles.map((r) => (
                  <td key={r.id} className="p-3 text-center">
                    {cell(r, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 @3xl:hidden" data-testid="role-matrix-mobile">
        <div className="flex flex-col gap-1.5">
          <Label>{t("roleLabel")}</Label>
          <Select value={current?.id} onValueChange={setRoleId}>
            <SelectTrigger aria-label={t("roleLabel")} className="h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {label(r.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {current && (
          <ul className="flex flex-col divide-y rounded-xl border bg-card">
            {rows.map((row) => (
              <li key={row.key} className="flex min-h-11 items-center justify-between gap-3 p-3 text-sm">
                <span className="min-w-0">{row.label}</span>
                {cell(current, row)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

/**
 * Profils et droits (fiches core.roles et core.field-masks) : droits par rôle, puis données sensibles.
 * Modifiable seulement avec core.roles.manage ; l'administrateur garde toujours tous les droits.
 */
export function RolesScreen() {
  const t = useTranslations("admin");
  const label = useLabel();
  const can = useCan();
  const { data, apply } = useAdminData();
  const editable = can("core.roles.manage");

  if (data === undefined)
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-3" aria-busy>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  if (data === null)
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <h1 className="text-2xl font-semibold tracking-tight">{t("rolesTitle")}</h1>
        <EmptyState description={t("signedOutOnly")} />
      </div>
    );

  const roles = data.roles.filter((r) => r.isActive);
  const locked = (r: Role) => !editable || r.code === "admin";
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5" data-testid="roles-screen">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t("rolesTitle")}</h1>
        <p className="mt-1 text-muted-foreground">{t("rolesSubtitle")}</p>
      </header>
      <Tabs defaultValue="rights">
        <TabsList>
          <TabsTrigger value="rights">{t("tabRights")}</TabsTrigger>
          <TabsTrigger value="sensitive">{t("tabSensitive")}</TabsTrigger>
        </TabsList>
        <TabsContent value="rights" className="mt-4 flex flex-col gap-3">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheckIcon className="size-4 text-gold-strong" aria-hidden /> {t("adminFixed")}
          </p>
          <p className="text-sm text-muted-foreground">{t("powerWarning")}</p>
          <RoleMatrix
            rows={data.permissions.map((p) => ({ key: p.code, label: label(p.label) }))}
            roles={roles}
            rowsTitle={t("tabRights")}
            isOn={(r, row) => r.code === "admin" || r.permissions.includes(row.key)}
            isLocked={locked}
            onChange={(r, row, on) => apply(() => setRolePermission(r.id, row.key, on), t("saved"))}
          />
        </TabsContent>
        <TabsContent value="sensitive" className="mt-4 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">{t("sensitiveHint")}</p>
          {data.sensitiveFields.length === 0 ? (
            <EmptyState title={t("tabSensitive")} description={t("noSensitive")} />
          ) : (
            <RoleMatrix
              rows={data.sensitiveFields.map((f) => ({ key: f.key, label: label(f.label) }))}
              roles={roles}
              rowsTitle={t("tabSensitive")}
              isOn={(r, row) => r.code === "admin" || !r.masks.includes(row.key)}
              isLocked={locked}
              onChange={(r, row, visible) => apply(() => setFieldMask(r.id, row.key, !visible), t("saved"))}
              stateLabel={(on) => (on ? t("visible") : t("hidden"))}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
