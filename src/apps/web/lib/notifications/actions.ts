"use server";

import { authConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/**
 * Notifications de la cloche (décision du 28/11/2026) : seulement des faits réels de l'entreprise connectée,
 * jamais d'exemples inventés. Lot 1 : applications installées / désinstallées et invitations acceptées
 * (journal d'audit, visible avec le droit core.audit.view — la base le revérifie), fin de période d'essai.
 * Les notifications des modules (stock bas, commande passée…) arriveront avec ces modules.
 */
export type NotificationItem = {
  id: string;
  kind: "appInstalled" | "appUninstalled" | "invitationAccepted" | "trialEnds";
  at: string;
  /** Nom de l'application ({fr,en}), de la personne, ou nombre de jours restants */
  app?: { fr: string; en: string };
  person?: string;
  days?: number;
};

const DAYS = 30;
const LIMIT = 50;

export async function loadNotifications(): Promise<NotificationItem[]> {
  if (!authConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const tenant = (data?.claims as { tenant_id?: string } | undefined)?.tenant_id;
  if (!tenant) return [];

  const since = new Date(Date.now() - DAYS * 86_400_000).toISOString();
  const [logs, tenantRow, apps] = await Promise.all([
    // RLS : tenant courant et droit core.audit.view ; sans ce droit, la liste revient vide
    supabase
      .from("audit_log")
      .select("id, action, entity, entity_id, user_id, occurred_at")
      .eq("tenant_id", tenant)
      .gte("occurred_at", since)
      .or("and(entity.eq.app,action.in.(install,uninstall)),and(entity.eq.invitation,action.eq.accept)")
      .order("occurred_at", { ascending: false })
      .limit(LIMIT),
    supabase.from("tenants").select("status, trial_ends_at").eq("id", tenant).maybeSingle(),
    supabase.from("apps").select("id, name"),
  ]);

  const userIds = [...new Set((logs.data ?? []).filter((l) => l.entity === "invitation").map((l) => l.user_id as string))];
  const people = userIds.length ? (await supabase.from("users").select("id, full_name, email").in("id", userIds)).data ?? [] : [];

  const items: NotificationItem[] = (logs.data ?? []).map((l) => {
    const at = l.occurred_at as string;
    if (l.entity === "invitation") {
      const p = people.find((u) => u.id === l.user_id);
      return { id: `audit:${l.id}`, kind: "invitationAccepted", at, person: (p?.full_name as string) || (p?.email as string) || "—" };
    }
    const app = (apps.data ?? []).find((a) => a.id === l.entity_id);
    return {
      id: `audit:${l.id}`,
      kind: l.action === "install" ? "appInstalled" : "appUninstalled",
      at,
      app: (app?.name as { fr: string; en: string } | undefined) ?? { fr: String(l.entity_id), en: String(l.entity_id) },
    };
  });

  // Fin de la période d'essai : rappel dans les 30 derniers jours
  const t = tenantRow.data;
  if (t?.status === "trial" && t.trial_ends_at) {
    const end = new Date(t.trial_ends_at as string);
    const days = Math.ceil((end.getTime() - Date.now()) / 86_400_000);
    if (days >= 0 && days <= DAYS) {
      items.unshift({ id: `trial:${end.toISOString().slice(0, 10)}`, kind: "trialEnds", at: new Date().toISOString(), days });
    }
  }
  return items;
}
