-- Limite intermediare pentru comenzile create din browser (25.11.2026), până la pasul 5
-- (comandă + preț calculat pe server). Rulat de Sergiu în Supabase SQL Editor. Tranzacție.

begin;

-- 1) Valorile tehnice le pune serverul, nu browserul (doar pentru cereri anon/authenticated).
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
  end if;
  return new;
end;
$$;

revoke all on function public.orders_insert_valori_server() from public, anon, authenticated;

drop trigger if exists orders_insert_valori_server on public.orders;
create trigger orders_insert_valori_server
  before insert on public.orders
  for each row execute function public.orders_insert_valori_server();

-- 2) Politica de inserare: aceleași reguli + total pozitiv și limite de lungime.
drop policy if exists "orders insert checkout" on public.orders;
create policy "orders insert checkout"
  on public.orders for insert
  to anon, authenticated
  with check (
    status = 'new'
    and payment_status = 'pending'
    and (user_id is null or user_id = auth.uid())
    and exists (select 1 from public.workspaces w where w.id = workspace_id)
    and total_amount > 0 and total_amount <= 1000000
    and char_length(customer_email) <= 254
    and coalesce(char_length(customer_name), 0) <= 200
    and coalesce(char_length(customer_phone), 0) <= 40
    and coalesce(char_length(currency), 0) <= 8
    and coalesce(char_length(delivery_method), 0) <= 40
    and coalesce(char_length(payment_method), 0) <= 40
    and coalesce(char_length(notes), 0) <= 20000
    and coalesce(pg_column_size(shipping_address), 0) <= 4000
  );

commit;
