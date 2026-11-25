/**
 * Affichage des montants : francs entiers, séparateur d'espace, devise de l'entreprise.
 * Ex. : formatMoney("12500") → "12 500 F".
 *
 * Les montants arrivent de la base en `numeric` (chaînes de caractères) : on évite
 * de passer par un nombre à virgule flottante pour ne perdre aucun chiffre.
 */
export function formatMoney(amount: string | number | bigint, currency = "F"): string {
  const whole = roundToWhole(amount);
  const negative = whole < 0n;
  const digits = (negative ? -whole : whole).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${negative ? "-" : ""}${grouped} ${currency}`;
}

/** Arrondi à l'unité, au plus proche (0,5 vers le haut en valeur absolue). */
export function roundToWhole(amount: string | number | bigint): bigint {
  if (typeof amount === "bigint") return amount;
  const text = typeof amount === "number" ? amount.toFixed(2) : amount.trim();
  const match = /^([+-])?(\d+)(?:[.,](\d+))?$/.exec(text);
  if (!match) throw new Error(`Montant invalide : ${String(amount)}`);
  const [, sign, intPart, decPart = ""] = match;
  let value = BigInt(intPart);
  if (decPart && Number(decPart[0]) >= 5) value += 1n;
  return sign === "-" ? -value : value;
}
