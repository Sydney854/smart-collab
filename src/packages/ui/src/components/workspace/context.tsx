"use client";

import { createContext, useContext } from "react";

/** Où l'écran est affiché : dans la page (mode Liste) ou dans une fenêtre (mode Mosaïque). */
export type ScreenContainer = "page" | "window";
export const ScreenContainerContext = createContext<ScreenContainer>("page");

/**
 * Un écran est écrit une seule fois ; s'il doit s'adapter (rare), il lit ici où il est affiché.
 * Pour la mise en page, préférer les requêtes de conteneur Tailwind (@md:, @xl:…),
 * qui suivent la largeur réelle de la page ou de la fenêtre.
 */
export function useScreenContainer() {
  return useContext(ScreenContainerContext);
}

/** Ouvrir un autre écran depuis un écran (ex. Paramètres → Collaborateurs), en page ou en fenêtre selon le mode */
export const OpenScreenContext = createContext<(key: string) => void>(() => {});
export function useOpenScreen() {
  return useContext(OpenScreenContext);
}
