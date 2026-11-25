"use client";

import { Button, Popover, Segmented } from "antd";
import { Check, Moon, Palette, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useScTheme } from "../context";
import { ACCENT_PRESETS, type AccentPreset, type ThemeMode } from "../tokens";

/** Sélecteur de couleur principale et de thème clair / sombre (en haut à droite). */
export function ThemePicker() {
  const t = useTranslations("ui.theme");
  const { mode, accent, setMode, setAccent } = useScTheme();
  const content = (
    <div className="flex w-56 flex-col gap-3">
      <div>
        <p className="mb-2 text-xs font-medium uppercase text-muted">{t("mode")}</p>
        <Segmented<ThemeMode>
          block
          value={mode}
          onChange={setMode}
          options={[
            { value: "light", label: t("light"), icon: <Sun className="size-3.5" /> },
            { value: "dark", label: t("dark"), icon: <Moon className="size-3.5" /> },
          ]}
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase text-muted">{t("color")}</p>
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
              style={{ background: ACCENT_PRESETS[key].accent, color: ACCENT_PRESETS[key].on }}
              className="flex size-8 items-center justify-center rounded-full ring-offset-2 ring-offset-card focus-visible:ring-2 focus-visible:ring-ink"
            >
              {accent === key && <Check className="size-4" aria-hidden />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <Button type="text" shape="circle" aria-label={t("open")} icon={<Palette className="size-[18px]" />} />
    </Popover>
  );
}
