-- Smart Collab — Connexion (lot 1, étape 2)
-- * double authentification : si la personne a activé un second facteur, la base ne montre rien tant que la session
--   n'est pas au niveau « aal2 » (fiche core.login, SEC-MO-04) ;
-- * journal des accès et verrouillage du compte après plusieurs échecs (ENF-SEC-02, ENF-TRA-02) : fonctions appelées
--   par le serveur seulement (clé serveur), jamais par le navigateur ;
-- * invitations (fiche core.invitation) : lien à usage unique, valable 7 jours, seul son condensé est gardé en base ;
--   l'acceptation crée la fiche, l'appartenance et le rôle en une seule opération (EF-GEN-01) et l'écrit au journal.

-- ─────────────────────────────────────────────
-- Entreprise courante : exige le second facteur quand la personne l'a activé
-- ─────────────────────────────────────────────
create or replace function app.current_tenant() returns uuid
language sql stable security definer set search_path = '' as $$
  select m.tenant_id
  from public.memberships m
  join public.users u on u.id = m.user_id and u.is_active
  join public.tenants t on t.id = m.tenant_id and t.status in ('trial', 'active')
  where m.user_id = auth.uid()
    and m.is_active
    and m.tenant_id::text = (auth.jwt() ->> 'tenant_id')
    and (coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
         or not exists (select 1 from auth.mfa_factors f where f.user_id = auth.uid() and f.status = 'verified'))
$$;

-- ─────────────────────────────────────────────
-- Journal des accès et verrouillage (appelés par le serveur avec la clé serveur)
-- ─────────────────────────────────────────────
create or replace function public.record_access(p_email text, p_event text, p_tenant uuid default null,
                                                p_ip inet default null, p_user_agent text default null)
returns void language plpgsql volatile security definer set search_path = '' as $$
begin
  insert into public.access_log (tenant_id, email, event, ip, user_agent)
  values (p_tenant, lower(trim(p_email)), p_event, p_ip, left(p_user_agent, 300));
  if p_event = 'login' then
    update public.users set last_login_at = now() where lower(email) = lower(trim(p_email));
  end if;
end $$;

-- Vrai si le compte a atteint le nombre d'échecs autorisé dans la fenêtre de verrouillage (valeurs du 26/11 : 5 et 15 min)
create or replace function public.login_locked(p_email text, p_max_failures int default 5, p_minutes int default 15)
returns boolean language sql stable security definer set search_path = '' as $$
  select count(*) >= p_max_failures
  from public.access_log a
  where a.email = lower(trim(p_email))
    and a.event = 'login_failed'
    and a.occurred_at > now() - make_interval(mins => p_minutes)
    and a.occurred_at > coalesce((select max(s.occurred_at) from public.access_log s
                                  where s.email = lower(trim(p_email)) and s.event = 'login'), '-infinity')
$$;

-- ─────────────────────────────────────────────
-- Invitations
-- ─────────────────────────────────────────────
create table public.invitations (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id),
  email           text not null check (email = lower(trim(email)) and position('@' in email) > 1),
  full_name       text not null check (length(trim(full_name)) between 2 and 120),
  role_id         uuid not null,
  locale          text not null default 'fr' check (locale in ('fr', 'en')),
  token_hash      text not null unique,              -- condensé SHA-256 du lien ; le lien en clair n'est jamais gardé
  status          text not null default 'pending' check (status in ('pending', 'accepted', 'cancelled')),
  expires_at      timestamptz not null,
  invited_by      uuid not null,
  accepted_by     uuid references public.users(id),
  created_at      timestamptz not null default now(),
  foreign key (tenant_id, role_id) references public.roles(tenant_id, id),
  foreign key (tenant_id, invited_by) references public.memberships(tenant_id, user_id)
);
create unique index invitations_one_pending_idx on public.invitations (tenant_id, email) where status = 'pending';
create index invitations_tenant_idx on public.invitations (tenant_id);

alter table public.invitations enable row level security;
alter table public.invitations force row level security;
create policy tenant_isolation on public.invitations for all to authenticated
  using (tenant_id = (select app.current_tenant())) with check (tenant_id = (select app.current_tenant()));
-- Les membres voient les invitations de leur entreprise, jamais le condensé du lien
grant select (id, tenant_id, email, full_name, role_id, locale, status, expires_at, invited_by, accepted_by, created_at)
  on public.invitations to authenticated;

create or replace function app.token_hash(p_token text) returns text
language sql immutable set search_path = '' as $$
  select encode(sha256(convert_to(p_token, 'UTF8')), 'hex')
$$;

-- La personne connectée a-t-elle la permission dans l'entreprise courante ? (rôle lu dans la base, SEC-MO-03)
create or replace function app.has_permission(p_permission text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.user_roles ur
    join public.roles r on r.tenant_id = ur.tenant_id and r.id = ur.role_id and r.is_active
    join public.role_permissions rp on rp.tenant_id = r.tenant_id and rp.role_id = r.id
    where ur.tenant_id = app.current_tenant() and ur.user_id = auth.uid() and rp.permission = p_permission
  )
$$;

-- Créer une invitation : renvoie le lien en clair UNE seule fois (à envoyer ou à copier), garde son condensé.
create or replace function public.create_invitation(p_email text, p_full_name text, p_role uuid, p_locale text default 'fr')
returns text language plpgsql volatile security definer set search_path = '' as $$
declare
  t uuid := app.current_tenant();
  token text := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
  e text := lower(trim(p_email));
  inv uuid;
begin
  if t is null or not app.has_permission('core.users.invite') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  if exists (select 1 from public.memberships m join public.users u on u.id = m.user_id
             where m.tenant_id = t and lower(u.email) = e and m.is_active) then
    raise exception 'Cette personne est déjà membre' using errcode = 'unique_violation';
  end if;
  -- Une seule invitation en cours : l'ancienne est annulée
  update public.invitations set status = 'cancelled' where tenant_id = t and email = e and status = 'pending';
  insert into public.invitations (tenant_id, email, full_name, role_id, locale, token_hash, expires_at, invited_by)
  values (t, e, trim(p_full_name), p_role, p_locale, app.token_hash(token), now() + interval '7 days', auth.uid())
  returning id into inv;
  insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, new_value)
  values (t, auth.uid(), 'core', 'create', 'invitation', inv::text,
          jsonb_build_object('email', e, 'role_id', p_role, 'expires_in_days', 7));
  return token;
end $$;

create or replace function public.cancel_invitation(p_invitation uuid) returns void
language plpgsql volatile security definer set search_path = '' as $$
declare t uuid := app.current_tenant();
begin
  if t is null or not app.has_permission('core.users.invite') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  update public.invitations set status = 'cancelled' where id = p_invitation and tenant_id = t and status = 'pending';
  if found then
    insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id)
    values (t, auth.uid(), 'core', 'cancel', 'invitation', p_invitation::text);
  end if;
end $$;

-- Aperçu d'un lien (serveur seulement) : e-mail, nom proposé, entreprise, et si un compte existe déjà ; NULL si le lien n'est plus valable
create or replace function public.invitation_preview(p_token text)
returns table (email text, full_name text, company text, locale text, has_account boolean)
language sql stable security definer set search_path = '' as $$
  select i.email, i.full_name, t.legal_name, i.locale,
         exists (select 1 from public.users u where lower(u.email) = i.email)
  from public.invitations i
  join public.tenants t on t.id = i.tenant_id and t.status in ('trial', 'active')
  where i.token_hash = app.token_hash(p_token) and i.status = 'pending' and i.expires_at > now()
$$;

-- Accepter : la personne connectée (compte créé ou existant, même e-mail) rejoint l'entreprise avec le rôle prévu.
create or replace function public.accept_invitation(p_token text, p_full_name text default null)
returns uuid language plpgsql volatile security definer set search_path = '' as $$
declare
  inv public.invitations;
  me uuid := auth.uid();
  my_email text := lower(auth.jwt() ->> 'email');
begin
  if me is null then
    raise exception 'Connexion requise' using errcode = 'insufficient_privilege';
  end if;
  select i.* into inv from public.invitations i
  join public.tenants t on t.id = i.tenant_id and t.status in ('trial', 'active')
  where i.token_hash = app.token_hash(p_token) and i.status = 'pending' and i.expires_at > now()
  for update of i;
  if inv.id is null then
    raise exception 'Invitation non valable' using errcode = 'no_data_found';
  end if;
  if inv.email <> my_email then
    raise exception 'Invitation destinée à une autre adresse' using errcode = 'insufficient_privilege';
  end if;

  insert into public.users (id, email, full_name, locale)
  values (me, inv.email, coalesce(nullif(trim(p_full_name), ''), inv.full_name), inv.locale)
  on conflict (id) do nothing;
  insert into public.memberships (tenant_id, user_id, is_active) values (inv.tenant_id, me, true)
  on conflict (tenant_id, user_id) do update set is_active = true;
  insert into public.user_roles (tenant_id, user_id, role_id) values (inv.tenant_id, me, inv.role_id)
  on conflict do nothing;
  update public.invitations set status = 'accepted', accepted_by = me where id = inv.id;
  -- Première entreprise : elle devient l'entreprise choisie
  update public.users set current_tenant_id = inv.tenant_id where id = me and current_tenant_id is null;
  insert into public.audit_log (tenant_id, user_id, app_id, action, entity, entity_id, new_value)
  values (inv.tenant_id, me, 'core', 'accept', 'invitation', inv.id::text, jsonb_build_object('role_id', inv.role_id));
  return inv.tenant_id;
end $$;

-- ─────────────────────────────────────────────
-- Droits d'exécution
-- ─────────────────────────────────────────────
revoke all on function public.record_access(text, text, uuid, inet, text) from public, anon, authenticated;
revoke all on function public.login_locked(text, int, int) from public, anon, authenticated;
revoke all on function public.invitation_preview(text) from public, anon, authenticated;
revoke all on function public.create_invitation(text, text, uuid, text) from public, anon;
revoke all on function public.cancel_invitation(uuid) from public, anon;
revoke all on function public.accept_invitation(text, text) from public, anon;
revoke all on function app.token_hash(text) from public, anon, authenticated;
revoke all on function app.has_permission(text) from public, anon;

grant execute on function public.record_access(text, text, uuid, inet, text) to service_role;
grant execute on function public.login_locked(text, int, int) to service_role;
grant execute on function public.invitation_preview(text) to service_role;
grant execute on function public.create_invitation(text, text, uuid, text) to authenticated;
grant execute on function public.cancel_invitation(uuid) to authenticated;
grant execute on function public.accept_invitation(text, text) to authenticated;
grant execute on function app.has_permission(text) to authenticated;
