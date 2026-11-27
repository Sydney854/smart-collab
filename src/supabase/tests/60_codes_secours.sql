-- Codes de secours (F1) et limitation par adresse réseau (F4)
begin;
\ir fixtures.sql
create temporary table codes(v text[]) on commit drop;
grant all on codes to authenticated, service_role;

-- Sans second facteur validé dans la session : refus
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","role":"authenticated","aal":"aal1"}', true);
set local role authenticated;
do $$ begin
  begin
    perform public.generate_recovery_codes();
    assert false, 'Codes créés sans second facteur';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

-- Avec second facteur : 8 codes différents, seuls les condensés sont gardés, illisibles
select set_config('request.jwt.claims', '{"sub":"a1000000-0000-0000-0000-000000000001","role":"authenticated","aal":"aal2"}', true);
set local role authenticated;
do $$
declare c text[];
begin
  c := public.generate_recovery_codes();
  insert into codes values (c);
  assert array_length(c, 1) = 8, 'Il faut 8 codes';
  assert (select count(distinct x) from unnest(c) x) = 8, 'Codes en double';
  assert (select count(*) from public.mfa_recovery_codes) = 8, 'La personne doit voir ses 8 codes restants';
  begin
    perform code_hash from public.mfa_recovery_codes;
    assert false, 'Condensés lisibles';
  exception when insufficient_privilege then null; end;
  begin
    perform public.consume_recovery_code('a1000000-0000-0000-0000-000000000001', c[1]);
    assert false, 'Le navigateur peut consommer un code';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
  assert not exists (select 1 from public.mfa_recovery_codes m, codes, unnest(codes.v) x where m.code_hash = x), 'Code gardé en clair';
end $$;
-- Les autres ne voient pas ces codes
select set_config('request.jwt.claims', '{"sub":"b2000000-0000-0000-0000-000000000002","role":"authenticated","aal":"aal2"}', true);
set local role authenticated;
do $$ begin
  assert (select count(*) from public.mfa_recovery_codes) = 0, 'Bob voit les codes d''Alice';
end $$;
reset role;

-- Utilisation (serveur) : une seule fois ; saisie tolérante (minuscules, espaces)
set local role service_role;
do $$
declare c text := (select v[1] from codes);
begin
  assert public.consume_recovery_code('a1000000-0000-0000-0000-000000000001', lower(replace(c, '-', ' '))), 'Code valable refusé';
  assert not public.consume_recovery_code('a1000000-0000-0000-0000-000000000001', c), 'Code réutilisable';
  assert not public.consume_recovery_code('b2000000-0000-0000-0000-000000000002', (select v[2] from codes)), 'Code d''une autre personne accepté';
  assert not public.consume_recovery_code('a1000000-0000-0000-0000-000000000001', 'FAUX0-CODE0'), 'Faux code accepté';
end $$;

-- Limitation par adresse réseau : 20 échecs en 15 min depuis une même adresse, tous comptes confondus
do $$
declare i int;
begin
  for i in 1..19 loop perform public.record_access('robot' || i || '@demo.test', 'login_failed', null, '203.0.113.7'); end loop;
  assert not public.ip_blocked('203.0.113.7'), '19 échecs : pas encore bloqué';
  perform public.record_access('robot20@demo.test', 'login_failed', null, '203.0.113.7');
  assert public.ip_blocked('203.0.113.7'), '20 échecs : adresse bloquée';
  assert not public.ip_blocked('203.0.113.8'), 'Une autre adresse n''est pas bloquée';
  assert not public.ip_blocked(null), 'Adresse inconnue : pas de blocage global';
end $$;
reset role;
rollback;
