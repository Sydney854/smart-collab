import { type Page, expect, test } from "@playwright/test";

const SECTIONS = ["shell", "period", "kpi", "chart", "list", "form", "status", "offline", "print", "app-card", "feedback"];

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

/** Ouvre une page et attend que l'interface soit active (JavaScript chargé). */
async function open(page: Page, path = "/demo") {
  await page.goto(path);
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
}

test("l'accueil mène à la page de démonstration", async ({ page }) => {
  await open(page, "/");
  await expect(page).toHaveURL(/\/demo$/);
});

test("tous les composants s'affichent, sans erreur dans la console", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await open(page);
  await expect(page.getByRole("heading", { level: 1, name: "Composants Smart Collab" })).toBeVisible();
  for (const id of SECTIONS) await expect(page.getByTestId(`section-${id}`)).toBeVisible();
  // Graphique dessiné
  await expect(page.getByTestId("section-chart").locator("svg.apexcharts-svg")).toBeVisible();
  // Fiche pré-remplie
  await expect(page.getByTestId("section-form").locator("input").first()).toHaveValue("Riz parfumé 5 kg");
  expect(errors).toEqual([]);
});

test("thème clair puis sombre, mémorisé après rechargement", async ({ page }) => {
  await open(page);
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "light");
  const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await page.getByRole("button", { name: "Passer en thème sombre" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(darkBg).not.toBe(lightBg);

  await page.reload();
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  await expect(html).toHaveAttribute("data-theme", "dark");
  // Les composants Ant Design suivent aussi le thème
  const cardBg = await page.getByTestId("section-form").locator("form").evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(cardBg).not.toBe("rgb(255, 255, 255)");
});

test("bascule français / anglais, mémorisée après rechargement", async ({ page }) => {
  await open(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await page.getByText("EN", { exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Smart Collab components" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "Smart Collab components" })).toBeVisible();
  await expect(page.getByTestId("section-status")).toContainText("Out of stock");
});

test("le sélecteur de couleur change la couleur principale", async ({ page }) => {
  await open(page);
  const accent = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim());
  const before = await accent();
  await page.getByRole("button", { name: "Thème et couleurs" }).click();
  await page.getByRole("radio", { name: "Bleu" }).click();
  await expect.poll(accent).not.toBe(before);
  await page.reload();
  expect(await accent()).not.toBe(before);
});

test("la liste filtre, sélectionne et ouvre le détail", async ({ page }) => {
  await open(page);
  const list = page.getByTestId("section-list");
  await list.getByRole("textbox", { name: "Rechercher…" }).fill("huile");
  await expect(list.locator("tbody tr.ant-table-row")).toHaveCount(1);
  await list.getByText("Huile végétale 1 L").click();
  await expect(page.locator(".ant-drawer").getByText("Quantité en stock : 8")).toBeVisible();
});

test("une annulation exige un motif", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Annuler une facture" }).click();
  const dialog = page.getByRole("dialog");
  const confirm = dialog.getByRole("button", { name: "Confirmer" });
  await expect(confirm).toBeDisabled();
  await dialog.getByRole("textbox").fill("Erreur de quantité");
  await expect(confirm).toBeEnabled();
  await confirm.click();
  await expect(page.getByText("Facture annulée. Motif : Erreur de quantité")).toBeVisible();
});

test("le bandeau hors ligne affiche les opérations en attente", async ({ page }) => {
  await open(page);
  await page.getByRole("switch", { name: "Simuler une coupure" }).click();
  await expect(page.getByTestId("section-offline")).toContainText("3 opérations en attente");
});

test("le menu utilisateur (Preline) s'ouvre", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Menu utilisateur" }).click();
  await expect(page.getByRole("menuitem", { name: "Se déconnecter" })).toBeVisible();
});
