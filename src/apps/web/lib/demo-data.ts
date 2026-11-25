import type { Status } from "@smart-collab/ui";

/**
 * Données de démonstration FICTIVES (aucune donnée réelle d'entreprise).
 * Les montants sont des chaînes, comme les `numeric` renvoyés par la base.
 */
export type DemoProduct = {
  id: string;
  reference: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: Status;
};

export const DEMO_COMPANY = "Boutique Démo Cocody (fictive)";

export const demoProducts: DemoProduct[] = [
  { id: "1", reference: "PRD-0001", name: "Riz parfumé 5 kg", category: "Épicerie", price: "4500", stock: 120, status: "inStock" },
  { id: "2", reference: "PRD-0002", name: "Huile végétale 1 L", category: "Épicerie", price: "1500", stock: 8, status: "lowStock" },
  { id: "3", reference: "PRD-0003", name: "Savon de ménage (lot de 4)", category: "Entretien", price: "1200", stock: 0, status: "outOfStock" },
  { id: "4", reference: "PRD-0004", name: "Lait en poudre 400 g", category: "Épicerie", price: "3250", stock: 46, status: "inStock" },
  { id: "5", reference: "PRD-0005", name: "Cahier 200 pages", category: "Papeterie", price: "750", stock: 300, status: "inStock" },
  { id: "6", reference: "PRD-0006", name: "Ventilateur de table", category: "Électroménager", price: "18500", stock: 5, status: "lowStock" },
  { id: "7", reference: "PRD-0007", name: "Eau minérale 1,5 L (pack de 6)", category: "Boissons", price: "2100", stock: 75, status: "inStock" },
];

export const demoSales = {
  thisYear: [8.2, 9.1, 10.4, 9.8, 11.6, 12.9],
  lastYear: [7.1, 7.9, 8.8, 9.0, 9.7, 10.5],
};

export const demoReportLines = [
  { label: "Épicerie", amount: "2450000" },
  { label: "Boissons", amount: "830500" },
  { label: "Entretien", amount: "412000" },
  { label: "Papeterie", amount: "198750" },
];
