-- Pasul 2 (cap. 13) — schema catalog + compoziții + stoc + comenzi, cu RLS. 25.11.2026.
-- Atacuri: docs/teste/pas-2-schema-gama.md (S1–S13). Rulat în Supabase SQL Editor. Tranzacție, idempotent.
--
-- Principiu de acces: toate tabelele noi au RLS activ și NICIO politică → browserul (anon/authenticated)
-- nu citește și nu scrie nimic; doar serverul (cheia secretă) lucrează cu ele.
-- Workspace-first: fiecare legătură între tabele trece prin (id, workspace_id) → imposibil de amestecat
-- date din workspace-uri diferite, chiar și din greșeală pe server.
-- Codul existent (i-PrintSmart) nu se schimbă: coloanele noi au valori implicite, produsele fără ms_id
-- rămân vizibile ca înainte.

begin;

-- 0) Chei compuse (id, workspace_id) pe tabelele existente, pentru legăturile de mai jos.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'products_id_workspace_key') then
    alter table public.products add constraint products_id_workspace_key unique (id, workspace_id);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'orders_id_workspace_key') then
    alter table public.orders add constraint orders_id_workspace_key unique (id, workspace_id);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'categories_id_workspace_key') then
    alter table public.categories add constraint categories_id_workspace_key unique (id, workspace_id);
  end if;
end $$;

-- 1) Mapele MoySklad → categoriile site-ului. Se citesc doar mapele cu is_synced = true.
create table if not exists public.ms_folders (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  ms_id         text not null check (char_length(ms_id) between 1 and 64),
  parent_ms_id  text check (char_length(parent_ms_id) <= 64),
  ms_path       text check (char_length(ms_path) <= 1000),
  name          text not null check (char_length(name) between 1 and 255),
  display_name  text check (char_length(display_name) <= 255),
  category_id   uuid,
  is_synced     boolean not null default false,
  sort_order    integer not null default 0,
  synced_at     timestamptz,
  created_at    timestamptz not null default now(),
  unique (workspace_id, ms_id),
  unique (id, workspace_id),
  foreign key (category_id, workspace_id) references public.categories(id, workspace_id) on delete set null (category_id)
);

-- 2) Produse: legătura cu MoySklad. Produsele fără ms_id (ex. i-PrintSmart) rămân ca înainte.
alter table public.products add column if not exists ms_id            text check (char_length(ms_id) <= 64);
alter table public.products add column if not exists ms_external_code text check (char_length(ms_external_code) <= 255);
alter table public.products add column if not exists ms_type          text check (ms_type in ('product', 'bundle', 'variant', 'service'));
alter table public.products add column if not exists ms_folder_id     uuid;
alter table public.products add column if not exists made_to_order    boolean not null default false;
alter table public.products add column if not exists ms_synced_at     timestamptz;
create unique index if not exists products_workspace_ms_id_key on public.products (workspace_id, ms_id) where ms_id is not null;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'products_ms_folder_fk') then
    alter table public.products add constraint products_ms_folder_fk
      foreign key (ms_folder_id, workspace_id) references public.ms_folders(id, workspace_id) on delete set null (ms_folder_id);
  end if;
end $$;

-- 3) Rețeta: componentele unui produs-compoziție. „Obligatoriu” se ține pe site (decizie 25.11.2026).
create table if not exists public.product_components (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  product_id    uuid not null,
  component_id  uuid not null,
  quantity      numeric(12,3) not null check (quantity > 0 and quantity <= 10000),
  is_required   boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  unique (product_id, component_id),
  check (product_id <> component_id),
  foreign key (product_id, workspace_id)   references public.products(id, workspace_id) on delete cascade,
  foreign key (component_id, workspace_id) references public.products(id, workspace_id) on delete cascade
);
create index if not exists product_components_component_idx on public.product_components (component_id);

-- 4) Stocul copiat din MoySklad (polling) + rezervările site-ului.
create table if not exists public.stock_cache (
  product_id    uuid primary key,
  workspace_id  uuid not null,
  stock         numeric(14,3) not null default 0,
  reserved      numeric(14,3) not null default 0 check (reserved >= 0),
  synced_at     timestamptz not null default now(),
  foreign key (product_id, workspace_id) references public.products(id, workspace_id) on delete cascade
);

-- 5) Etichete pe site (ocazii, filtre, sezoane), fără legătură cu MoySklad.
create table if not exists public.tags (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  kind          text not null check (kind in ('ocazie', 'filtru', 'sezon')),
  slug          text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  name          text not null check (char_length(name) between 1 and 120),
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  unique (workspace_id, kind, slug),
  unique (id, workspace_id)
);
create table if not exists public.product_tags (
  product_id    uuid not null,
  tag_id        uuid not null,
  workspace_id  uuid not null,
  primary key (product_id, tag_id),
  foreign key (product_id, workspace_id) references public.products(id, workspace_id) on delete cascade,
  foreign key (tag_id, workspace_id)     references public.tags(id, workspace_id) on delete cascade
);

-- 6) Pozele: doar chei din depozitul propriu (bucket „product-images”), prefixate cu workspace_id. Fără URL-uri.
create table if not exists public.product_images (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null,
  product_id    uuid not null,
  storage_path  text not null check (
                  char_length(storage_path) <= 400
                  and storage_path ~ '^[0-9a-f-]{36}/[A-Za-z0-9_./-]+$'
                  and storage_path !~ '\.\.' and storage_path !~ '//'
                  and split_part(storage_path, '/', 1) = workspace_id::text),
  source        text not null default 'moysklad' check (source in ('moysklad', 'generat', 'manual')),
  ms_image_ref  text check (char_length(ms_image_ref) <= 500),
  alt_text      text check (char_length(alt_text) <= 300),
  width         integer check (width between 1 and 20000),
  height        integer check (height between 1 and 20000),
  is_primary    boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  unique (workspace_id, storage_path),
  foreign key (product_id, workspace_id) references public.products(id, workspace_id) on delete cascade
);
create unique index if not exists product_images_one_primary on public.product_images (product_id) where is_primary;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
-- Fără politici pe storage.objects pentru acest bucket: citire publică prin URL, scriere doar de pe server.

-- 7) Zile blocate pentru livrare.
create table if not exists public.blocked_days (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  day           date not null,
  reason        text check (char_length(reason) <= 200),
  created_at    timestamptz not null default now(),
  unique (workspace_id, day)
);

-- 8) Comenzi: câmpuri noi (livrare, tip plată, rezervare stoc, legătura cu MoySklad).
alter table public.orders add column if not exists delivery_date      date;
alter table public.orders add column if not exists delivery_slot      text check (char_length(delivery_slot) <= 40);
alter table public.orders add column if not exists payment_type       text check (payment_type in ('online', 'la_livrare'));
alter table public.orders add column if not exists stock_reservation  text not null default 'nerezervat'
                                                   check (stock_reservation in ('nerezervat', 'rezervat', 'eliberat', 'consumat'));
alter table public.orders add column if not exists stock_reserved_at  timestamptz;
alter table public.orders add column if not exists ms_order_id        text check (char_length(ms_order_id) <= 64);

-- Inserarea din browser (până la pasul 5) nu poate pune valorile tehnice noi.
create or replace function public.orders_insert_valori_server()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if current_user in ('anon', 'authenticated') then
    new.id := gen_random_uuid();
    new.order_number := 'ORD-' || (floor(extract(epoch from clock_timestamp()) * 1000))::bigint::text;
    new.created_at := now();
    new.updated_at := now();
    new.stock_reservation := 'nerezervat';
    new.stock_reserved_at := null;
    new.ms_order_id := null;
  end if;
  return new;
end;
$$;
revoke all on function public.orders_insert_valori_server() from public, anon, authenticated;

-- 9) Liniile comenzii — instantaneu (nume, preț) înghețat la plasare.
create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null,
  order_id      uuid not null,
  product_id    uuid,
  product_name  text not null check (char_length(product_name) between 1 and 255),
  ms_id         text check (char_length(ms_id) <= 64),
  unit_price    numeric(12,2) not null check (unit_price >= 0 and unit_price <= 1000000),
  quantity      integer not null check (quantity between 1 and 1000),
  line_total    numeric(14,2) not null,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  check (line_total = round(unit_price * quantity, 2)),
  unique (id, workspace_id),
  foreign key (order_id, workspace_id)   references public.orders(id, workspace_id) on delete cascade,
  foreign key (product_id, workspace_id) references public.products(id, workspace_id) on delete set null (product_id)
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- 10) Compoziția editată de client (și fișa de producție): fiecare componentă, cu ce s-a schimbat.
create table if not exists public.order_item_components (
  id             uuid primary key default gen_random_uuid(),
  workspace_id   uuid not null,
  order_item_id  uuid not null,
  component_id   uuid,
  component_name text not null check (char_length(component_name) between 1 and 255),
  ms_id          text check (char_length(ms_id) <= 64),
  quantity       numeric(12,3) not null check (quantity >= 0 and quantity <= 10000),
  unit_price     numeric(12,2) not null check (unit_price >= 0 and unit_price <= 1000000),
  is_required    boolean not null default false,
  change         text not null default 'original' check (change in ('original', 'modificat', 'adaugat', 'eliminat')),
  sort_order     integer not null default 0,
  check ((change = 'eliminat') = (quantity = 0)),
  check (not (is_required and quantity = 0)),
  foreign key (order_item_id, workspace_id) references public.order_items(id, workspace_id) on delete cascade,
  foreign key (component_id, workspace_id)  references public.products(id, workspace_id) on delete set null (component_id)
);
create index if not exists order_item_components_item_idx on public.order_item_components (order_item_id);

-- 10b) „Obligatoriu” se ia din rețetă, nu din ce trimite cererea → eliminarea unui obligatoriu e respinsă.
create or replace function public.oic_obligatoriu_din_reteta()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if exists (
    select 1 from public.order_items oi
      join public.product_components pc on pc.product_id = oi.product_id
     where oi.id = new.order_item_id and pc.component_id = new.component_id and pc.is_required
  ) then
    new.is_required := true;
  end if;
  return new;
end;
$$;
revoke all on function public.oic_obligatoriu_din_reteta() from public, anon, authenticated;
drop trigger if exists oic_obligatoriu_din_reteta on public.order_item_components;
create trigger oic_obligatoriu_din_reteta
  before insert on public.order_item_components
  for each row execute function public.oic_obligatoriu_din_reteta();

-- 11) Înghețare. O comandă e „înghețată” dacă nu mai e „new”, dacă are stoc rezervat sau dacă a avut
--     vreodată o schimbare de status (deci întoarcerea la „new” nu o dezgheață). Linii, compoziție, total,
--     ștergere: toate refuzate pe comenzi înghețate. Singura modificare permisă pe linii: golirea legăturii
--     la produs când produsul e șters (instantaneul — nume, preț — rămâne).
create or replace function public.comanda_e_inghetata(p_order_id uuid)
returns boolean
language plpgsql
stable
set search_path = public, pg_temp
as $$
begin
  return exists (select 1 from public.orders o
                  where o.id = p_order_id
                    and (coalesce(o.status, 'new') <> 'new' or o.stock_reservation <> 'nerezervat'))
      or exists (select 1 from public.order_status_history h where h.order_id = p_order_id);
end;
$$;
revoke all on function public.comanda_e_inghetata(uuid) from public, anon, authenticated;

create or replace function public.comanda_inghetata()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_order uuid;
  v_col   text;
begin
  if tg_table_name = 'order_items' then
    v_order := coalesce(new.order_id, old.order_id);
  else
    select oi.order_id into v_order from public.order_items oi
     where oi.id = coalesce(new.order_item_id, old.order_item_id);
  end if;

  if tg_op = 'UPDATE' then
    v_col := case tg_table_name when 'order_items' then 'product_id' else 'component_id' end;
    if (to_jsonb(new) ->> v_col) is null
       and (to_jsonb(new) - v_col) = (to_jsonb(old) - v_col) then
      return new;
    end if;
    raise exception 'Liniile comenzii sunt înghețate (%).', tg_table_name using errcode = 'P0001';
  end if;

  if v_order is not null and public.comanda_e_inghetata(v_order) then
    raise exception 'Comanda e înghețată; liniile nu se mai adaugă și nu se șterg (%).', tg_table_name
      using errcode = 'P0001';
  end if;
  return coalesce(new, old);
end;
$$;
revoke all on function public.comanda_inghetata() from public, anon, authenticated;
drop trigger if exists order_items_inghetat on public.order_items;
create trigger order_items_inghetat
  before insert or update or delete on public.order_items
  for each row execute function public.comanda_inghetata();
drop trigger if exists order_item_components_inghetat on public.order_item_components;
create trigger order_item_components_inghetat
  before insert or update or delete on public.order_item_components
  for each row execute function public.comanda_inghetata();

-- Totalul și workspace-ul: workspace-ul nu se schimbă niciodată; totalul nu se schimbă pe comandă înghețată.
create or replace function public.orders_inghetare()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    if public.comanda_e_inghetata(old.id) then
      raise exception 'O comandă confirmată nu se șterge.' using errcode = 'P0001';
    end if;
    return old;
  end if;
  if new.workspace_id is distinct from old.workspace_id then
    raise exception 'Workspace-ul comenzii nu se schimbă.' using errcode = 'P0001';
  end if;
  if new.total_amount is distinct from old.total_amount and public.comanda_e_inghetata(old.id) then
    raise exception 'Totalul comenzii e înghețat după confirmare.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
revoke all on function public.orders_inghetare() from public, anon, authenticated;
drop trigger if exists orders_inghetare on public.orders;
create trigger orders_inghetare
  before update or delete on public.orders
  for each row execute function public.orders_inghetare();

-- 12) Istoricul statusurilor (cine, când, din ce în ce). Regulile de tranziție: ❓ decizie separată.
create table if not exists public.order_status_history (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null,
  order_id      uuid not null,
  old_status    text,
  new_status    text not null,
  changed_by    uuid,
  changed_at    timestamptz not null default now(),
  foreign key (order_id, workspace_id) references public.orders(id, workspace_id) on delete cascade
);
create index if not exists order_status_history_order_idx on public.order_status_history (order_id);

create or replace function public.orders_istoric_status()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.status is distinct from old.status then
    insert into public.order_status_history (workspace_id, order_id, old_status, new_status, changed_by)
    values (new.workspace_id, new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;
revoke all on function public.orders_istoric_status() from public, anon, authenticated;
drop trigger if exists orders_istoric_status on public.orders;
create trigger orders_istoric_status
  after update of status on public.orders
  for each row execute function public.orders_istoric_status();

-- 13) Stoc: necesarul unei comenzi + rezervare atomică (la plată / la confirmare pentru plata la livrare).
--     Ce s-a rezervat efectiv se ține pe rânduri (order_stock_reservations); eliberarea scade exact acele
--     rânduri, indiferent de ce s-a întâmplat cu liniile între timp.
create table if not exists public.order_stock_reservations (
  order_id      uuid not null,
  product_id    uuid not null,
  workspace_id  uuid not null,
  qty           numeric(14,3) not null check (qty > 0),
  created_at    timestamptz not null default now(),
  primary key (order_id, product_id),
  foreign key (order_id, workspace_id) references public.orders(id, workspace_id) on delete cascade
);

create or replace function public.necesar_stoc_comanda(p_order_id uuid)
returns table (product_id uuid, qty numeric)
language sql
stable
set search_path = public, pg_temp
as $$
  select x.pid, sum(x.q)
    from (
      select c.component_id as pid, c.quantity * oi.quantity as q
        from public.order_items oi
        join public.order_item_components c on c.order_item_id = oi.id
       where oi.order_id = p_order_id and c.quantity > 0 and c.component_id is not null
      union all
      select oi.product_id, oi.quantity
        from public.order_items oi
       where oi.order_id = p_order_id and oi.product_id is not null
         and not exists (select 1 from public.order_item_components c where c.order_item_id = oi.id)
    ) x
   group by x.pid
   order by x.pid;
$$;

create or replace function public.rezerva_stoc(p_order_id uuid)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  o public.orders%rowtype;
  r record;
begin
  select * into o from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'Comandă inexistentă.' using errcode = 'P0002';
  end if;
  if o.stock_reservation = 'rezervat' then
    return 'deja_rezervat';
  end if;
  if o.stock_reservation <> 'nerezervat' then
    raise exception 'Rezervare imposibilă din starea %.', o.stock_reservation using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.order_items where order_id = o.id) then
    raise exception 'Comanda nu are linii.' using errcode = 'P0001';
  end if;
  -- rețeta cu componente obligatorii: ele trebuie să fie ÎNTOTDEAUNA în compoziție, cu cantitate > 0
  if exists (
    select 1 from public.order_items oi
      join public.product_components pc on pc.product_id = oi.product_id and pc.is_required
     where oi.order_id = o.id
       and not exists (select 1 from public.order_item_components c
                        where c.order_item_id = oi.id and c.component_id = pc.component_id and c.quantity > 0)
  ) then
    raise exception 'Lipsește o componentă obligatorie.' using errcode = 'P0001';
  end if;

  for r in select * from public.necesar_stoc_comanda(o.id) loop
    update public.stock_cache s
       set reserved = s.reserved + r.qty
     where s.product_id = r.product_id and s.workspace_id = o.workspace_id
       and s.stock - s.reserved >= r.qty;
    if found then
      insert into public.order_stock_reservations (order_id, product_id, workspace_id, qty)
      values (o.id, r.product_id, o.workspace_id, r.qty);
    else
      -- fără stoc gestionat (fără ms_id), făcut la comandă sau serviciu: nu se rezervă și nu se înregistrează
      if exists (select 1 from public.products p
                  where p.id = r.product_id and p.workspace_id = o.workspace_id
                    and (p.ms_id is null or p.made_to_order or p.ms_type = 'service')) then
        continue;
      end if;
      raise exception 'Stoc insuficient.' using errcode = 'P0001', detail = r.product_id::text;
    end if;
  end loop;

  update public.orders set stock_reservation = 'rezervat', stock_reserved_at = now() where id = o.id;
  return 'rezervat';
end;
$$;

-- Eliberare (plata nu a venit / anulare) sau consum (comanda a intrat în MoySklad, care o rezervă el).
create or replace function public.elibereaza_stoc(p_order_id uuid, p_stare text default 'eliberat')
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  o public.orders%rowtype;
  r record;
begin
  if p_stare not in ('eliberat', 'consumat') then
    raise exception 'Stare invalidă.' using errcode = 'P0001';
  end if;
  select * into o from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'Comandă inexistentă.' using errcode = 'P0002';
  end if;
  if o.stock_reservation <> 'rezervat' then
    return 'nimic_de_eliberat';
  end if;
  for r in select * from public.order_stock_reservations where order_id = o.id loop
    update public.stock_cache s
       set reserved = greatest(s.reserved - r.qty, 0)
     where s.product_id = r.product_id and s.workspace_id = o.workspace_id;
  end loop;
  delete from public.order_stock_reservations where order_id = o.id;
  update public.orders set stock_reservation = p_stare where id = o.id;
  return p_stare;
end;
$$;

revoke all on function public.necesar_stoc_comanda(uuid)   from public, anon, authenticated;
revoke all on function public.rezerva_stoc(uuid)           from public, anon, authenticated;
revoke all on function public.elibereaza_stoc(uuid, text)  from public, anon, authenticated;

-- 14) Catalogul vizibil: fără stoc → nu apare (S8). Doar serverul îl citește.
--     Atenție: tabelul products rămâne citibil public (acceptat dinainte); vederea e sursa pentru site.
create or replace view public.catalog_produse
with (security_invoker = true) as
select p.*,
       (p.made_to_order) as la_comanda
  from public.products p
  left join public.stock_cache s on s.product_id = p.id
 where coalesce(p.is_active, true)
   and coalesce(p.ms_type, 'product') <> 'service'
   and (p.ms_folder_id is null
        or exists (select 1 from public.ms_folders f where f.id = p.ms_folder_id and f.is_synced))
   and (
         p.ms_id is null                       -- produse fără MoySklad (ex. i-PrintSmart): ca înainte
      or p.made_to_order
      or (not exists (select 1 from public.product_components pc where pc.product_id = p.id)
          and coalesce(s.stock - s.reserved, 0) > 0)
      or (exists (select 1 from public.product_components pc where pc.product_id = p.id)
          and not exists (
            select 1
              from public.product_components pc
              join public.products cp on cp.id = pc.component_id
              left join public.stock_cache cs on cs.product_id = pc.component_id
             where pc.product_id = p.id and pc.is_required
               and (not coalesce(cp.is_active, true)
                    or (cp.ms_id is not null and not cp.made_to_order
                        and coalesce(cs.stock - cs.reserved, 0) < pc.quantity))))
       );

-- 15) RLS activ pe tot ce e nou, fără politici; fără drepturi pentru browser.
alter table public.ms_folders            enable row level security;
alter table public.product_components    enable row level security;
alter table public.stock_cache           enable row level security;
alter table public.tags                  enable row level security;
alter table public.product_tags          enable row level security;
alter table public.product_images        enable row level security;
alter table public.blocked_days          enable row level security;
alter table public.order_items           enable row level security;
alter table public.order_item_components enable row level security;
alter table public.order_status_history  enable row level security;
alter table public.order_stock_reservations enable row level security;

revoke all on public.ms_folders, public.product_components, public.stock_cache, public.tags,
              public.product_tags, public.product_images, public.blocked_days, public.order_items,
              public.order_item_components, public.order_status_history, public.order_stock_reservations,
              public.catalog_produse
  from anon, authenticated;

commit;

-- Verificare după rulare:
-- select tablename, rowsecurity from pg_tables where schemaname = 'public' order by 1;
-- select * from pg_policies where schemaname = 'public' and tablename in
--   ('ms_folders','product_components','stock_cache','tags','product_tags','product_images',
--    'blocked_days','order_items','order_item_components','order_status_history','order_stock_reservations');  -- așteptat: 0 rânduri
