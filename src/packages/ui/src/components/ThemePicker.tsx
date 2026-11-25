"use client";

import { CheckIcon, MoonIcon, PaletteIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useScTheme } from "../context";
import { ACCENT_PRESETS, type AccentPreset, isThemeMode } from "../tokens";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

/** Sélecteur de couleur principale et de thème clair / sombre (en haut à droite). */
export function ThemePicker() {
  const t = useTranslations("ui.theme");
  const { mode, accent, setMode, setAccent } = useScTheme();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("open")}>
          <PaletteIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60">
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">{t("mode")}</p>
        <ToggleGroup
          type="single"
          variant="outline"
          className="w-full"
          value={mode}
          onValueChange={(v) => isThemeMode(v) && setMode(v)}
        >
          <ToggleGroupItem value="light" className="flex-1">
            <SunIcon /> {t("light")}
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" className="flex-1">
            <MoonIcon /> {t("dark")}
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="mt-4 mb-2 text-xs font-medium text-muted-foreground uppercase">{t("color")}</p>
        <div className="flex gap-2" role="radiogroup" aria-label={t("color")}>
          {(Object.keys(ACCENT_PRESETS) as AccentPreset[]).map((key) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={accent === key}
              aria-label={t(`accents.${key}`)}
              title={t(`accents.${key}`)}
              onClick={() => setAccent(key)}
              // Couleurs lues dans tokens.ts (aperçu de chaque choix)
              style={{ background: ACCENT_PRESETS[key].accent, color: ACCENT_PRESETS[key].on }}
              className="flex size-8 items-center justify-center rounded-full ring-offset-2 ring-offset-popover outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            >
              {accent === key && <CheckIcon className="size-4" aria-hidden />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
