import { type Page, expect, test } from "@playwright/test";

// Barre du haut, recherche, calendrier global, notifications et profil (maquette validée le 28/11/2026)

async function open(page: Page, layout: "list" | "mosaic" = "list") {
  await page.context().addCookies([{ name: "sc-layout", value: layout, url: "http://localhost:3100" }]);
  await page.goto("/");
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
}

test("barre du haut : réseau, recherche, langue, nuit / jour, cloche, puis le profil", async ({ page }) => {
  await open(page);
  const bar = page.getByTestId("top-bar");
  const names = ["En ligne", "Rechercher", "Langue : Français", "Passer en thème sombre", "Notifications", "Menu utilisateur"];
  const xs: number[] = [];
  for (const n of names) {
    const el = n === "En ligne" ? bar.getByRole("status") : bar.getByRole("button", { name: n, exact: n !== "Notifications" });
    const box = (await el.first().boundingBox())!;
    xs.push(box.x);
  }
  expect([...xs].sort((a, b) => a - b)).toEqual(xs);
  // Plus de fil « entreprise › écran » ; Liste / Mosaïque est à gauche
  await expect(bar.getByRole("navigation", { name: /breadcrumb/i })).toHaveCount(0);
  const mode = (await bar.getByRole("radio", { name: "Mode Liste" }).boundingBox())!;
  expect(mode.x).toBeLessThan(xs[0]!);
  // Taille B : boutons de 32 px
  const search = (await bar.getByRole("button", { name: "Rechercher" }).boundingBox())!;
  expect(Math.round(search.width)).toBe(32);
});

test("recherche : loupe ou Ctrl + K, filtres des modules installés, action rapide, recherches récentes", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Rechercher" }).click();
  const dlg = page.getByTestId("search-dialog");
  await expect(dlg).toBeVisible();
  await expect(dlg.getByRole("group", { name: "Je recherche" }).getByRole("button", { name: "Ventes" })).toBeVisible();
  // Pas de filtre pour le Tableau de bord ni pour les Paramètres (ce ne sont pas des modules)
  await expect(dlg.getByRole("group", { name: "Je recherche" }).getByRole("button", { name: "Paramètres" })).toHaveCount(0);
  // Action rapide : Paramètres ouvre l'écran
  await dlg.getByRole("option", { name: "Paramètres" }).click();
  await expect(dlg).toHaveCount(0);
  await expect(page.locator('[data-screen="settings"]')).toBeVisible();

  // Ctrl + K, recherche limitée à un module, puis retenue dans « Recherches récentes »
  await page.keyboard.press("Control+k");
  await expect(dlg).toBeVisible();
  await dlg.getByRole("button", { name: "Stock" }).click();
  await dlg.getByRole("combobox").fill("riz parfumé");
  await expect(dlg.getByRole("option", { name: "Rechercher « riz parfumé » dans Stock" })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(dlg).toHaveCount(0);
  await page.keyboard.press("Control+k");
  await expect(dlg.getByRole("group", { name: "Recherches récentes" }).getByRole("option", { name: "riz parfumé" })).toBeVisible();
  // Un mot trouve un écran, sans accents ni majuscules ; flèches + Entrée
  await dlg.getByRole("combobox").fill("parametres");
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-screen="settings"]')).toBeVisible();
});

test("calendrier global : un raccourci change toute la page et reste retenu", async ({ page }) => {
  await open(page);
  const btn = page.getByTestId("range-button");
  await expect(btn).toBeVisible();
  const revenue = page.getByTestId("kpis").locator("> *").first();
  const before = await revenue.innerText();
  await btn.click();
  const panel = page.getByTestId("range-panel");
  await expect(panel.getByRole("radio", { name: "Ce mois-ci" })).toHaveAttribute("aria-checked", "true");
  await panel.getByRole("radio", { name: "Cette année" }).click();
  // Annuler ne change rien
  await panel.getByRole("button", { name: "Annuler" }).click();
  expect(await revenue.innerText()).toBe(before);
  await btn.click();
  await page.getByTestId("range-panel").getByRole("radio", { name: "Cette année" }).click();
  await page.getByTestId("range-panel").getByRole("button", { name: "Appliquer" }).click();
  await expect(revenue).not.toHaveText(before);
  const label = await btn.innerText();
  expect(label).toMatch(/01 janv\. \d{4}/);
  await page.reload();
  await expect(page.getByTestId("range-button")).toHaveText(label);
});

test("notifications : panneau avec « Uniquement non lu », vide quand il n'y a rien de réel", async ({ page }) => {
  await open(page);
  await page.getByTestId("notifications-button").click();
  const panel = page.getByTestId("notifications-panel");
  await expect(panel.getByRole("heading", { name: "Notifications" })).toBeVisible();
  await expect(panel.getByRole("switch", { name: "Uniquement non lu" })).toBeVisible();
  // Démonstration sans base : aucune notification inventée
  await expect(panel.getByTestId("notifications-empty")).toHaveText("Aucune notification");
  await expect(page.getByTestId("notifications-dot")).toHaveCount(0);
  await panel.getByRole("button", { name: "Fermer les notifications" }).click();
  await expect(panel).toHaveCount(0);
});

test("profil : Paramètres (ouvre l'écran), Couleur principale, Déconnexion ; pas de « Mon profil » avant son écran", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Menu utilisateur" }).click();
  for (const n of ["Paramètres", "Couleur principale"]) await expect(page.getByRole("menuitem", { name: n })).toBeVisible();
  // Démonstration sans connexion : pas de « Se déconnecter » (bouton qui ne ferait rien)
  await expect(page.getByRole("menuitem", { name: "Se déconnecter" })).toHaveCount(0);
  await expect(page.getByRole("menuitem", { name: "Mon profil" })).toHaveCount(0);
  await page.getByRole("menuitem", { name: "Paramètres" }).click();
  await expect(page.locator('[data-screen="settings"]')).toBeVisible();
});

test("Mosaïque : Liste / Mosaïque en premier, puis l'entreprise et ses « ··· »", async ({ page, isMobile }) => {
  await open(page, "mosaic");
  const bar = page.getByTestId("top-bar");
  const mode = (await bar.getByRole("radio", { name: "Mode Mosaïque" }).boundingBox())!;
  const company = bar.getByRole("button", { name: /^Entreprise : / });
  const c = (await company.boundingBox())!;
  expect(mode.x).toBeLessThan(c.x);
  if (!isMobile) await expect(company).toContainText("Boutique Démo Cocody");
  await company.click();
  await expect(page.getByRole("menu")).toContainText("Commerce");
});

test("barre du haut à 390 px, en anglais et en sombre : panneaux sans erreur, sans débordement, sans texte français", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(m.text()));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.context().addCookies(
    [
      ["sc-layout", "list"],
      ["sc-theme", "dark"],
      ["NEXT_LOCALE", "en"],
    ].map(([name, value]) => ({ name, value, url: "http://localhost:3100" })),
  );
  await page.goto("/");
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  const fits = async (what: string) => {
    const scroll = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scroll, what).toBeLessThanOrEqual(390);
  };
  const noFrench = async (what: string, loc: ReturnType<Page["locator"]>) => {
    const text = await loc.innerText();
    for (const fr of ["Recherche", "Actions rapides", "Notifications non", "Aucune", "Appliquer", "Annuler", "Paramètres", "Couleur"]) expect(text, `${what} : ${fr}`).not.toContain(fr);
  };
  await fits("barre");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByTestId("search-dialog")).toBeVisible();
  await noFrench("recherche", page.getByTestId("search-dialog"));
  await fits("recherche");
  await page.keyboard.press("Escape");
  await page.getByTestId("notifications-button").click();
  await expect(page.getByTestId("notifications-panel")).toContainText("No notifications");
  await noFrench("notifications", page.getByTestId("notifications-panel"));
  await fits("notifications");
  await page.keyboard.press("Escape");
  await page.getByTestId("range-button").click();
  await expect(page.getByTestId("range-panel")).toBeVisible();
  await noFrench("calendrier", page.getByTestId("range-panel"));
  const panel = (await page.getByTestId("range-panel").boundingBox())!;
  expect(panel.x).toBeGreaterThanOrEqual(0);
  expect(panel.x + panel.width).toBeLessThanOrEqual(390);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "User menu" }).click();
  await noFrench("profil", page.getByRole("menu"));
  expect(errors).toEqual([]);
});
