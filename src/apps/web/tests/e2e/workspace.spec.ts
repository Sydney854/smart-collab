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
const reduced = (page: Page, key: string) => page.locator(`[data-minimized-window="${key}"]`);

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

  // Réduire (vidéo du 26/11) : la fenêtre disparaît et un petit bouton apparaît en bas à gauche
  await w.getByRole("button", { name: "Réduire Ventes" }).click();
  await expect(w).toHaveCount(0);
  await expect(tab(page, "sales")).toHaveCount(0);
  await expect(reduced(page, "sales")).toBeVisible();
  await expect(reduced(page, "sales")).toContainText("Ventes");
  const bar = (await page.getByTestId("minimized-bar").boundingBox())!;
  const vp = page.viewportSize()!;
  expect(bar.y + bar.height).toBeGreaterThan(vp.height - 4);
  const btn = (await reduced(page, "sales").boundingBox())!;
  expect(btn.x).toBeLessThan(40);
  // Restaurer par ce bouton
  await reduced(page, "sales").click();
  await expect(win(page, "sales")).toBeVisible();
  await expect(reduced(page, "sales")).toHaveCount(0);

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

test("Mosaïque : ouverture en grande fenêtre en haut à gauche, puis en cascade au premier plan", async ({ page, isMobile }) => {
  test.skip(isMobile, "Sur téléphone, les fenêtres sont en plein écran");
  await page.context().addCookies([{ name: "sc-layout", value: "mosaic", url: "http://localhost:3100" }]);
  await open(page);
  const desk = (await page.locator("main").boundingBox())!;
  await tile(page, "sales").click();
  const a = (await win(page, "sales").boundingBox())!;
  expect(a.x - desk.x).toBeLessThan(40);
  expect(a.y - desk.y).toBeLessThan(40);
  expect(a.width / desk.width).toBeGreaterThan(0.65);
  expect(a.height / desk.height).toBeGreaterThan(0.75);
  // On revient au bureau pour ouvrir une 2e fenêtre : elle se place en décalé, au-dessus
  await win(page, "sales").getByRole("button", { name: "Réduire Ventes" }).click();
  await tile(page, "stock").click();
  await reduced(page, "sales").click();
  const b = (await win(page, "stock").boundingBox())!;
  const a2 = (await win(page, "sales").boundingBox())!;
  expect(Math.abs(a2.x - a.x)).toBeLessThan(2);
  expect(b.x - a.x).toBeGreaterThan(20);
  expect(b.y - a.y).toBeGreaterThan(20);
  // Superposition : la fenêtre restaurée passe devant ; un clic sur l'autre la remet devant
  await expect(win(page, "sales")).toHaveAttribute("data-active", "true");
  // Le coin bas-droit de « Stock » dépasse de « Ventes » (décalage de cascade) : on clique dessus
  await page.mouse.click(b.x + b.width - 10, b.y + b.height - 10);
  await expect(win(page, "stock")).toHaveAttribute("data-active", "true");
  await expect(win(page, "sales")).toHaveAttribute("data-active", "false");
});

test("Mosaïque : déplacement par contour, puis la fenêtre saute au relâchement ; redimensionnement", async ({ page, isMobile }) => {
  test.skip(isMobile, "Sur téléphone, les fenêtres sont en plein écran");
  await page.context().addCookies([{ name: "sc-layout", value: "mosaic", url: "http://localhost:3100" }]);
  await open(page);
  await tile(page, "stock").click();
  const frame = win(page, "stock");
  const before = (await frame.boundingBox())!;
  const handle = frame.locator(".sc-window-handle");
  const h = (await handle.boundingBox())!;
  await page.mouse.move(h.x + 60, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(h.x + 260, h.y + 120, { steps: 8 });
  // Pendant le geste : seul le contour bouge, la fenêtre reste en place
  const outline = page.getByTestId("window-outline");
  await expect(outline).toBeVisible();
  const o = (await outline.boundingBox())!;
  expect(o.x).toBeGreaterThan(before.x + 150);
  const still = (await frame.boundingBox())!;
  expect(Math.abs(still.x - before.x)).toBeLessThan(2);
  await page.mouse.up();
  await expect(outline).toHaveCount(0);
  const moved = (await frame.boundingBox())!;
  expect(moved.x).toBeGreaterThan(before.x + 150);
  expect(moved.y).toBeGreaterThan(before.y + 80);

  // Échap pendant le geste : on annule
  const h2 = (await handle.boundingBox())!;
  await page.mouse.move(h2.x + 60, h2.y + h2.height / 2);
  await page.mouse.down();
  await page.mouse.move(h2.x + 160, h2.y + 60, { steps: 5 });
  await page.keyboard.press("Escape");
  await page.mouse.up();
  const same = (await frame.boundingBox())!;
  expect(Math.abs(same.x - moved.x)).toBeLessThan(2);

  // Redimensionner par le coin inférieur droit (visible : la fenêtre a été glissée vers le bas, on la remonte d'abord)
  const h3 = (await handle.boundingBox())!;
  await page.mouse.move(h3.x + 60, h3.y + h3.height / 2);
  await page.mouse.down();
  await page.mouse.move(h3.x - 140, h3.y - 100, { steps: 6 });
  await page.mouse.up();
  const up = (await frame.boundingBox())!;
  await page.mouse.move(up.x + up.width - 2, up.y + up.height - 2);
  await page.mouse.down();
  await page.mouse.move(up.x + up.width - 202, up.y + up.height - 102, { steps: 8 });
  await page.mouse.up();
  const resized = (await frame.boundingBox())!;
  expect(resized.width).toBeLessThan(up.width - 150);
  expect(resized.height).toBeLessThan(up.height - 60);
  // Double-clic sur la barre de titre : agrandir
  await frame.locator(".sc-window-handle").dblclick({ position: { x: 80, y: 10 } });
  await expect(frame).toHaveAttribute("data-maximized", "true");
});

test("Mosaïque : une fenêtre peut dépasser le bord du bureau sans élargir la page", async ({ page, isMobile }) => {
  test.skip(isMobile, "Sur téléphone, les fenêtres sont en plein écran");
  await page.context().addCookies([{ name: "sc-layout", value: "mosaic", url: "http://localhost:3100" }]);
  await open(page);
  await tile(page, "finance").click();
  const frame = win(page, "finance");
  const h = (await frame.locator(".sc-window-handle").boundingBox())!;
  await page.mouse.move(h.x + 60, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(h.x + 3000, h.y + 40, { steps: 10 });
  await page.mouse.up();
  const desk = (await page.locator("main").boundingBox())!;
  const r = (await frame.boundingBox())!;
  // Elle dépasse à droite…
  expect(r.x + r.width).toBeGreaterThan(desk.x + desk.width);
  // …mais un bout de sa barre de titre reste visible pour la rattraper
  expect(r.x).toBeLessThanOrEqual(desk.x + desk.width - 100);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("Mosaïque : tirer le bord haut au-dessus du bureau garde la barre de titre visible", async ({ page, isMobile }) => {
  test.skip(isMobile, "Sur téléphone, les fenêtres sont en plein écran");
  await page.context().addCookies([{ name: "sc-layout", value: "mosaic", url: "http://localhost:3100" }]);
  await open(page);
  await tile(page, "pos").click();
  const frame = win(page, "pos");
  const r = (await frame.boundingBox())!;
  await page.mouse.move(r.x + r.width / 2, r.y + 1);
  await page.mouse.down();
  await page.mouse.move(r.x + r.width / 2, r.y - 300, { steps: 8 });
  await page.mouse.up();
  const desk = (await page.locator("main").boundingBox())!;
  const handle = (await frame.locator(".sc-window-handle").boundingBox())!;
  expect(handle.y).toBeGreaterThanOrEqual(desk.y - 1);
  // La fenêtre reste déplaçable par sa barre de titre
  await page.mouse.move(handle.x + 60, handle.y + handle.height / 2);
  await page.mouse.down();
  await page.mouse.move(handle.x + 160, handle.y + 60, { steps: 6 });
  await page.mouse.up();
  const after = (await frame.boundingBox())!;
  expect(after.x).toBeGreaterThan(handle.x + 50);
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
  // Les 6 fenêtres réduites sont rangées en bas à gauche
  await expect(page.locator("[data-minimized-window]")).toHaveCount(6);
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
