-- Reparație urgentă RLS (25.11.2026) — înainte de pasul 2.
-- Se rulează DOAR după ce codul (ruta /api/admin/orders/[id]/status) e live pe producție.
-- Rulat de Sergiu în Supabase SQL Editor. Tranzacție: totul sau nimic.

begin;

-- 1) user_roles: nimeni nu mai scrie roluri din browser; fiecare își vede doar rândurile proprii.
drop policy if exists "Super admin vede tot" on public.user_roles;
create policy "user_roles citire proprie"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

-- 2) orders: fără citire și fără modificare din browser (datele clienților nu mai sunt publice).
drop policy if exists "Public read orders" on public.orders;
drop policy if exists "Public update orders" on public.orders;

-- 3) orders: inserarea din checkout rămâne (până la pasul 5), dar doar comandă nouă, neplătită,
--    într-un workspace existent, fără a o lega de alt utilizator.
drop policy if exists "Public insert orders" on public.orders;
create policy "orders insert checkout"
  on public.orders for insert
  to anon, authenticated
  with check (
    status = 'new'
    and payment_status = 'pending'
    and (user_id is null or user_id = auth.uid())
    and exists (select 1 from public.workspaces w where w.id = workspace_id)
  );

commit;

-- Verificare după rulare:
-- select tablename, policyname, cmd, roles, qual, with_check
-- from pg_policies where schemaname = 'public' and tablename in ('orders','user_roles');
