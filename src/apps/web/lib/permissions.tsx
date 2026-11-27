"use client";

import { createContext, useContext } from "react";

/**
 * Droits de la personne connectée (lus dans la base à l'ouverture de la page), pour masquer les écrans et les
 * boutons non permis. « all » : démonstration sans connexion (données fictives). La base revérifie toujours.
 */
export type Permissions = string[] | "all";
export const PermissionsContext = createContext<Permissions>([]);

export function useCan() {
  const perms = useContext(PermissionsContext);
  return (permission: string) => perms === "all" || perms.includes(permission);
}

/** Applications installées dans l'entreprise (EF-APP-04 : le menu ne montre qu'elles). « all » : démonstration sans connexion. */
export type InstalledApps = string[] | "all";
export const InstalledAppsContext = createContext<InstalledApps>("all");

export function useInstalled() {
  const apps = useContext(InstalledAppsContext);
  return (appId: string) => apps === "all" || apps.includes(appId);
}
