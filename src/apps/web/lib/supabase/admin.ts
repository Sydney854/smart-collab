import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/**
 * Client « serveur » (clé secrète SUPABASE_SECRET_KEY, variable protégée de Vercel) : journal des accès,
 * verrouillage, aperçu et création de compte par invitation. Jamais importé par un composant du navigateur
 * (« server-only » fait échouer la construction sinon). Renvoie null si la clé n'est pas configurée.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key || !SUPABASE_URL) return null;
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
