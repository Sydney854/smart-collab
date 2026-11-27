import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "off" },
  projects: [
    { name: "ordinateur", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "telephone", use: { ...devices["Pixel 7"] } },
  ],
  // Lance l'application construite (pnpm build doit avoir été exécuté avant)
  webServer: {
    command: `pnpm start --port ${PORT}`,
    // Démonstration sans connexion (données fictives du lot 0) ; les tests de connexion ont leur propre fichier
    env: { SC_DEMO_SANS_CONNEXION: "1", NEXT_PUBLIC_SUPABASE_URL: "", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "" },
    url: `http://localhost:${PORT}/`,
    // En intégration continue, toujours un serveur neuf ; en local, on peut réutiliser celui qui tourne
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
