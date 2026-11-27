import "server-only";
import { headers } from "next/headers";

const IP = /^(\d{1,3}(\.\d{1,3}){3}|[0-9a-f:]{2,39})$/i;

/** Adresse réseau et navigateur de la requête, pour le journal des accès */
export async function requestInfo() {
  const h = await headers();
  // Vercel fournit l'adresse réelle (non modifiable par le navigateur) ; ne pas placer d'autre service devant sans revoir ce point
  const ip = h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  return { ip: IP.test(ip) ? ip : null, userAgent: h.get("user-agent")?.slice(0, 300) ?? null };
}
