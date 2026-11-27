/**
 * Réglages Supabase lus dans les variables d'environnement.
 * Seules l'adresse et la clé publique (« publishable ») vont au navigateur ; la clé serveur reste côté serveur (SEC-MO-02).
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
export const authConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

/**
 * Démonstration sans connexion (données fictives du lot 0) : seulement si demandée explicitement
 * (tests d'écran, poste de développement sans Supabase), et jamais en production Vercel.
 * Sans Supabase et sans cette demande, l'application refuse de s'ouvrir (sécurité par défaut).
 */
export const demoWithoutAuth =
  !authConfigured &&
  process.env.SC_DEMO_SANS_CONNEXION === "1" &&
  process.env.VERCEL_ENV !== "production" &&
  process.env.SC_ENVIRONMENT !== "production";

/** Adresses accessibles sans être connecté */
export const PUBLIC_PATHS = ["/connexion", "/invitation"];

export function isPublicPath(path: string) {
  return PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

const SELF = "https://smart-collab.invalid";

/**
 * Retour après connexion : seulement une adresse de notre site (jamais un autre site).
 * Refuse les caractères de contrôle (tabulation, retour à la ligne : le navigateur les supprime et « /\t/x » devient « //x »),
 * la barre oblique inversée, puis vérifie qu'une fois interprétée l'adresse reste sur notre site.
 */
export function safeNext(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.length > 2000) return "/";
  // biome-ignore lint/suspicious/noControlCharactersInRegex: on cherche justement les caractères de contrôle
  if (/[\u0000-\u001f\u007f\\]/.test(value)) return "/";
  try {
    const url = new URL(value, SELF);
    if (url.origin !== SELF) return "/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}
