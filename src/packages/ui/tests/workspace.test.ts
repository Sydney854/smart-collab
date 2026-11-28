import { describe, expect, it } from "vitest";
import { CASCADE_STEP, MAX_OPEN, MIN_VISIBLE, canOpen, cascadeRect, clampRect, initialWorkspace, workspaceReducer } from "../src/components/workspace/state";

const desk = { w: 1200, h: 800 };
const openAll = (keys: string[], mode: "list" | "mosaic" = "mosaic") =>
  keys.reduce((s, key) => workspaceReducer(s, { type: "open", key, desk }), initialWorkspace(mode, null));

describe("cadre à 2 modes", () => {
  it("6 écrans ouverts au maximum ; rouvrir un écran déjà ouvert reste possible", () => {
    const s = openAll(["a", "b", "c", "d", "e", "f"]);
    expect(s.open).toHaveLength(MAX_OPEN);
    expect(canOpen(s, "g")).toBe(false);
    expect(workspaceReducer(s, { type: "open", key: "g", desk })).toBe(s);
    expect(canOpen(s, "c")).toBe(true);
    expect(workspaceReducer(s, { type: "open", key: "c", desk }).current).toBe("c");
  });

  it("réduire une fenêtre la garde dans la liste ; la rouvrir la met au premier plan", () => {
    let s = openAll(["a", "b"]);
    s = workspaceReducer(s, { type: "minimize", key: "b" });
    expect(s.open.find((o) => o.key === "b")?.minimized).toBe(true);
    expect(s.current).toBe("a");
    s = workspaceReducer(s, { type: "focus", key: "b" });
    expect(s.open.find((o) => o.key === "b")?.minimized).toBe(false);
    expect(s.current).toBe("b");
  });

  it("passer en Mosaïque : tous les écrans ouverts se replient dans la barre du bas (décision du 28/11)", () => {
    let s = openAll(["a", "b", "c"], "list");
    s = workspaceReducer(s, { type: "focus", key: "b" });
    s = workspaceReducer(s, { type: "setMode", mode: "mosaic", desk, fallback: "a" });
    expect(s.mode).toBe("mosaic");
    expect(s.open.every((o) => o.minimized)).toBe(true);
    expect(s.current).toBeNull();
    s = workspaceReducer(s, { type: "focus", key: "b" });
    s = workspaceReducer(s, { type: "setMode", mode: "list", desk, fallback: "a" });
    expect(s.mode).toBe("list");
    expect(s.current).toBe("b");
    expect(s.open).toHaveLength(3);
  });

  it("en mode Liste, fermer le dernier onglet rouvre l'écran par défaut", () => {
    const s = workspaceReducer(initialWorkspace("list", "x"), { type: "close", key: "x", fallback: "dashboard" });
    expect(s.open.map((o) => o.key)).toEqual(["dashboard"]);
  });

  it("en Mosaïque, on peut tout fermer (il reste les tuiles)", () => {
    const s = workspaceReducer(openAll(["a"]), { type: "close", key: "a", fallback: "dashboard" });
    expect(s.open).toHaveLength(0);
    expect(s.current).toBeNull();
  });

  it("ouverture (vidéo du 26/11) : grande fenêtre 70 % × 80 % en haut à gauche, puis en cascade", () => {
    const first = cascadeRect(0, desk);
    expect(first.w).toBe(Math.round(desk.w * 0.7));
    expect(first.h).toBe(Math.round(desk.h * 0.8));
    expect(first.x).toBeLessThan(40);
    expect(first.y).toBeLessThan(40);
    const second = cascadeRect(1, desk);
    expect(second.x - first.x).toBe(CASCADE_STEP.x);
    expect(second.y - first.y).toBe(CASCADE_STEP.y);
  });

  it("superposition : une fenêtre peut dépasser les bords, mais sa barre de titre reste attrapable", () => {
    // Glissée très loin à droite et en bas
    const far = clampRect({ x: 5000, y: 5000, w: 600, h: 400 }, desk);
    expect(far.x).toBe(desk.w - MIN_VISIBLE.x);
    expect(far.y).toBe(desk.h - MIN_VISIBLE.y);
    // Dépasser à droite est permis
    const over = clampRect({ x: 900, y: 100, w: 600, h: 400 }, desk);
    expect(over.x + over.w).toBeGreaterThan(desk.w);
    // Trop à gauche ou au-dessus : ramenée pour garder la barre de titre visible
    const left = clampRect({ x: -5000, y: -50, w: 600, h: 400 }, desk);
    expect(left.x + left.w).toBe(MIN_VISIBLE.x);
    expect(left.y).toBe(0);
  });

  it("les nouvelles fenêtres s'ouvrent toujours attrapables, même sur un petit bureau", () => {
    for (let i = 0; i < MAX_OPEN; i++) {
      const r = cascadeRect(i, { w: 500, h: 400 });
      expect(r.x).toBeLessThanOrEqual(500 - MIN_VISIBLE.x);
      expect(r.y).toBeLessThanOrEqual(400 - MIN_VISIBLE.y);
    }
  });
});
