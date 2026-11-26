import type { ModuleIconKey } from "@smart-collab/ui";

/**
 * Catalogue de démonstration des modules (App Store et assistant, maquettes du lot 0).
 * Familles : 01_DOCUMENTATION/catalogue/CATALOGUE_MODULES.md § 2.
 * La version réelle (registre des applications, installation, dépendances) arrive au lot 1.
 */
export const FAMILIES = ["core", "sales", "supply", "finance", "hr"] as const;
export type Family = (typeof FAMILIES)[number];

export type CatalogModule = {
  key: ModuleIconKey;
  family: Family;
  /** Module du socle : toujours actif, non désinstallable */
  core?: boolean;
  /** Installé dans l'entreprise de démonstration */
  installed?: boolean;
  /** Exemple de module à venir (pas encore dans l'application) */
  example?: boolean;
};

export const CATALOG: CatalogModule[] = [
  { key: "dashboard", family: "core", core: true },
  { key: "apps", family: "core", core: true },
  { key: "sales", family: "sales", installed: true },
  { key: "pos", family: "sales", installed: true },
  { key: "stock", family: "supply", installed: true },
  { key: "purchases", family: "supply", installed: true },
  { key: "finance", family: "finance", installed: true },
  { key: "hr-employees", family: "hr", example: true },
  { key: "hr-attendance", family: "hr", example: true },
  { key: "hr-payroll", family: "hr", example: true },
];

/** Sélection de départ de l'assistant (en plus du socle). */
export const WIZARD_INITIAL_SELECTION: ModuleIconKey[] = ["sales", "pos", "stock"];
