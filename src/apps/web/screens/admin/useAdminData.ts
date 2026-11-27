"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { type ActionResult, type AdminData, type Label, loadAdminData } from "@/lib/admin/actions";

/** Charge les données d'administration (ce que la base laisse voir) et applique une action serveur avec message */
export function useAdminData() {
  const t = useTranslations("admin");
  const [data, setData] = useState<AdminData | null | undefined>(undefined);
  const reload = useCallback(() => loadAdminData().then(setData), []);
  useEffect(() => {
    reload();
  }, [reload]);
  const apply = useCallback(
    async (action: () => Promise<ActionResult>, success?: string) => {
      const result = await action();
      if (result.ok) {
        if (success) toast.success(success);
      } else toast.error(t(`errors.${result.error ?? "failed"}`));
      await reload();
      return result;
    },
    [reload, t],
  );
  return { data, reload, apply };
}

/** Libellé dans la langue de l'écran */
export function useLabel() {
  const locale = useLocale() as "fr" | "en";
  return (label: Label | null | undefined) => label?.[locale] ?? label?.fr ?? "";
}
