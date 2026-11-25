import { describe, expect, it } from "vitest";
import { MAX_OPEN, canOpen, cascadeRect, initialWorkspace, workspaceReducer } from "../src/components/workspace/state";

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

  it("passer en Mosaïque : l'écran affiché devient la fenêtre active, les autres sont réduits", () => {
    let s = openAll(["a", "b", "c"], "list");
    s = workspaceReducer(s, { type: "focus", key: "b" });
    s = workspaceReducer(s, { type: "setMode", mode: "mosaic", desk, fallback: "a" });
    expect(s.mode).toBe("mosaic");
    expect(s.open.filter((o) => !o.minimized).map((o) => o.key)).toEqual(["b"]);
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

  it("les nouvelles fenêtres restent dans le bureau, même petit", () => {
    for (let i = 0; i < MAX_OPEN; i++) {
      const r = cascadeRect(i, { w: 500, h: 400 });
      expect(r.x + r.w).toBeLessThanOrEqual(500);
      expect(r.y + r.h).toBeLessThanOrEqual(400);
    }
  });
});
