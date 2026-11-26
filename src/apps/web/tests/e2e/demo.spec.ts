import { type Page, expect, test } from "@playwright/test";

/** Les 14 composants de 05_UI_UX/COMPOSANTS.md, regroupés par section de la page. */
const SECTIONS = ["shell", "period", "kpi", "chart", "list", "form", "status", "offline", "print", "app-card", "feedback"];

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

async function open(page: Page) {
  await page.goto("/demo");
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
}

test("les 14 composants s'affichent, sans erreur dans la console", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await open(page);
  await expect(page.getByRole("heading", { level: 1, name: "Composants Smart Collab" })).toBeVisible();
  for (const id of SECTIONS) await expect(page.getByTestId(`section-${id}`)).toBeVisible();
  await expect(page.getByTestId("section-chart").locator("svg.apexcharts-svg")).toBeVisible();
  await expect(page.getByTestId("section-status").locator("[data-status]")).toHaveCount(10);
  await expect(page.getByTestId("section-app-card").locator("[data-installed]")).toHaveCount(3);
  await expect(page.locator("#field-name")).toHaveValue("Riz parfumé 5 kg");
  expect(errors).toEqual([]);
});

test("la page tient dans la largeur de l'écran", async ({ page }) => {
  await open(page);
  const [scroll, width] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  expect(scroll).toBeLessThanOrEqual(width);
});

test("barre de période : boutons prédéfinis, puis date de début et date de fin", async ({ page }) => {
  await open(page);
  const bar = page.getByTestId("section-period");
  const label = page.getByTestId("period-label");
  await bar.getByRole("radio", { name: "Année" }).click();
  await expect(label).toContainText(`du 01/01/${new Date().getFullYear()}`);

  // Date de début : un seul mois s'ouvre, puis se referme après le choix
  await bar.getByRole("button", { name: /^Du :/ }).click();
  await expect(page.getByRole("grid")).toHaveCount(1);
  await page.getByRole("grid").locator("button", { hasText: /^10$/ }).first().click();
  await expect(page.getByRole("grid")).toHaveCount(0);
  await expect(label).toContainText("du 10/01/");

  // Date de fin : idem ; les jours avant la date de début ne sont pas proposés
  await bar.getByRole("button", { name: /^Au :/ }).click();
  await expect(page.getByRole("grid")).toHaveCount(1);
  await page.getByRole("grid").locator("button", { hasText: /^20$/ }).first().click();
  await expect(page.getByRole("grid")).toHaveCount(0);
  await expect(label).toContainText(/au 20\/\d{2}\//);
  await expect(bar.getByRole("radio", { name: "Personnalisée" })).toHaveAttribute("data-state", "on");
});

test("fiche : un champ obligatoire vide et un montant invalide sont refusés", async ({ page }) => {
  await open(page);
  await page.locator("#field-name").fill("");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByTestId("section-form")).toContainText("Ce champ est obligatoire");
  await page.locator("#field-name").fill("Riz parfumé 5 kg");
  await page.getByRole("tab", { name: "Prix" }).click();
  await page.locator("#field-salePrice").fill("45,50");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByTestId("section-form")).toContainText("Saisissez un montant en francs");
  await page.locator("#field-salePrice").fill("4550");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText("Fiche enregistrée")).toBeVisible();
});

test("une annulation exige un motif", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Annuler une facture" }).click();
  const dialog = page.getByRole("alertdialog");
  const confirm = dialog.getByRole("button", { name: "Annuler la facture" });
  await expect(confirm).toBeDisabled();
  await dialog.getByRole("textbox").fill("Erreur de quantité");
  await expect(confirm).toBeEnabled();
  await confirm.click();
  await expect(page.getByText("Facture annulée. Motif : Erreur de quantité")).toBeVisible();
});

test("aperçu avant impression", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Ouvrir l'aperçu" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("État des ventes");
  await expect(dialog).toContainText("3 891 250");
});

test("le bandeau hors ligne affiche les opérations en attente", async ({ page }) => {
  await open(page);
  await page.getByRole("switch", { name: "Simuler une coupure" }).click();
  await expect(page.getByTestId("section-offline")).toContainText("3 opérations en attente");
});

test("installer une application met à jour sa carte", async ({ page }) => {
  await open(page);
  const cards = page.getByTestId("section-app-card");
  await cards.getByRole("button", { name: "Installer" }).click();
  await expect(cards.locator("[data-installed=true]")).toHaveCount(2);
});

test("les pages de démonstration ne sont dans aucun menu, mais s'ouvrent par leur adresse", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  if (isMobile) await page.getByRole("button", { name: "Afficher ou réduire le menu" }).click();
  await expect(page.getByRole("button", { name: "Composants (démo)" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Assistant (démo)" })).toHaveCount(0);
  await page.goto("/?ecran=components");
  await expect(page.getByRole("heading", { level: 1, name: "Composants Smart Collab" })).toBeVisible();
  await page.goto("/?ecran=setup");
  await expect(page.getByRole("heading", { level: 1, name: "Choisissez les modules de votre entreprise" })).toBeVisible();
});
