import { describe, expect, it } from "vitest";
import { formatMoney, roundToWhole } from "../src/format";
import { toCsv } from "../src/csv";

const NNBSP = " ";
const NBSP = " ";

describe("formatMoney", () => {
  it("affiche des francs entiers avec un espace entre les milliers", () => {
    expect(formatMoney("12500")).toBe(`12${NNBSP}500${NBSP}F`);
    expect(formatMoney(1234567)).toBe(`1${NNBSP}234${NNBSP}567${NBSP}F`);
    expect(formatMoney("0")).toBe(`0${NBSP}F`);
  });

  it("arrondit au franc le plus proche sans perdre de chiffres", () => {
    expect(formatMoney("12499.50")).toBe(`12${NNBSP}500${NBSP}F`);
    expect(formatMoney("12499.49")).toBe(`12${NNBSP}499${NBSP}F`);
    expect(roundToWhole("98765432109876543210.6")).toBe(98765432109876543211n);
  });

  it("gère les montants négatifs et la devise de l'entreprise", () => {
    expect(formatMoney("-5000", "FCFA")).toBe(`-5${NNBSP}000${NBSP}FCFA`);
  });

  it("refuse un montant invalide", () => {
    expect(() => formatMoney("douze")).toThrow();
  });
});

describe("toCsv", () => {
  it("échappe les guillemets et points-virgules", () => {
    expect(toCsv(["a", "b"], [["x;y", 'il dit "oui"']])).toBe('﻿a;b\r\n"x;y";"il dit ""oui"""');
  });
});
