-- Smart Collab — Données de démonstration du lot 1 (FICTIVES ; décision L4 du 26/11/2026)
-- À n'appliquer que sur une base de développement ou de démonstration, JAMAIS en production :
-- le script s'arrête si la base contient une personne dont l'e-mail ne finit pas par « .test ».
-- Le mot de passe commun des comptes n'est pas dans ce fichier : on passe son empreinte bcrypt
-- (remplacer __DEMO_PASSWORD_HASH__ ; mot de passe documenté dans src/README.md).
-- Réexécutable : ne crée que ce qui manque.

do $$
declare
  hash text := '__DEMO_PASSWORD_HASH__';
  t_retail uuid := 'a0000000-0000-4000-8000-0000000000a1';
  t_multi  uuid := 'a0000000-0000-4000-8000-0000000000b2';
  r record;
  uid uuid;
begin
  if exists (select 1 from public.users where email !~* '\.test$') or exists (select 1 from auth.users where email !~* '\.test$') then
    raise exception 'Base non vide de comptes réels : données de démonstration refusées';
  end if;
  if hash !~ '^\$2[aby]\$' then
    raise exception 'Empreinte du mot de passe de démonstration manquante';
  end if;

  insert into public.plans (id, name, max_users, max_sites) values
    ('business', '{"fr":"Business","en":"Business"}', 25, 5)
  on conflict (id) do nothing;
  insert into public.apps (id, version, category, name, is_core, manifest) values
    ('core', '1.0.0', 'core', '{"fr":"Socle","en":"Core"}', true, '{}')
  on conflict (id) do nothing;

  insert into public.tenants (id, legal_name, business_domain, plan_id, status) values
    (t_retail, 'Boutique Démo Cocody', 'retail', 'business', 'trial'),
    (t_multi, 'Réseau Démo Plateau', 'multisite', 'business', 'trial')
  on conflict (id) do nothing;
  insert into public.app_installations (tenant_id, app_id, status, installed_version)
  select t, 'core', 'installed', '1.0.0' from unnest(array[t_retail, t_multi]) t
  on conflict do nothing;

  -- Rôles préréglés minimum (complétés à l'étape 3 : rôles et droits)
  insert into public.roles (tenant_id, code, name, source_preset)
  select t, c.code, c.name::jsonb, 'demo' from unnest(array[t_retail, t_multi]) t,
    (values ('admin', '{"fr":"Administrateur","en":"Administrator"}'),
            ('cashier', '{"fr":"Caissier","en":"Cashier"}'),
            ('accountant', '{"fr":"Comptable","en":"Accountant"}')) c(code, name)
  on conflict (tenant_id, code) do nothing;
  insert into public.role_permissions (tenant_id, role_id, permission)
  select ro.tenant_id, ro.id, p from public.roles ro,
    unnest(array['core.settings.manage', 'core.users.invite', 'core.apps.manage']) p
  where ro.code = 'admin' and ro.tenant_id in (t_retail, t_multi)
  on conflict do nothing;

  for r in select * from (values
      ('admin@demo-commerce.test', 'Awa Koné', array[t_retail], 'admin'),
      ('caissier@demo-commerce.test', 'Yao Kouassi', array[t_retail], 'cashier'),
      ('admin@demo-multisites.test', 'Fatou Traoré', array[t_multi], 'admin'),
      ('comptable@cabinet-demo.test', 'Marc Bamba', array[t_retail, t_multi], 'accountant')
    ) v(email, full_name, tenants, role_code)
  loop
    select id into uid from auth.users where email = r.email;
    if uid is null then
      uid := gen_random_uuid();
      insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
                              raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
                              confirmation_token, recovery_token, email_change_token_new, email_change)
      values ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', r.email, hash, now(),
              '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
      insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
      values (gen_random_uuid(), uid, uid::text,
              jsonb_build_object('sub', uid::text, 'email', r.email, 'email_verified', true), 'email', now(), now(), now());
    end if;
    insert into public.users (id, email, full_name) values (uid, r.email, r.full_name) on conflict (id) do nothing;
    insert into public.memberships (tenant_id, user_id) select t, uid from unnest(r.tenants) t on conflict do nothing;
    insert into public.user_roles (tenant_id, user_id, role_id)
    select ro.tenant_id, uid, ro.id from public.roles ro where ro.tenant_id = any (r.tenants) and ro.code = r.role_code
    on conflict do nothing;
  end loop;
end $$;
