-- Pasul 1 (cap. 13) — rutare domeniu → workspace + temă per workspace.
-- Se rulează de Sergiu în Supabase → SQL Editor, ÎNAINTE de merge în main.
-- Idempotent: se poate rula de mai multe ori.

-- 1) Domeniile fiecărui workspace. host = formă canonică: litere mici, fără port, fără „www.”.
create table if not exists public.workspace_domains (
  host         text primary key
               check (host = lower(host) and host ~ '^[a-z0-9.-]+$' and host !~ '^www\.'
                      and host !~ '^\.' and host !~ '\.$' and host !~ '\.\.'),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);
create index if not exists workspace_domains_workspace_id_idx on public.workspace_domains (workspace_id);

-- RLS activ, fără politici: doar serverul (cheia secretă) citește tabelul.
-- Browserul (anon) nu poate lista domeniile / workspace-urile.
alter table public.workspace_domains enable row level security;

-- 2) Tema per workspace (culori, brand, titlu). Gol = tema implicită din globals.css.
alter table public.workspaces add column if not exists theme jsonb not null default '{}'::jsonb;

-- 3) Domeniul de producție actual rămâne pe i-PrintSmart (fără regresie).
insert into public.workspace_domains (host, workspace_id)
values ('super-admin-six-bice.vercel.app', '94722422-b939-44d0-a580-7420eebbb554')
on conflict (host) do nothing;

-- 3b) Titlul și descrierea i-PrintSmart (înainte erau fixe în cod).
update public.workspaces
   set theme = theme || jsonb_build_object('title', 'i-printsmart', 'description', 'Imprimare personalizata profesionala')
 where id = '94722422-b939-44d0-a580-7420eebbb554' and not (theme ? 'title');

-- ⚠️ Orice alt domeniu de producție din Vercel → Domains trebuie adăugat aici, altfel arată 404.

-- 4) Verificare: slug-urile sunt folosite pe preview cu ?ws=<slug> (ex. ?ws=gama).
select id, name, slug, theme from public.workspaces order by name;
select * from public.workspace_domains;
