# Arhitectură

## Concept

- **Super Admin Universal Multi-Tenant:** un singur panou admin pentru toate afacerile; fiecare afacere = workspace cu date izolate (`workspace_id` NOT NULL pe toate tabelele, RLS activ).
- Folosirea internă (i-PrintSmart, gama.md, Landing #3) = faza de testare a produsului SaaS, oferit ulterior white-label clienților externi.
- Site-urile publice și adminul sunt în același repo/aplicație Next.js; API Gateway central (injectare `workspace_id` din JWT) — planificat (6.15).
- **CRM** — sistem extern separat (`gamamd/crm-gamamd`), consumat prin API/webhook (6.16).
- **Moy Sklad** — ERP central, o organizație, magazine/depozite separate per afacere (filtrare `store_id`) — integrare planificată (8.9).

## Stack (verificat în `package.json`, 05.10.2026)

- Next.js **16.2.6** (App Router, Turbopack), React 19.2.4, TypeScript
- Supabase: `@supabase/supabase-js` 2.x + `@supabase/ssr` (Auth, Postgres, Storage)
- `next-intl` 4 — rute `/ro` `/ru` `/en`, texte în `messages/`
- Zustand 5 (cu persist) — coș, workspace
- `react-image-crop` 11 — crop în editorul foto
- `fabric` 7 — instalat, nefolosit (decizia 5.1 deschisă)
- Tailwind CSS; font Space Grotesk; paletă brand i-PrintSmart în `app/globals.css`

## Structura repo (`gamamd/super-admin`, branch `main`)

- `app/[locale]/` — pagini publice: home, `catalog`, `catalog/[slug]`, `cos`, `checkout`, `multumim`, `auth`
- `app/[locale]/admin/` — admin: dashboard, `comenzi/[id]`, `produse`, `produse/nou`; `layout.tsx` cu sidebar + selector workspace
- `app/api/` — `products`, `categories`
- `app/components/` — Header, Footer, AddToCartButton, OrderStatusUpdater, ProductEditor, ProductEditorWrapper, WorkspaceSelector
- `lib/` — `supabase.ts` (client browser), `supabase-admin.ts` (doar server), `queries.ts`, `store/cart.ts`, `store/workspace.ts`
- `proxy.ts` — protecție rute `/admin` + i18n (exclude `/api/`)
- `i18n/`, `messages/` — traduceri RO/RU/EN
- `docs/` — această documentație (nu declanșează build)

## Supabase

- Proiect `super-admin` (West EU, Ireland), ID `cpkvrnzjqwqbfuvnjkgd`, plan gratuit (se pauzează la inactivitate).
- Workspace-uri:
  - i-PrintSmart — `94722422-b939-44d0-a580-7420eebbb554`
  - Gama — `8a8cae41-1f78-45fa-9485-011722a4a9aa`
  - Landing #3 — `1ed9b3b5-abc4-46f0-b0e3-e379335e26b3`
- Tabele confirmate: `workspaces`, `user_roles` (super_admin / admin / operator), `categories`, `products`, `orders` (+ restul din 2.2 — de verificat).
- `products` extins: `print_width_mm`, `print_height_mm`, `mockup_url`, `editor_type`, `available_sizes` (JSONB), `available_materials` (JSONB).
- Workspace-ul activ în admin: cookie `active_workspace` (nu Zustand).
- Schema completă: documentul Drive „Schema DB — Super Admin Universal Multi-Tenant”.

## Vercel

- Cont `gamamd1`, plan Hobby (de reevaluat la lansare). Deploy automat la fiecare commit pe `main`.
- **Hosting decis: Vercel** (nu Railway, nu Hetzner).

## Afaceri / domenii

- i-PrintSmart — `i-printsmart.com` achiziționat; `.md` + `.ro` de achiziționat. Piețe: RM (primară), RO (secundară). Limbi: RO + RU (+ EN).
- gama.md — site live pe Cartum (Horoshop); migrare amânată (cap. 13).
- Landing #3 — în definire.
