import { describe, expect, it } from "vitest";
import { safeNext } from "../../lib/supabase/config";

describe("retour après connexion (safeNext)", () => {
  it("garde les adresses internes", () => {
    expect(safeNext("/?ecran=settings")).toBe("/?ecran=settings");
    expect(safeNext("/invitation/abc")).toBe("/invitation/abc");
  });
  it("refuse tout ce qui mène à un autre site", () => {
    for (const bad of ["//pirate.example", "/\\pirate.example", "/\t/pirate.example", "/\n/pirate.example", "/%09/x".replace("%09", "\t"),
      "/..//pirate.example", "/a/..//pirate.example", "/.//pirate.example", "/%2e%2e//pirate.example", "/%2E%2E//pirate.example",
      "https://pirate.example", "javascript:alert(1)", "pirate.example", "", null, undefined, 42]) {
      expect(safeNext(bad)).toBe("/");
    }
  });
});
