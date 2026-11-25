import { describe, expect, it } from "vitest";
import { messages } from "../index";

/** Liste « a.b.c » de toutes les clés feuilles d'un objet de traduction. */
function leaves(obj: unknown, prefix = ""): Record<string, unknown> {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) return { [prefix]: obj };
  return Object.entries(obj).reduce<Record<string, unknown>>(
    (acc, [k, v]) => ({ ...acc, ...leaves(v, prefix ? `${prefix}.${k}` : k) }),
    {},
  );
}

describe("traductions", () => {
  const fr = leaves(messages.fr);
  const en = leaves(messages.en);

  it("le français et l'anglais ont exactement les mêmes clés", () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(fr).sort());
  });

  it("aucun texte n'est vide", () => {
    for (const [lang, all] of Object.entries({ fr, en })) {
      for (const [key, value] of Object.entries(all)) {
        const values = Array.isArray(value) ? value : [value];
        for (const v of values) expect(String(v).trim(), `${lang}:${key}`).not.toBe("");
      }
    }
  });

  it("les listes ont la même longueur dans les deux langues", () => {
    for (const [key, value] of Object.entries(fr)) {
      if (Array.isArray(value)) expect((en[key] as unknown[]).length, key).toBe(value.length);
    }
  });
});
