"use client";

import { App } from "antd";
import { useTranslations } from "next-intl";

/**
 * Notifications courtes (succès, erreur, information).
 * Nécessite le composant <App> d'Ant Design autour de l'application.
 */
export function useToast() {
  const { message } = App.useApp();
  const t = useTranslations("ui.toast");
  return {
    success: (text?: string) => message.success(text ?? t("saved")),
    error: (text?: string) => message.error(text ?? t("error")),
    info: (text: string) => message.info(text),
    warning: (text: string) => message.warning(text),
  };
}
