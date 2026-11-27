-- Invitation sur un rôle « puissant » (administrateur, ou portant core.roles.manage / core.users.manage) :
-- réservée à qui peut modifier les droits, comme l'attribution directe (contrôle de sécurité du 27/11/2026)
create or replace function app.check_invitable_role(p_role uuid) returns void
language plpgsql stable security definer set search_path = '' as $$
begin
  if app.role_is_powerful(p_role) and not app.has_permission('core.roles.manage') then
    raise exception 'Action non autorisée' using errcode = 'insufficient_privilege';
  end if;
  if not exists (select 1 from public.roles r where r.id = p_role and r.tenant_id = app.current_tenant() and r.is_active) then
    raise exception 'Rôle inconnu' using errcode = 'no_data_found';
  end if;
end $$;
revoke all on function app.check_invitable_role(uuid) from public, anon, authenticated;
