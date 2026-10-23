-- Sperrt die Tabellen users, projects und dates für den öffentlichen Key (anon/authenticated).
-- Die App greift nur noch serverseitig mit SUPABASE_SECRET_KEY (service_role) zu, der RLS umgeht.
--
-- ERST AUSFÜHREN, WENN die neue App-Version mit SUPABASE_SECRET_KEY deployt ist,
-- sonst funktioniert die laufende alte Version nicht mehr.
-- Im Supabase-Dashboard unter "SQL Editor" ausführen.

begin;

-- 1. Alle bestehenden Policies auf den drei Tabellen entfernen
do $$
declare
  p record;
begin
  for p in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('users', 'projects', 'dates')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- 2. RLS aktivieren: ohne Policies bekommen anon/authenticated keine Zeilen mehr
alter table public.users    enable row level security;
alter table public.projects enable row level security;
alter table public.dates    enable row level security;

-- 3. Zusätzlich die Tabellenrechte für den öffentlichen Key entziehen
revoke all on table public.users, public.projects, public.dates from anon, authenticated;

commit;

-- Kontrolle: rowsecurity muss überall true sein, die zweite Abfrage muss leer sein
select tablename, rowsecurity
from pg_tables
where schemaname = 'public' and tablename in ('users', 'projects', 'dates');

select tablename, policyname
from pg_policies
where schemaname = 'public' and tablename in ('users', 'projects', 'dates');
