import { describe, expect, it } from "vitest";
import { ICON_SIZES, ICON_STYLES, isIconSize, isIconStyle, isWizardLayout, readAppearance } from "../src/icon-settings";
import { MODULE_ICONS, type ModuleIconDef, paintFor } from "../src/components/ModuleIcon";
import { MODULE_PALETTE } from "../src/tokens";

const defs = Object.entries(MODULE_ICONS) as [string, ModuleIconDef][];
const isColor = (v?: string) => typeof v === "string" && (/^#[0-9a-f]{6}$/.test(v) || /^url\(#.+\)$/.test(v));

describe("icônes illustrées des modules", () => {
  it("chaque module a une couleur et un trio pris dans la palette", () => {
    for (const [key, def] of defs) {
      expect(MODULE_PALETTE, key).toHaveProperty(def.color);
      for (const c of def.trio) expect(MODULE_PALETTE, key).toHaveProperty(c);
      expect(def.shapes.length, key).toBeGreaterThan(2);
    }
  });

  it("un seul dessin, six rendus : chaque style donne une couleur à chaque forme, en clair et en sombre", () => {
    for (const [key, def] of defs)
      for (const style of ICON_STYLES)
        for (const mode of ["light", "dark"] as const)
          def.shapes.forEach(([, attrs, role], i) => {
            const line = (attrs as { stroke?: string }).stroke === "line";
            const paint = paintFor(def, role, style, mode, line, "g", []);
            if (style === "trait" && role === "w") return expect(paint).toBeNull();
            const where = `${key}/${style}/${mode}/forme ${i}`;
            expect(paint, where).not.toBeNull();
            if (style === "trait") return expect(paint?.style?.stroke, where).toBe("var(--sc-accent-strong)");
            expect(isColor(paint?.fill === "none" ? paint?.stroke : paint?.fill), where).toBe(true);
          });
  });

  it("le bleu marine est éclairci en thème sombre (style bicolore)", () => {
    const def = MODULE_ICONS.dashboard as ModuleIconDef;
    expect(paintFor(def, "s", "bi", "dark", false, "g", [])?.fill).not.toBe(paintFor(def, "s", "bi", "light", false, "g", [])?.fill);
  });

  it("les réglages d'apparence n'acceptent que les valeurs prévues", () => {
    expect(isIconStyle("multi")).toBe(true);
    expect(isIconSize("xl")).toBe(true);
    expect(isWizardLayout("2")).toBe(true);
    for (const bad of ["3", "toString", "__proto__", "", "neon"]) {
      expect(isIconStyle(bad), bad).toBe(false);
      expect(isIconSize(bad), bad).toBe(false);
      expect(isWizardLayout(bad), bad).toBe(false);
    }
    expect(readAppearance(() => "toString")).toEqual({ iconStyle: "multi", iconSize: "l", wizardLayout: "1", barPosition: "bottom" });
    expect(ICON_SIZES.l).toEqual([72, 52]);
  });
});
