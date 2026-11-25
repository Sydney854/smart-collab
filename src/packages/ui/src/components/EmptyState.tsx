"use client";

import { Inbox } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

/** Message affiché quand une liste ou un écran n'a encore aucune donnée. */
export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  const t = useTranslations("ui.empty");
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-bg text-muted">
        {icon ?? <Inbox className="size-6" aria-hidden />}
      </div>
      <div>
        <p className="font-semibold text-ink">{title ?? t("title")}</p>
        <p className="mt-1 text-sm text-muted">{description ?? t("description")}</p>
      </div>
      {action}
    </div>
  );
}
