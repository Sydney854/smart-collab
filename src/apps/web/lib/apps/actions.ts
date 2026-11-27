"use server";

import { z } from "zod";
import { authConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/**
 * App Store réel (lot 1, étape 4 ; EF-APP-01 à 06) : lecture du catalogue et des installations de l'entreprise,
 * aperçu des dépendances, installation et désinstallation. La base revérifie droits, formule et dépendances.
 */

export type StoreApp = {
  id: string;
  name: { fr: string; en: string };
  category: string;
  lot: number | null;
  status: "installed" | "archived" | "available";
  inPlan: boolean;
  isCore: boolean;
  dependsOn: string[];
};
export type StoreData = { apps: StoreApp[] };
export type PreviewItem = { id: string; name: { fr: string; en: string }; installed: boolean; inPlan: boolean };
export type StoreResult = { ok: boolean; error?: "forbidden" | "plan" | "dependents" | "reason" | "failed"; detail?: string; added?: string[] };

const appId = z.string().regex(/^[a-z_]{2,40}$/);

async function client() {
  if (!authConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const tenant = (data?.claims as { tenant_id?: string } | undefined)?.tenant_id;
  return tenant ? { supabase, tenant } : null;
}

export async function loadStore(): Promise<StoreData | null> {
  const c = await client();
  if (!c) return null;
  const [apps, deps, installs, tenant] = await Promise.all([
    c.supabase.from("apps").select("id, name, category, is_core, manifest").order("id"),
    c.supabase.from("app_dependencies").select("app_id, depends_on"),
    c.supabase.from("app_installations").select("app_id, status").eq("tenant_id", c.tenant),
    c.supabase.from("tenants").select("plan_id").eq("id", c.tenant).maybeSingle(),
  ]);
  const { data: planApps } = await c.supabase.from("plan_apps").select("app_id").eq("plan_id", tenant.data?.plan_id ?? "");
  const inPlan = new Set((planApps ?? []).map((p) => p.app_id as string));
  return {
    apps: (apps.data ?? []).map((a) => {
      const inst = (installs.data ?? []).find((i) => i.app_id === a.id);
      return {
        id: a.id as string,
        name: a.name as { fr: string; en: string },
        category: a.category as string,
        lot: ((a.manifest as { lot?: number } | null)?.lot ?? null) as number | null,
        status: (inst?.status as "installed" | "archived" | undefined) ?? "available",
        inPlan: inPlan.has(a.id as string) || (a.is_core as boolean),
        isCore: a.is_core as boolean,
        dependsOn: (deps.data ?? []).filter((d) => d.app_id === a.id).map((d) => d.depends_on as string),
      };
    }),
  };
}

/** Ce que l'installation ajoutera, avant confirmation (EF-APP-02) */
export async function previewInstall(id: string): Promise<PreviewItem[]> {
  const c = await client();
  if (!c || !appId.safeParse(id).success) return [];
  const { data } = await c.supabase.rpc("preview_install", { p_app: id });
  return ((data as { app_id: string; name: { fr: string; en: string }; installed: boolean; in_plan: boolean }[] | null) ?? []).map((p) => ({
    id: p.app_id,
    name: p.name,
    installed: p.installed,
    inPlan: p.in_plan,
  }));
}

export async function installApp(id: string): Promise<StoreResult> {
  const c = await client();
  if (!c || !appId.safeParse(id).success) return { ok: false, error: "failed" };
  const { data, error } = await c.supabase.rpc("install_app", { p_app: id });
  if (error) return { ok: false, error: error.code === "42501" ? "forbidden" : error.code === "23514" ? "plan" : "failed" };
  // Nouveau jeton : rien ne dépend des applications dans le jeton, mais l'écran relit menus et droits
  return { ok: true, added: (data as string[] | null) ?? [] };
}

export async function uninstallApp(id: string, reason: string): Promise<StoreResult> {
  const c = await client();
  if (!c || !appId.safeParse(id).success) return { ok: false, error: "failed" };
  if (!z.string().trim().min(3).max(500).safeParse(reason).success) return { ok: false, error: "reason" };
  const { error } = await c.supabase.rpc("uninstall_app", { p_app: id, p_reason: reason });
  if (!error) return { ok: true };
  if (error.code === "2BP01") return { ok: false, error: "dependents", detail: error.message.split(":").pop()?.trim() };
  return { ok: false, error: error.code === "42501" ? "forbidden" : error.code === "23514" ? "reason" : "failed" };
}
