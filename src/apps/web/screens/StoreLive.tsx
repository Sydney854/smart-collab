"use client";

import { ConfirmDialog, ModuleIcon, type ModuleIconKey, iconSizeVars, useAppearance } from "@smart-collab/ui";
import { Button } from "@smart-collab/ui/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@smart-collab/ui/components/ui/dialog";
import { ArchiveIcon, BlocksIcon, CheckIcon, ClockIcon, LockIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { type PreviewItem, type StoreApp, type StoreData, installApp, loadStore, previewInstall, uninstallApp } from "@/lib/apps/actions";
import { useCan } from "@/lib/permissions";

/** Icône illustrée quand elle existe pour l'application (ICONES_MODULES.md), sinon une icône Lucide sobre */
const ICONS: Record<string, ModuleIconKey> = { core: "apps", inventory: "stock", purchase: "purchases", finance: "finance", pos: "pos", sales: "sales" };
/** Lot où l'application devient utilisable (13_PLAN_LOTS.md) : au-delà du lot courant, statut « À venir » */
const CURRENT_LOT = 1;

/**
 * App Store réel (lot 1, étape 4 ; fiche core.apps ; EF-APP-01 à 06) : applications par famille, statut,
 * Installer (liste des dépendances avant confirmation), Désinstaller (motif, données conservées), Réinstaller.
 */
export function StoreLive({ initial }: { initial: StoreData }) {
  const t = useTranslations("store");
  const tf = useTranslations("families");
  const locale = useLocale() as "fr" | "en";
  const router = useRouter();
  const can = useCan();
  const { iconStyle, iconSize } = useAppearance();
  const [data, setData] = useState(initial);
  const [preview, setPreview] = useState<{ app: StoreApp; items: PreviewItem[] }>();
  const [removing, setRemoving] = useState<StoreApp>();
  const [busy, setBusy] = useState(false);
  const name = (a: { name: { fr: string; en: string } }) => a.name[locale] ?? a.name.fr;
  const manage = can("core.apps.manage");

  const refresh = async () => {
    const next = await loadStore();
    if (next) setData(next);
    // Le menu ne montre que les applications installées (EF-APP-04) : la page relit l'installation
    router.refresh();
  };

  const families = ["core", "sales", "supply", "finance"] as const;
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6" data-testid="store-live">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </header>
      {families.map((family) => {
        const apps = data.apps.filter((a) => a.category === family);
        if (apps.length === 0) return null;
        return (
          <section key={family} className="flex flex-col gap-3">
            <h2 className="font-semibold">{tf(family)}</h2>
            <ul className="sc-icon-sized grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4" style={iconSizeVars(iconSize)}>
              {apps.map((a) => {
                const upcoming = (a.lot ?? 1) > CURRENT_LOT;
                return (
                  <li key={a.id} data-app={a.id} data-status={a.status} className="flex min-w-0 flex-col gap-3 rounded-2xl border bg-card p-4 shadow-card">
                    <span className="grid size-[var(--sc-icon-box)] place-items-center rounded-[22%] border bg-card shadow-card">
                      {ICONS[a.id] ? (
                        <ModuleIcon module={ICONS[a.id]} iconStyle={iconStyle} className="size-[var(--sc-icon-draw)]" />
                      ) : (
                        <BlocksIcon className="size-[var(--sc-icon-draw)] text-gold-strong" aria-hidden />
                      )}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold">{name(a)}</h3>
                      {a.dependsOn.filter((d) => d !== "core").length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {t("needs", { list: a.dependsOn.filter((d) => d !== "core").map((d) => name(data.apps.find((x) => x.id === d) ?? { name: { fr: d, en: d } })).join(", ") })}
                        </p>
                      )}
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
                      {a.isCore ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                          <LockIcon className="size-3" aria-hidden /> {t("alwaysOn")}
                        </span>
                      ) : a.status === "installed" ? (
                        <>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-green-l px-2.5 py-1 text-xs font-semibold text-green">
                            <CheckIcon className="size-3.5" aria-hidden /> {t("installed")}
                          </span>
                          {manage && (
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setRemoving(a)}>
                              {t("uninstall")}
                            </Button>
                          )}
                        </>
                      ) : !a.inPlan ? (
                        <span className="text-xs font-semibold text-muted-foreground">{t("notInPlan")}</span>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            {a.status === "archived" ? <ArchiveIcon className="size-3" aria-hidden /> : upcoming ? <ClockIcon className="size-3" aria-hidden /> : null}
                            {a.status === "archived" ? t("archived") : upcoming ? t("upcomingLot", { lot: a.lot ?? 0 }) : t("available")}
                          </span>
                          {manage && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-primary"
                              disabled={busy}
                              onClick={async () => setPreview({ app: a, items: await previewInstall(a.id) })}
                            >
                              {a.status === "archived" ? t("reinstall") : t("install")}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {/* Installer : liste des applications ajoutées avant confirmation (EF-APP-02) */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{preview && t("installTitle", { name: name(preview.app) })}</DialogTitle>
            <DialogDescription>{t("installWillAdd")}</DialogDescription>
          </DialogHeader>
          <ul className="flex flex-col gap-1 text-sm" data-testid="install-preview">
            {preview?.items
              .filter((i) => !i.installed)
              .map((i) => (
                <li key={i.id} className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-green" aria-hidden /> {name(i)}
                </li>
              ))}
          </ul>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPreview(undefined)}>
              {t("cancel")}
            </Button>
            <Button
              disabled={busy}
              onClick={async () => {
                if (!preview) return;
                setBusy(true);
                const result = await installApp(preview.app.id);
                setBusy(false);
                setPreview(undefined);
                if (result.ok) toast.success(t("installedLiveToast", { name: name(preview.app) }));
                else toast.error(t(`errors.${result.error ?? "failed"}`));
                await refresh();
              }}
            >
              {t("confirmInstall")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Désinstaller : motif obligatoire, données conservées (EF-APP-03) */}
      <ConfirmDialog
        open={!!removing}
        onOpenChange={(o) => !o && setRemoving(undefined)}
        title={removing ? t("uninstallTitle", { name: name(removing) }) : ""}
        description={t("uninstallKeepsData")}
        danger
        requireReason
        confirmLabel={t("uninstall")}
        onConfirm={async (reason) => {
          const a = removing;
          setRemoving(undefined);
          if (!a) return;
          const result = await uninstallApp(a.id, reason ?? "");
          if (result.ok) toast.success(t("uninstalledToast", { name: name(a) }));
          else if (result.error === "dependents")
            toast.error(t("errors.dependents", { list: (result.detail ?? "").split(", ").map((d) => name(data.apps.find((x) => x.id === d) ?? { name: { fr: d, en: d } })).join(", ") }));
          else toast.error(t(`errors.${result.error ?? "failed"}`));
          await refresh();
        }}
      />
    </div>
  );
}
