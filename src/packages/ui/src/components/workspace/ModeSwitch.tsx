"use client";

import { LayoutGridIcon, ListIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { type LayoutMode, isLayoutMode } from "./state";

/**
 * Bouton de l'en-tête : mode Liste ou mode Mosaïque.
 * (Infobulle native « title » : une infobulle Radix autour du bouton masquerait son état choisi.)
 */
export function ModeSwitch({ mode, onChange }: { mode: LayoutMode; onChange: (mode: LayoutMode) => void }) {
  const t = useTranslations("ui.workspace");
  return (
    <ToggleGroup type="single" size="sm" variant="outline" spacing={0} aria-label={t("mode")} value={mode} onValueChange={(v) => isLayoutMode(v) && onChange(v)}>
      <ToggleGroupItem value="list" aria-label={t("list")} title={t("list")}>
        <ListIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="mosaic" aria-label={t("mosaic")} title={t("mosaic")}>
        <LayoutGridIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
