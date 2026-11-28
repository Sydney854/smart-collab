"use client";

import { useTranslations } from "next-intl";
import { useAppearance } from "../../appearance";
import { iconSizeVars } from "../../icon-settings";
import { ModuleIcon } from "../ModuleIcon";
import type { ScreenDef } from "./types";

/**
 * Bureau du mode Mosaïque (05_UI_UX/ICONES_MODULES.md § 4) : un cadre carré arrondi
 * autour de l'icône seule, le nom du module dessous, hors du cadre, sans description.
 * Survol : bordure or et léger soulèvement. Taille réglée dans Paramètres → Apparence.
 */
export function MosaicTiles({ screens, openKeys, onOpen }: { screens: ScreenDef[]; openKeys: string[]; onOpen: (key: string) => void }) {
  const t = useTranslations("ui.workspace");
  const { iconStyle, iconSize } = useAppearance();
  return (
    <div className="sc-icon-sized pt-2 sm:pt-8 md:pt-14" style={iconSizeVars(iconSize)} data-icon-size={iconSize}>
      <h1 className="sr-only">{t("tilesTitle")}</h1>
      {/* Icônes centrées comme un écran d'accueil (décision du 28/11/2026) : colonnes de largeur fixe,
          6 au plus par ligne, le bloc entier centré horizontalement */}
      <ul
        data-testid="mosaic-grid"
        className="mx-auto grid grid-cols-2 justify-center gap-x-3 gap-y-5 sm:max-w-[calc(6*(var(--sc-icon-box)+88px)+5*1.5rem)] sm:grid-cols-[repeat(auto-fit,calc(var(--sc-icon-box)+88px))] sm:gap-x-6 sm:gap-y-7"
        aria-label={t("tilesTitle")}
      >
        {/* Seuls les modules ont une tuile (icône illustrée) ; les pages de démonstration (Composants, Assistant) n'en ont pas (décisions du 26/11/2026) */}
        {screens
          .filter((s) => s.moduleIcon && !s.hidden)
          .map((s) => (
          <li key={s.key} className="min-w-0">
            <button
              type="button"
              data-tile={s.key}
              onClick={() => onOpen(s.key)}
              className="group flex w-full flex-col items-center gap-2.5 rounded-xl px-1 py-1.5 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                data-slot="tile-frame"
                className="relative grid size-[calc(var(--sc-icon-box)+40px)] place-items-center rounded-[24%] border bg-card shadow-card transition group-hover:-translate-y-0.5 group-hover:border-primary motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
              >
                {s.moduleIcon ? (
                  <ModuleIcon module={s.moduleIcon} iconStyle={iconStyle} className="size-[var(--sc-icon-box)]" />
                ) : (
                  <span className="text-gold-strong [&_svg]:size-[var(--sc-icon-draw)]">{s.icon}</span>
                )}
                {openKeys.includes(s.key) && (
                  <span className="absolute top-2 right-2 size-2.5 rounded-full bg-primary ring-2 ring-card" aria-label={t("isOpen")} />
                )}
              </span>
              <span className="line-clamp-2 w-full text-sm leading-tight font-semibold break-words">{s.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
