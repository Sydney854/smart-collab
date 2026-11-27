import { expect, test } from "@playwright/test";

/** Écrans d'administration (lot 1, étape 3) en démonstration sans connexion : présents, et honnêtes sur l'absence de données. */
test("Paramètres mène à Collaborateurs et à Profils et droits", async ({ page, isMobile }) => {
  test.skip(isMobile, "Parcours vérifié sur ordinateur");
  await page.goto("/?ecran=settings");
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  await page.locator("[data-open=people]").click();
  await expect(page.getByRole("heading", { level: 1, name: "Collaborateurs" })).toBeVisible();
  await expect(page.getByText("Disponible une fois connecté à une entreprise.")).toBeVisible();
  await page.goto("/?ecran=settings");
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  await page.locator("[data-open=roles]").click();
  await expect(page.getByRole("heading", { level: 1, name: "Profils et droits" })).toBeVisible();
});

test("Collaborateurs et Profils et droits sont dans le menu, mais n'ont pas de tuile (ce ne sont pas des modules)", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "Menu latéral vérifié sur ordinateur");
  await page.goto("/");
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  await expect(page.getByRole("button", { name: "Collaborateurs", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Profils et droits", exact: true })).toBeVisible();
  await context.addCookies([{ name: "sc-layout", value: "mosaic", url: "http://localhost:3100" }]);
  await page.reload();
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  await expect(page.locator("[data-tile=people]")).toHaveCount(0);
  await expect(page.locator("[data-tile=roles]")).toHaveCount(0);
});
