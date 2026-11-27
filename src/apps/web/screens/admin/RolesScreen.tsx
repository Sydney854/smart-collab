"use client";

import { EmptyState } from "@smart-collab/ui";
import { Switch } from "@smart-collab/ui/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@smart-collab/ui/components/ui/tabs";
import { ShieldCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { setFieldMask, setRolePermission } from "@/lib/admin/actions";
import { useCan } from "@/lib/permissions";
import { useAdminData, useLabel } from "./useAdminData";

/**
 * Profils et droits (fiches core.roles et core.field-masks) : matrice permission × rôle, puis données sensibles.
 * Modifiable seulement avec core.roles.manage ; l'administrateur garde toujours tous les droits.
 */
export function RolesScreen() {
  const t = useTranslations("admin");
  const label = useLabel();
  const can = useCan();
  const { data, apply } = useAdminData();
  const editable = can("core.roles.manage");

  if (data === undefined) return <p className="text-muted-foreground">…</p>;
  if (data === null) return <EmptyState title={t("rolesTitle")} description={t("signedOutOnly")} />;

  const roles = data.roles.filter((r) => r.isActive);
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
        <TabsContent value="rights" className="mt-4">
          <p className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheckIcon className="size-4 text-gold-strong" aria-hidden /> {t("adminFixed")}
          </p>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th scope="col" className="sticky left-0 bg-muted/50 p-3 text-left font-medium">
                    {t("tabRights")}
                  </th>
                  {roles.map((r) => (
                    <th key={r.id} scope="col" className="min-w-28 p-3 text-center font-medium">
                      {label(r.name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.permissions.map((p) => (
                  <tr key={p.code} className="border-b last:border-0">
                    <th scope="row" className="sticky left-0 bg-card p-3 text-left font-normal">
                      {label(p.label)}
                    </th>
                    {roles.map((r) => {
                      const on = r.code === "admin" || r.permissions.includes(p.code);
                      return (
                        <td key={r.id} className="p-3 text-center">
                          <Switch
                            checked={on}
                            disabled={!editable || r.code === "admin"}
                            aria-label={`${label(p.label)} · ${label(r.name)}`}
                            data-permission={p.code}
                            data-role={r.code}
                            onCheckedChange={(v) => apply(() => setRolePermission(r.id, p.code, v), t("saved"))}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="sensitive" className="mt-4">
          <p className="mb-3 text-sm text-muted-foreground">{t("sensitiveHint")}</p>
          {data.sensitiveFields.length === 0 ? (
            <EmptyState title={t("tabSensitive")} description={t("noSensitive")} />
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-card">
              <table className="w-full text-sm">
                <tbody>
                  {data.sensitiveFields.map((f) => (
                    <tr key={f.key} className="border-b last:border-0">
                      <th scope="row" className="p-3 text-left font-normal">
                        {label(f.label)}
                      </th>
                      {roles.map((r) => {
                        const masked = r.code !== "admin" && r.masks.includes(f.key);
                        return (
                          <td key={r.id} className="p-3 text-center">
                            <span className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                              <Switch
                                checked={!masked}
                                disabled={!editable || r.code === "admin"}
                                aria-label={`${label(f.label)} · ${label(r.name)}`}
                                onCheckedChange={(visible) => apply(() => setFieldMask(r.id, f.key, !visible), t("saved"))}
                              />
                              {masked ? t("hidden") : t("visible")}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
