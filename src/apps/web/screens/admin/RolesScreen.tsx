"use client";

import { ConfirmDialog, EmptyState } from "@smart-collab/ui";
import { Button } from "@smart-collab/ui/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@smart-collab/ui/components/ui/dialog";
import { Input } from "@smart-collab/ui/components/ui/input";
import { Label } from "@smart-collab/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@smart-collab/ui/components/ui/select";
import { Skeleton } from "@smart-collab/ui/components/ui/skeleton";
import { Switch } from "@smart-collab/ui/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@smart-collab/ui/components/ui/tabs";
import { PencilIcon, PlusIcon, ShieldCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { type Role, createRole, renameRole, saveRoleChanges, setRoleActive } from "@/lib/admin/actions";
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

type Change = { roleId: string; kind: "permission" | "mask"; key: string; on: boolean };

/**
 * Profils et droits (fiches core.roles et core.field-masks) : cartes des profils, puis droits et données sensibles.
 * Les changements de droits sont mis en attente puis enregistrés d'un coup (décision G4) ; chacun est tracé au journal.
 * Modifiable seulement avec core.roles.manage ; l'administrateur garde toujours tous les droits.
 */
export function RolesScreen() {
  const t = useTranslations("admin");
  const label = useLabel();
  const can = useCan();
  const { data, apply } = useAdminData();
  const editable = can("core.roles.manage");
  const [pending, setPending] = useState<Change[]>([]);
  const [saving, setSaving] = useState(false);
  const [editor, setEditor] = useState<{ role?: Role; fr: string; en: string; copyFrom: string }>();
  const [deactivating, setDeactivating] = useState<Role>();

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
  const pendingOf = (r: Role, kind: Change["kind"], key: string) => pending.find((c) => c.roleId === r.id && c.kind === kind && c.key === key);
  const toggle = (r: Role, kind: Change["kind"], key: string, on: boolean, saved: boolean) =>
    setPending((list) => {
      const rest = list.filter((c) => !(c.roleId === r.id && c.kind === kind && c.key === key));
      // Revenir à l'état enregistré annule la modification en attente
      return on === saved ? rest : [...rest, { roleId: r.id, kind, key, on }];
    });
  const membersOf = (r: Role) => data.members.filter((m) => m.isActive && m.roleIds.includes(r.id)).length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5" data-testid="roles-screen">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("rolesTitle")}</h1>
          <p className="mt-1 text-muted-foreground">{t("rolesSubtitle")}</p>
        </div>
        {editable && (
          <Button onClick={() => setEditor({ fr: "", en: "", copyFrom: "" })}>
            <PlusIcon /> {t("createProfile")}
          </Button>
        )}
      </header>

      {/* Cartes des profils (fiche core.roles) */}
      <section aria-label={t("profiles")} className="grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-3">
        {data.roles.map((r) => (
          <article key={r.id} data-profile={r.code} className="flex flex-col gap-1 rounded-xl border bg-card p-4 shadow-card data-[inactive=true]:opacity-60" data-inactive={!r.isActive}>
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">
                {label(r.name)} {!r.isActive && <span className="text-xs font-normal text-muted-foreground">· {t("inactiveProfile")}</span>}
              </h2>
              {editable && r.code !== "admin" && (
                <span className="flex shrink-0 gap-1">
                  <Button size="icon" variant="ghost" className="size-8" aria-label={`${t("rename")} ${label(r.name)}`} onClick={() => setEditor({ role: r, fr: r.name.fr, en: r.name.en, copyFrom: "" })}>
                    <PencilIcon />
                  </Button>
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("rightsCount", { count: r.code === "admin" ? data.permissions.length : r.permissions.length })} · {t("membersCount", { count: membersOf(r) })}
            </p>
            {editable && r.code !== "admin" && (
              <Button
                size="sm"
                variant="ghost"
                className="mt-1 self-start px-0 text-muted-foreground"
                onClick={() => (r.isActive ? setDeactivating(r) : apply(() => setRoleActive(r.id, true, ""), t("saved")))}
              >
                {r.isActive ? t("deactivateProfile") : t("reactivate")}
              </Button>
            )}
          </article>
        ))}
      </section>

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
          <h3 className="text-sm font-semibold text-muted-foreground">{t("appGroup")}</h3>
          <RoleMatrix
            rows={data.permissions.map((p) => ({ key: p.code, label: label(p.label) }))}
            roles={roles}
            rowsTitle={t("tabRights")}
            isOn={(r, row) => r.code === "admin" || (pendingOf(r, "permission", row.key)?.on ?? r.permissions.includes(row.key))}
            isLocked={locked}
            onChange={(r, row, on) => toggle(r, "permission", row.key, on, r.permissions.includes(row.key))}
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
              isOn={(r, row) => r.code === "admin" || (pendingOf(r, "mask", row.key)?.on ?? !r.masks.includes(row.key))}
              isLocked={locked}
              onChange={(r, row, visible) => toggle(r, "mask", row.key, visible, !r.masks.includes(row.key))}
              stateLabel={(on) => (on ? t("visible") : t("hidden"))}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Barre d'enregistrement (décision G4) */}
      {pending.length > 0 && (
        <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card p-3 shadow-card" data-testid="pending-bar">
          <span className="text-sm font-medium">{t("pendingChanges", { count: pending.length })}</span>
          <span className="flex gap-2">
            <Button variant="ghost" disabled={saving} onClick={() => setPending([])}>
              {t("discard")}
            </Button>
            <Button
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                const result = await apply(() => saveRoleChanges(pending), t("saved"));
                setSaving(false);
                if (result.ok) setPending([]);
              }}
            >
              {t("save")}
            </Button>
          </span>
        </div>
      )}

      {/* Créer ou renommer un profil */}
      <Dialog open={!!editor} onOpenChange={(o) => !o && setEditor(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editor?.role ? t("rename") : t("createProfile")}</DialogTitle>
          </DialogHeader>
          {editor && (
            <form
              className="flex flex-col gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                const name = { fr: editor.fr, en: editor.en };
                const result = await apply(
                  () => (editor.role ? renameRole(editor.role.id, name) : createRole(name, editor.copyFrom || null)),
                  t("saved"),
                );
                if (result.ok) setEditor(undefined);
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role-fr">{t("nameFr")}</Label>
                <Input id="role-fr" required minLength={2} maxLength={60} value={editor.fr} onChange={(e) => setEditor({ ...editor, fr: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role-en">{t("nameEn")}</Label>
                <Input id="role-en" required minLength={2} maxLength={60} value={editor.en} onChange={(e) => setEditor({ ...editor, en: e.target.value })} />
              </div>
              {!editor.role && (
                <div className="flex flex-col gap-1.5">
                  <Label>{t("copyFrom")}</Label>
                  <Select value={editor.copyFrom || "none"} onValueChange={(v) => setEditor({ ...editor, copyFrom: v === "none" ? "" : v })}>
                    <SelectTrigger aria-label={t("copyFrom")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t("emptyProfile")}</SelectItem>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {label(r.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <DialogFooter>
                <Button type="submit" disabled={editor.fr.trim().length < 2 || editor.en.trim().length < 2}>
                  {t("save")}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deactivating}
        onOpenChange={(o) => !o && setDeactivating(undefined)}
        title={t("deactivateProfile")}
        description={deactivating ? t("deactivateProfileConfirm", { name: label(deactivating.name) }) : undefined}
        danger
        requireReason
        confirmLabel={t("deactivateProfile")}
        onConfirm={(reason) => {
          const r = deactivating;
          setDeactivating(undefined);
          if (r) apply(() => setRoleActive(r.id, false, reason ?? ""), t("saved"));
        }}
      />
    </div>
  );
}
