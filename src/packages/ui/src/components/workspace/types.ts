import type { ReactNode } from "react";
import type { ModuleIconKey } from "../ModuleIcon";

/** Un écran de l'application : écrit une fois, affiché en page ou en fenêtre. */
export type ScreenDef = {
  key: string;
  label: string;
  /** Icône Lucide : menu latéral, onglets, barre de titre des fenêtres */
  icon: ReactNode;
  /** Icône illustrée du module : tuiles de la mosaïque (05_UI_UX/ICONES_MODULES.md) */
  moduleIcon?: ModuleIconKey;
  /** Phrase courte (App Store, assistant) ; pas affichée sur la mosaïque */
  description?: string;
  /** Page de démonstration : ni dans le menu ni en tuile ; ouverte seulement par son adresse (?ecran=…), depuis la page de maquettes (décision du 26/11/2026) */
  hidden?: boolean;
  render: () => ReactNode;
};
