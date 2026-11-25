import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Liste de contrôle du lot 0 : « Aucune couleur codée en dur hors des jetons ».
 * Seul packages/ui/src/tokens.ts a le droit de contenir des couleurs.
 */
const SRC = join(import.meta.dirname, "../../../..");
const ROOTS = ["apps/web/app", "apps/web/components", "apps/web/lib", "packages/ui/src"];
const ALLOWED = new Set(["packages/ui/src/tokens.ts"]);
const COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|hwb)\(/;
// Couleurs Tailwind par défaut (bg-red-500, text-white…) : interdites aussi
const TAILWIND_DEFAULT = /\b(?:bg|text|border|ring|fill|stroke|from|to|via|outline|shadow)-(?:white|black|slate|gray|zinc|neutral|stone|orange|yellow|lime|emerald|cyan|sky|indigo|violet|fuchsia|pink|rose|(?:red|amber|green|blue|purple|teal)-\d{2,3})\b/;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(tsx?|css)$/.test(name) ? [path] : [];
  });
}

describe("couleurs", () => {
  const all = ROOTS.flatMap((r) => files(join(SRC, r)));

  it("trouve bien les fichiers à contrôler", () => {
    expect(all.length).toBeGreaterThan(15);
  });

  it("aucune couleur n'est écrite en dur en dehors de tokens.ts", () => {
    const offenders: string[] = [];
    for (const file of all) {
      const rel = relative(SRC, file);
      if (ALLOWED.has(rel)) continue;
      readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (COLOR.test(line) || TAILWIND_DEFAULT.test(line)) offenders.push(`${rel}:${i + 1}  ${line.trim()}`);
        });
    }
    expect(offenders).toEqual([]);
  });
});
