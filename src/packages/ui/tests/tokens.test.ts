import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ACCENT_PRESETS, COLOR_TOKENS, SHADCN_MAPPING, colors, cssVariables, resolveColors } from "../src/tokens";

describe("jetons de design", () => {
  const doc = readFileSync(new URL("../../../../05_UI_UX/DESIGN_TOKENS.md", import.meta.url), "utf8");
  const darkStart = doc.indexOf("### Thème sombre");
  const darkEnd = doc.indexOf("###", darkStart + 5);

  /** Lignes « | `--nav-1` / `--nav-2` | `#…` / `#…` | » → { nom: valeur } (1re colonne de valeurs). */
  function table(text: string) {
    const out: Record<string, string> = {};
    for (const [, names, values] of text.matchAll(/^\|\s*(`--[^|]+)\|\s*(`#[^|]+)\|/gm)) {
      const n = [...names.matchAll(/`--([\w-]+)`/g)].map((m) => m[1]);
      const v = [...values.matchAll(/`(#[0-9a-f]{6})`/gi)].map((m) => m[1].toLowerCase());
      n.forEach((name, i) => (out[name] = v[i]));
    }
    return out;
  }

  it("reprennent les valeurs de DESIGN_TOKENS.md pour le thème clair", () => {
    const light = table(doc.slice(0, darkStart));
    expect(Object.keys(light).length).toBeGreaterThan(20);
    for (const [name, value] of Object.entries(light)) expect(colors.light[name as keyof typeof colors.light], name).toBe(value);
  });

  it("reprennent les valeurs de DESIGN_TOKENS.md pour le thème sombre", () => {
    const dark = table(doc.slice(darkStart, darkEnd));
    expect(Object.keys(dark).length).toBeGreaterThan(20);
    for (const [name, value] of Object.entries(dark)) expect(colors.dark[name as keyof typeof colors.dark], name).toBe(value);
  });

  it("le thème sombre définit les mêmes jetons que le thème clair", () => {
    expect(Object.keys(colors.dark).sort()).toEqual([...COLOR_TOKENS].sort());
    expect(Object.keys(colors.light).sort()).toEqual([...COLOR_TOKENS].sort());
  });

  it("génère une variable CSS par jeton, en clair et en sombre", () => {
    const css = cssVariables();
    for (const token of COLOR_TOKENS) expect(css.match(new RegExp(`--sc-${token}:`, "g"))?.length, token).toBe(2);
    expect(css).toContain(':root[data-theme="dark"]');
  });

  it("chaque nom shadcn/ui pointe vers un de nos jetons", () => {
    const css = cssVariables();
    for (const [name, token] of Object.entries(SHADCN_MAPPING)) {
      expect(COLOR_TOKENS, name).toContain(token);
      expect(css, name).toContain(`--${name}: var(--sc-${token});`);
    }
    // Couleur principale = l'or, texte discret = jeton « muted » du prototype
    expect(SHADCN_MAPPING.primary).toBe("accent");
    expect(SHADCN_MAPPING["muted-foreground"]).toBe("muted");
    expect(SHADCN_MAPPING.sidebar).toBe("nav-1");
  });

  it("chaque couleur Tailwind de styles.css pointe vers une variable définie", () => {
    const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
    const defined = new Set(cssVariables().match(/--[\w-]+(?=:)/g));
    const refs = [...css.matchAll(/--color-[\w-]+:\s*var\((--[\w-]+)\)/g)].map((m) => m[1]);
    expect(refs.length).toBeGreaterThan(40);
    for (const ref of refs) expect(defined.has(ref), ref).toBe(true);
    // Tous les noms shadcn sont exposés à Tailwind
    for (const name of Object.keys(SHADCN_MAPPING)) expect(refs, name).toContain(`--${name}`);
  });

  it("la couleur principale choisie remplace l'or partout", () => {
    expect(resolveColors("light", "blue").accent).toBe(ACCENT_PRESETS.blue.accent);
    expect(cssVariables("blue")).toContain(`--sc-accent: ${ACCENT_PRESETS.blue.accent}`);
    expect(cssVariables("blue")).toContain("--primary: var(--sc-accent)");
  });
});
