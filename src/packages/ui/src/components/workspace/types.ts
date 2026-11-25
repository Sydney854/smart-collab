import type { ReactNode } from "react";

/** Un écran de l'application : écrit une fois, affiché en page ou en fenêtre. */
export type ScreenDef = {
  key: string;
  label: string;
  icon: ReactNode;
  /** Phrase courte affichée sur la tuile (mode Mosaïque) */
  description?: string;
  render: () => ReactNode;
};
