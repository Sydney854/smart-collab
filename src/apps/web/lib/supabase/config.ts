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
  !authConfigured && process.env.SC_DEMO_SANS_CONNEXION === "1" && process.env.VERCEL_ENV !== "production";

/** Adresses accessibles sans être connecté */
export const PUBLIC_PATHS = ["/connexion", "/invitation"];

export function isPublicPath(path: string) {
  return PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Retour après connexion : seulement une adresse interne (jamais un autre site) */
export function safeNext(value: unknown): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : "/";
}
