-- SEC-MO-10 / ENF-TRA-01 : journal d'audit et journal des accès en ajout seul, même pour le propriétaire de la base.
begin;
\ir fixtures.sql
set local role postgres;
do $$
declare t text;
begin
  foreach t in array array['audit_log', 'access_log'] loop
    begin
      execute format('update public.%I set occurred_at = now()', t);
      assert false, format('Modification acceptée sur %s', t);
    exception when insufficient_privilege then null; end;
    begin
      execute format('delete from public.%I', t);
      assert false, format('Suppression acceptée sur %s', t);
    exception when insufficient_privilege then null; end;
    begin
      execute format('truncate public.%I', t);
      assert false, format('Vidage accepté sur %s', t);
    exception when insufficient_privilege then null; end;
  end loop;
end $$;
rollback;
