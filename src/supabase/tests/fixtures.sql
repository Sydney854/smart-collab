-- Données fictives de test : deux entreprises (A = Commerce de détail, B = Multi-sites), une ligne par table et par entreprise.
-- alice : A seulement ; bob : B seulement ; carla (comptable) : A et B, entreprise choisie B ; dan : appartenance à A désactivée.
-- Base de test = démonstration : double authentification des administrateurs facultative (réglage explicite)
insert into app.settings (key, value) values ('require_admin_mfa', 'false') on conflict (key) do update set value = excluded.value;
insert into public.plans (id, name) values ('business', '{"fr":"Business","en":"Business"}');
insert into public.apps (id, version, category, name, is_core, manifest) values
  ('core', '1.0.0', 'core', '{"fr":"Socle","en":"Core"}', true, '{}'),
  ('pos', '1.0.0', 'sales', '{"fr":"Point de vente","en":"Point of sale"}', false, '{}')
on conflict (id) do nothing;
insert into public.app_dependencies values ('pos', 'core');
insert into public.plan_apps values ('business', 'core'), ('business', 'pos');

insert into public.tenants (id, legal_name, business_domain, plan_id) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Boutique Démo A', 'retail', 'business'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'Réseau Démo B', 'multisite', 'business');

insert into auth.users (id, email) values
  ('a1000000-0000-0000-0000-000000000001', 'alice@demo-a.test'),
  ('b2000000-0000-0000-0000-000000000002', 'bob@demo-b.test'),
  ('c3000000-0000-0000-0000-000000000003', 'carla@cabinet.test'),
  ('d4000000-0000-0000-0000-000000000004', 'dan@demo-a.test');
insert into public.users (id, email, full_name, current_tenant_id) values
  ('a1000000-0000-0000-0000-000000000001', 'alice@demo-a.test', 'Alice Démo', null),
  ('b2000000-0000-0000-0000-000000000002', 'bob@demo-b.test', 'Bob Démo', null),
  ('c3000000-0000-0000-0000-000000000003', 'carla@cabinet.test', 'Carla Comptable', 'bbbbbbbb-0000-0000-0000-000000000002'),
  ('d4000000-0000-0000-0000-000000000004', 'dan@demo-a.test', 'Dan Ancien', null);
insert into public.memberships (tenant_id, user_id, is_active) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', true),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000002', true),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'c3000000-0000-0000-0000-000000000003', true),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'c3000000-0000-0000-0000-000000000003', true),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'd4000000-0000-0000-0000-000000000004', false);

do $$
declare
  t uuid; u uuid; r uuid; c uuid; d uuid; k uuid;
begin
  foreach t in array array['aaaaaaaa-0000-0000-0000-000000000001'::uuid, 'bbbbbbbb-0000-0000-0000-000000000002'::uuid] loop
    u := case when t::text like 'aaaa%' then 'a1000000-0000-0000-0000-000000000001'::uuid else 'b2000000-0000-0000-0000-000000000002'::uuid end;
    insert into public.subscriptions (tenant_id, plan_id, starts_on, ends_on, amount) values (t, 'business', '2026-01-01', '2027-01-01', 1200000);
    insert into public.app_installations (tenant_id, app_id, status, installed_version) values (t, 'core', 'installed', '1.0.0');
    insert into public.roles (tenant_id, code, name) values (t, 'admin', '{"fr":"Administrateur","en":"Administrator"}') returning id into r;
    insert into public.role_permissions (tenant_id, role_id, permission) values (t, r, 'core.settings.manage'), (t, r, 'core.audit.view'), (t, r, 'core.users.view'), (t, r, 'core.roles.view');
    insert into public.user_roles (tenant_id, user_id, role_id) values (t, u, r);
    insert into public.field_masks (tenant_id, role_id, entity, field) values (t, r, 'product', 'cost_price');
    insert into public.config_items (tenant_id, app_id, kind, code) values (t, 'core', 'theme', 'default') returning id into c;
    insert into public.config_versions (tenant_id, config_item_id, version, valid_from, definition) values (t, c, 1, '2026-01-01', '{}');
    insert into public.number_sequences (tenant_id, code, prefix) values (t, 'pos.ticket', 'T');
    insert into public.audit_log (tenant_id, user_id, action, entity, entity_id) values (t, u, 'install', 'app', 'core');
    insert into public.access_log (tenant_id, email, event) values (t, 'x@demo.test', 'login');
    insert into public.event_outbox (tenant_id, type, payload) values (t, 'core.app.installed', '{}');
    insert into public.delete_requests (tenant_id, entity, entity_id, reason, requested_by) values (t, 'doc', '1', 'Erreur de saisie', u);
    insert into public.devices (tenant_id, label, number_prefix) values (t, 'Caisse 1', 'C1') returning id into d;
    k := gen_random_uuid();
    insert into public.sync_operations (idempotency_key, tenant_id, device_id, operation, payload, performed_at) values (k, t, d, 'pos.sale.create', '{}', now());
    insert into public.sync_conflicts (tenant_id, idempotency_key, kind, detail) values (t, k, 'price_changed', '{}');
    insert into public.invitations (tenant_id, email, full_name, role_id, token_hash, expires_at, invited_by)
      values (t, 'invite-' || left(t::text, 4) || '@demo.test', 'Personne Invitée', r, md5(t::text || 'x'), now() + interval '7 days', u);
  end loop;
end $$;
