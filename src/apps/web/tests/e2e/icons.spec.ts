import { type Page, expect, test } from "@playwright/test";

/** Icônes des modules, Paramètres → Apparence, App Store, assistant (05_UI_UX/ICONES_MODULES.md). */

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

async function open(page: Page, path = "/", cookies: Record<string, string> = {}) {
  await page.context().addCookies(Object.entries(cookies).map(([name, value]) => ({ name, value, url: "http://localhost:3100" })));
  await page.goto(path);
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
}

test("mosaïque : cadre autour de l'icône seule, nom dessous, sans description, style B par défaut", async ({ page }) => {
  await open(page, "/", { "sc-layout": "mosaic" });
  const tile = page.locator("[data-tile=sales]");
  await expect(tile.locator("[data-slot=tile-frame] svg[data-module=sales]")).toHaveAttribute("data-icon-style", "multi");
  await expect(tile).toHaveText("Ventes");
  const frame = (await tile.locator("[data-slot=tile-frame]").boundingBox())!;
  const name = (await tile.getByText("Ventes").boundingBox())!;
  expect(name.y).toBeGreaterThan(frame.y + frame.height - 1);
});

test("Paramètres → Apparence : le style choisi s'applique aux tuiles et reste après rechargement", async ({ page }) => {
  await open(page, "/?ecran=settings");
  await page.getByTestId("setting-style").getByRole("radio", { name: /E · Pastille couleur/ }).click();
  await expect(page.getByTestId("setting-style").getByRole("radio", { name: /E · Pastille couleur/ })).toHaveAttribute("aria-checked", "true");
  await page.context().addCookies([{ name: "sc-layout", value: "mosaic", url: "http://localhost:3100" }]);
  await page.goto("/");
  await expect(page.locator("[data-tile=stock] svg[data-module=stock]")).toHaveAttribute("data-icon-style", "pill");
});

test("Paramètres → Apparence : la taille change les tuiles ; sur téléphone elle reste Moyenne", async ({ page, isMobile }) => {
  await open(page, "/?ecran=settings");
  await page.getByTestId("setting-size").getByRole("radio", { name: /Très grande/ }).click();
  await page.context().addCookies([{ name: "sc-layout", value: "mosaic", url: "http://localhost:3100" }]);
  await page.goto("/");
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  const icon = (await page.locator("[data-tile=dashboard] svg[data-module]").boundingBox())!;
  // Très grande = 88 px ; ramenée à Moyenne (56 px) sous 560 px de large
  expect(Math.round(icon.width)).toBe(isMobile ? 56 : 88);
});

test("un réglage hors liste est ignoré", async ({ page }) => {
  await open(page, "/", { "sc-layout": "mosaic", "sc-icon-style": "toString", "sc-icon-size": "énorme" });
  await expect(page.locator("[data-tile=sales] svg[data-module=sales]")).toHaveAttribute("data-icon-style", "multi");
});

test("App Store : statuts Toujours actif, Installée, Installer", async ({ page }) => {
  await open(page, "/?ecran=apps");
  await expect(page.locator("[data-app=dashboard]")).toContainText("Toujours actif");
  await expect(page.locator("[data-app=sales]")).toContainText("Installée");
  const payroll = page.locator("[data-app=hr-payroll]");
  await expect(payroll).toContainText("RH & Paie · à venir");
  await payroll.getByRole("button", { name: "Installer" }).click();
  await expect(payroll.locator("[data-status=installed]")).toBeVisible();
});

test("assistant, proposition 1 : cocher au clic et au clavier, socle non modifiable", async ({ page }) => {
  await open(page, "/?ecran=setup");
  const count = page.getByTestId("wizard-count");
  await expect(count).toHaveText("5 modules choisis");
  const finance = page.locator("[data-module=finance][role=checkbox]");
  await expect(finance).toHaveAttribute("aria-checked", "false");
  await finance.click();
  await expect(finance).toHaveAttribute("aria-checked", "true");
  await expect(count).toHaveText("6 modules choisis");
  await finance.focus();
  await page.keyboard.press("Space");
  await expect(finance).toHaveAttribute("aria-checked", "false");
  // Socle : pas une case à cocher, toujours actif
  await expect(page.locator("[data-module=dashboard][role=checkbox]")).toHaveCount(0);
  await expect(page.locator("div[data-module=dashboard]")).toContainText("Toujours actif");
});

test("assistant, proposition 2 : cartes et récapitulatif « Votre sélection »", async ({ page }) => {
  await open(page, "/?ecran=setup", { "sc-wizard": "2" });
  const recap = page.getByRole("complementary", { name: "Votre sélection" });
  await expect(recap).toContainText("5");
  await page.locator("[data-module=purchases][role=checkbox]").click();
  await expect(recap).toContainText("Achats");
  await expect(page.getByTestId("wizard-count")).toHaveText("6 modules choisis");
});

test("assistant à 390 px : la page tient dans la largeur, dans les deux propositions", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const layout of ["1", "2"]) {
    await open(page, "/?ecran=setup", { "sc-wizard": layout });
    const [scroll, width] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    expect(scroll, `proposition ${layout}`).toBeLessThanOrEqual(width);
  }
});

test("écrans de l'étape à 390 px, en anglais et en sombre : sans erreur, sans débordement, sans texte français", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(m.text()));
  await page.setViewportSize({ width: 390, height: 844 });
  const base = { NEXT_LOCALE: "en", "sc-theme": "dark" };
  const pages: [string, Record<string, string>][] = [
    ["/", { ...base, "sc-layout": "mosaic" }],
    ["/?ecran=settings", base],
    ["/?ecran=apps", base],
    ["/?ecran=setup", { ...base, "sc-wizard": "1" }],
    ["/?ecran=setup", { ...base, "sc-wizard": "2" }],
  ];
  for (const [path, cookies] of pages) {
    await open(page, path, cookies);
    const [scroll, width] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    expect(scroll, path).toBeLessThanOrEqual(width);
    const text = await page.locator("main").innerText();
    for (const fr of ["Toujours actif", "Votre sélection", "Installer", "Choisissez", "Paramètres"]) expect(text, `${path} : ${fr}`).not.toContain(fr);
  }
  // Proposition 2 sur téléphone : le récapitulatif passe sous la liste
  const recap = (await page.getByRole("complementary", { name: "Your selection" }).boundingBox())!;
  const firstCard = (await page.locator("[data-module=sales]").first().boundingBox())!;
  expect(recap.y).toBeGreaterThan(firstCard.y);
  expect(errors).toEqual([]);
});
