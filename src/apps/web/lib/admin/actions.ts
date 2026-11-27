"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/**
 * Actions serveur des écrans Collaborateurs (core.users), Profils et droits (core.roles, core.field-masks).
 * Toutes passent au nom de la personne connectée : la base applique l'isolation par entreprise et revérifie
 * chaque permission (SEC-MO-03). L'écran ne fait que masquer ce qui n'est pas permis.
 */

export type Label = { fr: string; en: string };
export type Role = { id: string; code: string; name: Label; isActive: boolean; permissions: string[]; masks: string[] };
export type Member = { userId: string; name: string; email: string; isActive: boolean; roleIds: string[]; isMe: boolean };
export type Invitation = { id: string; email: string; fullName: string; roleId: string; expiresAt: string };
export type Permission = { code: string; appId: string; action: string; label: Label };
export type SensitiveField = { key: string; label: Label };
export type AdminData = {
  members: Member[];
  roles: Role[];
  invitations: Invitation[];
  permissions: Permission[];
  sensitiveFields: SensitiveField[];
};
export type ActionResult = { ok: boolean; error?: "forbidden" | "invalid" | "exists" | "self" | "reason" | "failed"; token?: string };

async function context() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims as { sub?: string; tenant_id?: string } | undefined;
  return { supabase, me: claims?.sub, tenant: claims?.tenant_id };
}

function fail(error: { code?: string } | null): ActionResult {
  if (!error) return { ok: true };
  if (error.code === "42501") return { ok: false, error: "forbidden" };
  if (error.code === "23505") return { ok: false, error: "exists" };
  if (error.code === "23514") return { ok: false, error: "reason" };
  return { ok: false, error: "failed" };
}

/** Données des écrans d'administration (ce que la base laisse voir à la personne connectée) */
export async function loadAdminData(): Promise<AdminData | null> {
  const { supabase, me, tenant } = await context();
  if (!tenant) return null;
  const [members, userRoles, roles, perms, masks, invitations, catalog, fields] = await Promise.all([
    supabase.from("memberships").select("user_id, is_active, users(full_name, email)").eq("tenant_id", tenant),
    supabase.from("user_roles").select("user_id, role_id").eq("tenant_id", tenant),
    supabase.from("roles").select("id, code, name, is_active").eq("tenant_id", tenant).order("code"),
    supabase.from("role_permissions").select("role_id, permission").eq("tenant_id", tenant),
    supabase.from("field_masks").select("role_id, entity, field").eq("tenant_id", tenant),
    supabase.from("invitations").select("id, email, full_name, role_id, expires_at").eq("tenant_id", tenant).eq("status", "pending"),
    supabase.from("permissions").select("code, app_id, action, label").order("code"),
    supabase.from("sensitive_fields").select("entity, field, label").order("entity"),
  ]);
  const rolesOf = (uid: string) => (userRoles.data ?? []).filter((r) => r.user_id === uid).map((r) => r.role_id as string);
  return {
    members: (members.data ?? [])
      .map((m) => {
        const u = m.users as unknown as { full_name: string; email: string } | null;
        return { userId: m.user_id as string, name: u?.full_name ?? "", email: u?.email ?? "", isActive: m.is_active as boolean, roleIds: rolesOf(m.user_id as string), isMe: m.user_id === me };
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
    roles: (roles.data ?? []).map((r) => ({
      id: r.id as string,
      code: r.code as string,
      name: r.name as Label,
      isActive: r.is_active as boolean,
      permissions: (perms.data ?? []).filter((p) => p.role_id === r.id).map((p) => p.permission as string),
      masks: (masks.data ?? []).filter((m) => m.role_id === r.id).map((m) => `${m.entity}.${m.field}`),
    })),
    invitations: (invitations.data ?? []).map((i) => ({ id: i.id as string, email: i.email as string, fullName: i.full_name as string, roleId: i.role_id as string, expiresAt: i.expires_at as string })),
    permissions: (catalog.data ?? []).map((p) => ({ code: p.code as string, appId: p.app_id as string, action: p.action as string, label: p.label as Label })),
    sensitiveFields: (fields.data ?? []).map((f) => ({ key: `${f.entity}.${f.field}`, label: f.label as Label })),
  };
}

const uuid = z.string().uuid();

export async function setRolePermission(roleId: string, permission: string, granted: boolean): Promise<ActionResult> {
  if (!uuid.safeParse(roleId).success || !/^[a-z0-9_.]+$/.test(permission)) return { ok: false, error: "invalid" };
  const { supabase } = await context();
  const { error } = await supabase.rpc("set_role_permission", { p_role: roleId, p_permission: permission, p_granted: granted });
  return fail(error);
}

export async function setFieldMask(roleId: string, key: string, masked: boolean): Promise<ActionResult> {
  const [entity, field] = key.split(".");
  if (!uuid.safeParse(roleId).success || !entity || !field) return { ok: false, error: "invalid" };
  const { supabase } = await context();
  const { error } = await supabase.rpc("set_field_mask", { p_role: roleId, p_entity: entity, p_field: field, p_masked: masked });
  return fail(error);
}

export async function setMemberRoles(userId: string, roleIds: string[]): Promise<ActionResult> {
  if (!uuid.safeParse(userId).success || !roleIds.every((r) => uuid.safeParse(r).success)) return { ok: false, error: "invalid" };
  const { supabase } = await context();
  const { error } = await supabase.rpc("set_member_roles", { p_user: userId, p_roles: roleIds });
  return fail(error);
}

export async function setMemberActive(userId: string, active: boolean, reason: string): Promise<ActionResult> {
  if (!uuid.safeParse(userId).success) return { ok: false, error: "invalid" };
  const { supabase } = await context();
  const { error } = await supabase.rpc("set_member_active", { p_user: userId, p_active: active, p_reason: reason });
  return fail(error);
}

const invitation = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  fullName: z.string().trim().min(2).max(120),
  roleId: uuid,
  locale: z.enum(["fr", "en"]),
});

/** Crée l'invitation ; renvoie le lien à usage unique (à copier tant que l'envoi d'e-mails n'est pas branché, décision F5) */
export async function inviteMember(input: z.infer<typeof invitation>): Promise<ActionResult> {
  const parsed = invitation.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { supabase } = await context();
  const { data, error } = await supabase.rpc("create_invitation", {
    p_email: parsed.data.email,
    p_full_name: parsed.data.fullName,
    p_role: parsed.data.roleId,
    p_locale: parsed.data.locale,
  });
  if (error) return fail(error);
  return { ok: true, token: data as string };
}

export async function cancelInvitation(invitationId: string): Promise<ActionResult> {
  if (!uuid.safeParse(invitationId).success) return { ok: false, error: "invalid" };
  const { supabase } = await context();
  const { error } = await supabase.rpc("cancel_invitation", { p_invitation: invitationId });
  return fail(error);
}
