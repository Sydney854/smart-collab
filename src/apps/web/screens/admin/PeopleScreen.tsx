"use client";

import { ConfirmDialog, EmptyState } from "@smart-collab/ui";
import { Badge } from "@smart-collab/ui/components/ui/badge";
import { Button } from "@smart-collab/ui/components/ui/button";
import { Checkbox } from "@smart-collab/ui/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@smart-collab/ui/components/ui/dialog";
import { Input } from "@smart-collab/ui/components/ui/input";
import { Label } from "@smart-collab/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@smart-collab/ui/components/ui/select";
import { useFormatDate } from "@smart-collab/ui";
import { CopyIcon, MailPlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { type Member, cancelInvitation, inviteMember, setMemberActive, setMemberRoles } from "@/lib/admin/actions";
import { useCan } from "@/lib/permissions";
import { useAdminData, useLabel } from "./useAdminData";

/**
 * Collaborateurs (fiches core.users et core.invitation) : personnes de l'entreprise, rôles, activation,
 * invitations en cours. Chaque bouton n'apparaît que si la permission existe ; la base revérifie.
 */
export function PeopleScreen() {
  const t = useTranslations("admin");
  const tAuth = useTranslations("auth");
  const tHeader = useTranslations("header");
  const label = useLabel();
  const formatDate = useFormatDate();
  const can = useCan();
  const { data, apply } = useAdminData();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [link, setLink] = useState<string>();
  const [form, setForm] = useState({ email: "", fullName: "", roleId: "", locale: "fr" as "fr" | "en" });
  const [editing, setEditing] = useState<Member>();
  const [editRoles, setEditRoles] = useState<string[]>([]);
  const [deactivating, setDeactivating] = useState<Member>();

  if (data === undefined) return <p className="text-muted-foreground">…</p>;
  if (data === null)
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <h1 className="text-2xl font-semibold tracking-tight">{t("peopleTitle")}</h1>
        <EmptyState description={t("signedOutOnly")} />
      </div>
    );
  const roleName = (id: string) => label(data.roles.find((r) => r.id === id)?.name);
  const invitableRoles = data.roles.filter((r) => r.isActive && (r.code !== "admin" || can("core.roles.manage")));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5" data-testid="people-screen">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("peopleTitle")}</h1>
          <p className="mt-1 text-muted-foreground">{t("peopleSubtitle")}</p>
        </div>
        {can("core.users.invite") && (
          <Button
            onClick={() => {
              setLink(undefined);
              setForm({ email: "", fullName: "", roleId: "", locale: "fr" });
              setInviteOpen(true);
            }}
          >
            <MailPlusIcon /> {t("invite")}
          </Button>
        )}
      </header>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th scope="col" className="p-3 font-medium">{t("name")}</th>
              <th scope="col" className="p-3 font-medium">{t("roles")}</th>
              <th scope="col" className="p-3 font-medium">{t("status")}</th>
              <th scope="col" className="p-3" />
            </tr>
          </thead>
          <tbody>
            {data.members.map((m) => (
              <tr key={m.userId} className="border-b last:border-0" data-member={m.email}>
                <td className="p-3">
                  <p className="font-medium">
                    {m.name} {m.isMe && <span className="text-muted-foreground">{t("you")}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </td>
                <td className="p-3">
                  <span className="flex flex-wrap gap-1">
                    {m.roleIds.map((r) => (
                      <Badge key={r} variant="secondary">
                        {roleName(r)}
                      </Badge>
                    ))}
                  </span>
                </td>
                <td className="p-3">{m.isActive ? t("active") : t("inactive")}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  {can("core.users.manage") && (
                    <span className="inline-flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditing(m);
                          setEditRoles(m.roleIds);
                        }}
                      >
                        {t("editRoles")}
                      </Button>
                      {!m.isMe &&
                        (m.isActive ? (
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeactivating(m)}>
                            {t("deactivate")}
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => apply(() => setMemberActive(m.userId, true, ""), t("saved"))}>
                            {t("reactivate")}
                          </Button>
                        ))}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {can("core.users.view") && data.invitations.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="font-semibold">{t("pending")}</h2>
          <ul className="flex flex-col gap-2">
            {data.invitations.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card p-3 text-sm">
                <span>
                  <span className="font-medium">{i.fullName}</span> · {i.email} · {roleName(i.roleId)}
                  <span className="block text-xs text-muted-foreground">{t("expires", { date: formatDate(new Date(i.expiresAt), "PPP") })}</span>
                </span>
                {can("core.users.invite") && (
                  <Button size="sm" variant="ghost" onClick={() => apply(() => cancelInvitation(i.id), t("cancelled"))}>
                    {t("cancel")}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Inviter une personne (fiche core.invitation) */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("invite")}</DialogTitle>
            {form.email && !link && <DialogDescription>{t("inviteValid", { email: form.email })}</DialogDescription>}
          </DialogHeader>
          {link ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm">{t("inviteLink")}</p>
              <code className="rounded bg-muted p-2 text-xs break-all select-all" data-testid="invite-link">
                {link}
              </code>
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(link).then(() => toast.success(t("copied")))}
              >
                <CopyIcon /> {t("copy")}
              </Button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                const result = await apply(() => inviteMember(form));
                if (result.ok && result.token) setLink(`${window.location.origin}/invitation/${result.token}`);
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="inv-new-email">{t("email")}</Label>
                <Input id="inv-new-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="inv-new-name">{tAuth("fullName")}</Label>
                <Input id="inv-new-name" required minLength={2} maxLength={120} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t("inviteRole")}</Label>
                <Select value={form.roleId} onValueChange={(v) => setForm({ ...form, roleId: v })}>
                  <SelectTrigger aria-label={t("inviteRole")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {invitableRoles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {label(r.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{t("inviteLanguage")}</Label>
                <Select value={form.locale} onValueChange={(v) => setForm({ ...form, locale: v as "fr" | "en" })}>
                  <SelectTrigger aria-label={t("inviteLanguage")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">{tHeader("french")}</SelectItem>
                    <SelectItem value="en">{tHeader("english")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={!form.email || form.fullName.trim().length < 2 || !form.roleId}>
                  {t("inviteSend")}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modifier les rôles d'une personne */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("editRoles")} · {editing?.name}
            </DialogTitle>
          </DialogHeader>
          <ul className="flex flex-col gap-2">
            {data.roles
              // Une action non permise est masquée, pas grisée
              .filter((r) => r.isActive && (r.code !== "admin" || can("core.roles.manage")))
              .map((r) => (
                <li key={r.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`role-${r.id}`}
                    checked={editRoles.includes(r.id)}
                    onCheckedChange={(v) => setEditRoles((s) => (v === true ? [...s, r.id] : s.filter((x) => x !== r.id)))}
                  />
                  <Label htmlFor={`role-${r.id}`} className="font-normal">
                    {label(r.name)}
                  </Label>
                </li>
              ))}
          </ul>
          <DialogFooter>
            <Button
              onClick={async () => {
                if (!editing) return;
                const result = await apply(() => setMemberRoles(editing.userId, editRoles), t("saved"));
                if (result.ok) setEditing(undefined);
              }}
            >
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Désactiver : motif obligatoire, historique conservé (EF-GEN-02) */}
      <ConfirmDialog
        open={!!deactivating}
        onOpenChange={(o) => !o && setDeactivating(undefined)}
        title={t("deactivate")}
        description={deactivating ? t("deactivateConfirm", { name: deactivating.name }) : undefined}
        danger
        requireReason
        confirmLabel={t("deactivate")}
        onConfirm={(reason) => {
          const m = deactivating;
          setDeactivating(undefined);
          if (m) apply(() => setMemberActive(m.userId, false, reason ?? ""), t("saved"));
        }}
      />
    </div>
  );
}
