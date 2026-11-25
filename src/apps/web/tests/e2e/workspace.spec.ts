import { type Page, expect, test } from "@playwright/test";

/** Coquille à 2 modes (décision du 25/11/2026) : Liste et Mosaïque. */

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

async function open(page: Page, path = "/") {
  await page.goto(path);
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
}

const win = (page: Page, key: string) => page.locator(`[data-window="${key}"]`);
const tile = (page: Page, key: string) => page.locator(`[data-tile="${key}"]`);
const tab = (page: Page, key: string) => page.locator(`[data-tab="${key}"]`);

test("mode Liste : ouvrir un module garde les onglets et met à jour l'adresse, sans recharger", async ({ page, isMobile }) => {
  await open(page);
  await page.evaluate(() => ((window as unknown as { marker: number }).marker = 42));
  if (isMobile) await page.getByRole("button", { name: "Afficher ou réduire le menu" }).click();
  await page.getByRole("button", { name: "Composants (démo)" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Composants Smart Collab" })).toBeVisible();
  await expect(page).toHaveURL(/ecran=components/);
  await expect(tab(page, "dashboard")).toBeVisible();
  await expect(tab(page, "components")).toHaveAttribute("data-active", "true");
  // Même page : rien n'a été rechargé
  expect(await page.evaluate(() => (window as unknown as { marker?: number }).marker)).toBe(42);
  // Retour au tableau de bord par l'onglet
  await tab(page, "dashboard").getByRole("button", { name: "Tableau de bord", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Tableau de bord" })).toBeVisible();
});

test("mode Liste : une saisie est conservée quand on change d'onglet", async ({ page, isMobile }) => {
  await open(page, "/?ecran=components");
  await page.locator("#field-reference").fill("PRD-9999");
  if (isMobile) await page.getByRole("button", { name: "Afficher ou réduire le menu" }).click();
  await page.getByRole("button", { name: "Tableau de bord" }).first().click();
  await expect(page.getByRole("heading", { level: 1, name: "Tableau de bord" })).toBeVisible();
  await tab(page, "components").getByRole("button", { name: "Composants (démo)", exact: true }).click();
  await expect(page.locator("#field-reference")).toHaveValue("PRD-9999");
});

test("le bouton de l'en-tête bascule en Mosaïque, et le choix est retenu", async ({ page }) => {
  await open(page);
  await page.getByRole("radio", { name: "Mode Mosaïque" }).click();
  await expect(page.locator("[data-layout=mosaic]")).toBeVisible();
  await expect(tile(page, "sales")).toBeVisible();
  // L'écran affiché en Liste devient la fenêtre au premier plan
  await expect(win(page, "dashboard")).toBeVisible();
  await page.reload();
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  await expect(page.locator("[data-layout=mosaic]")).toBeVisible();
  await win(page, "dashboard").getByRole("button", { name: /^Réduire/ }).click();
  await page.getByRole("radio", { name: "Mode Liste" }).click();
  await expect(page.locator("[data-layout=list]")).toBeAttached();
});

test("Mosaïque : une tuile ouvre une fenêtre qu'on réduit, restaure, agrandit et ferme", async ({ page, isMobile }) => {
  await page.context().addCookies([{ name: "sc-layout", value: "mosaic", url: "http://localhost:3100" }]);
  await open(page);
  await tile(page, "sales").click();
  const w = win(page, "sales");
  await expect(w).toBeVisible();
  // Numéro de lot tiré de 13_PLAN_LOTS.md (Ventes : devis, factures, avoirs = lot 5)
  await expect(w).toContainText(/Cet écran sera construit au lot \d+/);
  await expect(w).toContainText("lot 5");

  // Réduire : la fenêtre disparaît et reste dans la barre d'onglets
  await w.getByRole("button", { name: "Réduire Ventes" }).click();
  await expect(w).toHaveCount(0);
  await expect(tab(page, "sales")).toHaveAttribute("data-minimized", "true");
  // Restaurer par l'onglet
  await tab(page, "sales").getByRole("button", { name: "Ventes", exact: true }).click();
  await expect(win(page, "sales")).toBeVisible();

  if (!isMobile) {
    // Agrandir puis restaurer
    await win(page, "sales").getByRole("button", { name: "Agrandir Ventes" }).click();
    await expect(win(page, "sales")).toHaveAttribute("data-maximized", "true");
    await win(page, "sales").getByRole("button", { name: "Restaurer Ventes" }).click();
    await expect(win(page, "sales")).toHaveAttribute("data-maximized", "false");
  }
  await win(page, "sales").getByRole("button", { name: "Fermer Ventes" }).click();
  await expect(win(page, "sales")).toHaveCount(0);
  await expect(tab(page, "sales")).toHaveCount(0);
});

test("Mosaïque : on déplace et redimensionne une fenêtre", async ({ page, isMobile }) => {
  test.skip(isMobile, "Sur téléphone, les fenêtres sont en plein écran");
  await page.context().addCookies([{ name: "sc-layout", value: "mosaic", url: "http://localhost:3100" }]);
  await open(page);
  await tile(page, "stock").click();
  const frame = win(page, "stock");
  const before = (await frame.boundingBox())!;
  // Déplacer par la barre de titre
  const handle = frame.locator(".sc-window-handle");
  const h = (await handle.boundingBox())!;
  await page.mouse.move(h.x + 60, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(h.x + 260, h.y + 120, { steps: 8 });
  await page.mouse.up();
  const moved = (await frame.boundingBox())!;
  expect(moved.x).toBeGreaterThan(before.x + 150);
  expect(moved.y).toBeGreaterThan(before.y + 80);
  // Redimensionner par le coin inférieur droit
  await page.mouse.move(moved.x + moved.width - 2, moved.y + moved.height - 2);
  await page.mouse.down();
  await page.mouse.move(moved.x + moved.width - 202, moved.y + moved.height - 102, { steps: 8 });
  await page.mouse.up();
  const resized = (await frame.boundingBox())!;
  expect(resized.width).toBeLessThan(moved.width - 150);
  expect(resized.height).toBeLessThan(moved.height - 60);
  // Double-clic sur la barre de titre : agrandir
  await frame.locator(".sc-window-handle").dblclick({ position: { x: 80, y: 10 } });
  await expect(frame).toHaveAttribute("data-maximized", "true");
});

test("Mosaïque : 6 fenêtres au maximum", async ({ page }) => {
  await page.context().addCookies([{ name: "sc-layout", value: "mosaic", url: "http://localhost:3100" }]);
  await open(page);
  for (const key of ["dashboard", "sales", "stock", "purchases", "pos", "finance"]) {
    await tile(page, key).click();
    await expect(win(page, key)).toBeVisible();
    // La fenêtre recouvre les tuiles : on la réduit pour revenir au bureau
    await win(page, key).getByRole("button", { name: /^Réduire/ }).click();
  }
  await expect(page.locator("[data-tab]")).toHaveCount(6);
  await tile(page, "apps").click();
  await expect(page.getByText("6 écrans ouverts au maximum")).toBeVisible();
  await expect(win(page, "apps")).toHaveCount(0);
});

test("Mosaïque sur téléphone : la fenêtre s'ouvre en plein écran", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Cas téléphone uniquement");
  await page.context().addCookies([{ name: "sc-layout", value: "mosaic", url: "http://localhost:3100" }]);
  await open(page);
  await tile(page, "dashboard").click();
  const box = (await win(page, "dashboard").boundingBox())!;
  const vp = page.viewportSize()!;
  expect(box.width).toBeGreaterThanOrEqual(vp.width - 1);
  expect(box.height).toBeGreaterThanOrEqual(vp.height - 1);
  await expect(win(page, "dashboard").getByRole("button", { name: /^Agrandir/ })).toHaveCount(0);
});

test("le même écran s'affiche en page et en fenêtre", async ({ page, isMobile }) => {
  test.skip(isMobile, "Vérifié sur ordinateur");
  await open(page, "/?ecran=components");
  await expect(page.locator("[data-screen=components] #field-name")).toHaveValue("Riz parfumé 5 kg");
  await page.getByRole("radio", { name: "Mode Mosaïque" }).click();
  await expect(win(page, "components").locator("#field-name")).toHaveValue("Riz parfumé 5 kg");
  await expect(win(page, "components").getByTestId("section-list")).toBeVisible();
});

test("Mosaïque : la page tient dans la largeur de l'écran", async ({ page }) => {
  await page.context().addCookies([{ name: "sc-layout", value: "mosaic", url: "http://localhost:3100" }]);
  await open(page);
  const [scroll, width] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  expect(scroll).toBeLessThanOrEqual(width);
});

test("Mosaïque à 390 px, en anglais et en sombre : fenêtre plein écran, sans erreur ni débordement", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(m.text()));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.context().addCookies(
    [
      ["sc-layout", "mosaic"],
      ["sc-theme", "dark"],
      ["NEXT_LOCALE", "en"],
    ].map(([name, value]) => ({ name, value, url: "http://localhost:3100" })),
  );
  await open(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await tile(page, "components").click();
  const w = win(page, "components");
  await expect(w.getByRole("heading", { level: 1, name: "Smart Collab components" })).toBeVisible();
  const box = (await w.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(389);
  const [scroll, width] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  expect(scroll).toBeLessThanOrEqual(width);
  expect(errors).toEqual([]);
});
