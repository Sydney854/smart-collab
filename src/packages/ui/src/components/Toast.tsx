"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

/**
 * Notifications courtes (sonner) avec des textes par défaut traduits.
 * Le composant <Toaster /> est placé une seule fois dans l'application.
 */
export function useToast() {
  const t = useTranslations("ui.toast");
  return {
    success: (text?: string) => toast.success(text ?? t("saved")),
    error: (text?: string) => toast.error(text ?? t("error")),
    info: (text: string) => toast.info(text),
    warning: (text: string) => toast.warning(text),
    /** Notification avec bouton « Annuler » (ex. après une suppression de brouillon) */
    undoable: (text: string, onUndo: () => void) => toast(text, { action: { label: t("undo"), onClick: onUndo } }),
  };
}
