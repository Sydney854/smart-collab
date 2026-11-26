-- SEC-MO-01 : aucune table sans sécurité au niveau des lignes, activée ET forcée, avec au moins une règle ;
-- aucun droit pour les visiteurs (anon) ; aucune écriture directe pour les personnes connectées.
do $$
declare r record;
begin
  for r in select c.relname, c.relrowsecurity, c.relforcerowsecurity,
                  (select count(*) from pg_policies p where p.schemaname = 'public' and p.tablename = c.relname) as policies
           from pg_class c join pg_namespace n on n.oid = c.relnamespace
           where n.nspname = 'public' and c.relkind in ('r', 'p') loop
    assert r.relrowsecurity, format('RLS non activée sur %s', r.relname);
    assert r.relforcerowsecurity, format('RLS non forcée sur %s', r.relname);
    assert r.policies > 0, format('Aucune règle sur %s', r.relname);
  end loop;
end $$;

do $$
declare r record;
begin
  for r in select table_name, privilege_type, grantee from information_schema.role_table_grants
           where table_schema = 'public' and grantee in ('anon', 'authenticated') loop
    assert r.grantee <> 'anon', format('Le visiteur (anon) a le droit %s sur %s', r.privilege_type, r.table_name);
    assert r.privilege_type = 'SELECT', format('Écriture directe %s accordée sur %s', r.privilege_type, r.table_name);
  end loop;
end $$;

-- Les fonctions sensibles ne sont pas appelables par un visiteur
do $$ begin
  assert not has_function_privilege('anon', 'public.select_tenant(uuid)', 'execute'), 'select_tenant ouvert aux visiteurs';
  assert not has_function_privilege('anon', 'public.custom_access_token_hook(jsonb)', 'execute'), 'crochet ouvert aux visiteurs';
  assert not has_function_privilege('authenticated', 'public.custom_access_token_hook(jsonb)', 'execute'), 'crochet ouvert aux personnes connectées';
end $$;

-- Droits accordés colonne par colonne : lecture seule, jamais pour les visiteurs
do $$
declare r record;
begin
  for r in select table_name, column_name, privilege_type, grantee from information_schema.column_privileges
           where table_schema = 'public' and grantee in ('anon', 'authenticated') loop
    assert r.grantee <> 'anon', format('Le visiteur (anon) a le droit %s sur %s.%s', r.privilege_type, r.table_name, r.column_name);
    assert r.privilege_type = 'SELECT', format('Écriture directe %s accordée sur %s.%s', r.privilege_type, r.table_name, r.column_name);
  end loop;
end $$;
