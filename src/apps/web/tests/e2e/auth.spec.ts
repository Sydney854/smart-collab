import { expect, test } from "@playwright/test";

/** Écrans publics de connexion (sans Supabase : vérifie l'affichage, la validation et la sécurité par défaut). */
test("l'écran de connexion s'affiche en français et en anglais, sans lien d'inscription", async ({ page, context }) => {
  await page.goto("/connexion");
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  await expect(page.getByRole("heading", { level: 1, name: "Connexion" })).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeVisible();
  await expect(page.getByRole("link", { name: /inscri|sign up/i })).toHaveCount(0);
  await context.addCookies([{ name: "NEXT_LOCALE", value: "en", url: "http://localhost:3100" }]);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();
});

test("connexion : e-mail mal formé signalé avant envoi, bouton œil", async ({ page }) => {
  await page.goto("/connexion");
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  await page.getByLabel("E-mail").fill("pas-un-email");
  await page.getByLabel("Mot de passe", { exact: true }).fill("x");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByText("Saisissez une adresse e-mail valide.")).toBeVisible();
  const pwd = page.getByLabel("Mot de passe", { exact: true });
  await expect(pwd).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Afficher le mot de passe" }).click();
  await expect(pwd).toHaveAttribute("type", "text");
});

test("sans serveur configuré, la connexion refuse avec un message clair (jamais d'ouverture silencieuse)", async ({ page }) => {
  await page.goto("/connexion");
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  await page.getByLabel("E-mail").fill("alice@demo.test");
  await page.getByLabel("Mot de passe", { exact: true }).fill("un-mot-de-passe");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByTestId("form-error")).toContainText("configuration du serveur incomplète");
});

test("un lien d'invitation faux affiche le message unique « plus valable »", async ({ page }) => {
  await page.goto(`/invitation/${"a".repeat(64)}`);
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  await expect(page.getByTestId("form-error")).toContainText("Cette invitation n'est plus valable");
});

test("en-têtes de sécurité présents (affichage dans une autre page interdit)", async ({ request }) => {
  const res = await request.get("/connexion");
  const h = res.headers();
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["strict-transport-security"]).toContain("max-age=");
});

test("écran de connexion à 390 px : pas de débordement", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/connexion");
  await page.locator("html[data-ready=true]").waitFor({ state: "attached" });
  const [scroll, width] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  expect(scroll).toBeLessThanOrEqual(width);
});
