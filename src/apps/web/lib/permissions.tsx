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
