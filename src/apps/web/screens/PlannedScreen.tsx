"use client";

import { EmptyState } from "@smart-collab/ui";
import { ConstructionIcon } from "lucide-react";
import { useTranslations } from "next-intl";

/** Écran provisoire d'un module pas encore construit (prévu dans un lot suivant). */
export function PlannedScreen({ name, lot }: { name: string; lot: number }) {
  const t = useTranslations("screens");
  return (
    <div className="rounded-xl border bg-card shadow-card">
      <EmptyState icon={<ConstructionIcon className="size-6" />} title={name} description={t("planned", { lot })} />
    </div>
  );
}
