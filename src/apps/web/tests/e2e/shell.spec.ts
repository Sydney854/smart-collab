import { type Page, expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

/** Ouvre une page et attend que l'interface soit active (JavaScript chargé). */
async function open(page: Page, path = "/") {
  await page.goto(path);
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
}

test("le tableau de bord s'affiche sans erreur, sans Ant Design ni Preline", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await open(page);
  await expect(page.getByRole("heading", { level: 1, name: "Tableau de bord" })).toBeVisible();
  await expect(page.getByTestId("kpis").locator("[data-kpi]")).toHaveCount(4);
  await expect(page.locator("svg.apexcharts-svg")).toBeVisible();
  await expect(page.locator("[data-slot=table] tbody tr")).toHaveCount(5);
  expect(await page.locator("[class*='ant-'], .hs-dropdown").count()).toBe(0);
  expect(errors).toEqual([]);
});

test("la page tient dans la largeur de l'écran (aucun défilement horizontal)", async ({ page }) => {
  await open(page);
  const { scroll, width } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, width: window.innerWidth }));
  expect(scroll).toBeLessThanOrEqual(width);
});

test("thème clair puis sombre, mémorisé après rechargement", async ({ page, isMobile }) => {
  await open(page);
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "light");
  const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  if (isMobile) {
    // Sur téléphone, le choix clair / sombre se fait dans la palette
    await page.getByRole("button", { name: "Thème et couleurs" }).click();
    await page.getByRole("radio", { name: "Sombre" }).click();
  } else {
    await page.getByRole("button", { name: "Passer en thème sombre" }).click();
  }
  await expect(html).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).not.toBe(lightBg);
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
});

test("bascule français / anglais, mémorisée après rechargement", async ({ page }) => {
  await open(page);
  await page.getByRole("radio", { name: "English" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
});

test("le sélecteur de couleur change la couleur principale", async ({ page }) => {
  await open(page);
  const primary = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--sc-accent").trim());
  const before = await primary();
  await page.getByRole("button", { name: "Thème et couleurs" }).click();
  await page.getByRole("radio", { name: "Bleu" }).click();
  await expect.poll(primary).not.toBe(before);
  await page.reload();
  expect(await primary()).not.toBe(before);
});

test("le menu latéral se réduit en icônes et reste réduit", async ({ page, isMobile }) => {
  test.skip(isMobile, "Sur téléphone le menu s'ouvre par-dessus la page");
  await open(page);
  const sidebar = page.locator("[data-slot=sidebar]").first();
  await expect(sidebar).toHaveAttribute("data-state", "expanded");
  await page.getByRole("button", { name: "Afficher ou réduire le menu" }).click();
  await expect(sidebar).toHaveAttribute("data-state", "collapsed");
  await page.reload();
  await expect(page.locator("[data-slot=sidebar]").first()).toHaveAttribute("data-state", "collapsed");
});

test("sur téléphone, le menu s'ouvre par-dessus la page", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Cas téléphone uniquement");
  await open(page);
  await expect(page.getByRole("button", { name: "Ventes" })).toBeHidden();
  await page.getByRole("button", { name: "Afficher ou réduire le menu" }).click();
  await expect(page.getByRole("button", { name: "Ventes" })).toBeVisible();
});

test("la liste filtre et ouvre le détail d'une vente", async ({ page }) => {
  await open(page);
  await page.getByRole("searchbox", { name: "Rechercher…" }).fill("baobab");
  await expect(page.locator("[data-slot=table] tbody tr")).toHaveCount(1);
  await page.getByText("Maquis Le Baobab").click();
  await expect(page.getByRole("dialog")).toContainText("87 500");
});
