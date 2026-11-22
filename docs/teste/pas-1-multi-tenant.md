# Teste adversariale — Pasul 1: fundația multi-tenant (cap. 13)

Regula: 00-reguli.md „Harta activităților și teste adversariale” + 11.11. Lista s-a scris înainte de cod (aprobată 22.11.2026).
Branch: `pas-1-multi-tenant`. SQL: `supabase/sql/2026-11-22-pas-1-workspace-domains.sql` (rulat de Sergiu).

## Ce face pasul
- Domeniul cererii → `workspace_domains` → workspace (`lib/tenant.ts`); domeniu necunoscut → „Site indisponibil”.
- Preview / local: `?ws=<slug>` → cookie `preview_ws`; ignorat în producție.
- ID-urile de workspace scoase din cod (10 fișiere); GET `/api/products`, `/api/categories` nu mai acceptă `?workspace=`.
- Admin: `active_workspace` acceptat doar dacă utilizatorul are rol în acel workspace.
- `POST /api/products`: login + rol admin / super_admin; `workspace_id` din corp ignorat.
- Temă: `workspaces.theme` (culori validate, brand, titlu).

## Atacuri (stare: ⏳ netestat · ✅ trecut · ❌ căzut · 🛠 reparat)
| # | Atac | Așteptat | Stare |
|---|---|---|---|
| M1 | Host necunoscut, majuscule, cu port, `www.`, punct final, gol, IPv6, caractere ciudate | fără 500; fără date ale altui workspace | ✅ |
| M2 | Preview fără `?ws` și fără rând în tabel | „Site indisponibil”, nu cădere | ✅ |
| M3 | `?ws=` în producție | ignorat | ✅ (+ refuz explicit pe VERCEL_ENV=production) |
| M4 | `?ws=` cu valori rău intenționate (injecție, foarte lung, slug inexistent) | ignorat / indisponibil | ✅ |
| M5 | Admin: `active_workspace` setat manual pe un workspace fără rol | se folosește un workspace permis; niciodată cel cerut | ✅ |
| M6 | Admin: utilizator fără niciun rol | „Nu ai acces”, fără date | ✅ |
| M7 | `POST /api/products` fără login / operator / `workspace_id` falsificat / JSON invalid / slug sau preț invalid | 401 / 403 / workspace corect / 400 | 🛠 preț acceptat doar ca număr sau zecimal; 403 pentru logat fără rol |
| M8 | Căutare în cod după cele 3 ID-uri | zero apariții | ✅ |
| M9 | Workspace nou adăugat doar în DB (rând în `workspaces` + `workspace_domains`) | merge fără cod | ✅ rutare/temă · ⚠️ textele home/footer rămân i-PrintSmart → pasul 4 |
| M10 | Cache: un domeniu nu primește workspace-ul altuia; eroare DB nu se ține în cache | corect | ✅ |
| M11 | Temă: valori CSS rău intenționate în `theme.colors` / `brand` | ignorate, fără injecție | ✅ |
| M12 | i-PrintSmart pe domeniul de producție: home, catalog, produs, coș, checkout, admin | identic cu înainte (♻️) | 🛠 titlu/descriere i-PrintSmart în SQL · ⏳ test pe producție |
| M13 | Cheia secretă nu ajunge în browser (`lib/tenant.ts` doar pe server) | absentă din bundle-ul client | ✅ · `server-only` neinstalat (fără dependență nouă) |

## Constatări în afara pasului (de rezolvat în pașii următori)
- Checkout inserează comanda din browser, cu totalul calculat în browser → pasul 5 (preț și comandă pe server).
- `OrderStatusUpdater` schimbă statusul din browser cu clientul anon → depinde de RLS pe `orders`; de verificat la pasul 2 (schema + RLS).

## Rezultate
### Echipa roșie — 22.11.2026 (agent separat, cod citit + fuzz local)
- M1–M11, M13 trecute; M12 parțial căzut (titlu/descriere) → reparat în SQL.
- N1 🔴 (existent dinainte): XSS / redirect deschis în `/auth?redirect=` → 🛠 doar căi interne.
- N2 🟠: reîmprospătarea sesiunii se pierdea în proxy → 🛠 un singur răspuns + `getUser`.
- N3 🟡: CHECK SQL accepta punct inițial/final, `..` → 🛠.
- N4 🟡: workspace implicit în admin fără ordine stabilă → 🛠 `.order('workspace_id')` în server și selector.
- N5 🟡: „Site indisponibil” cu 200 → 🛠 404 (`notFound`); cookie preview `secure` doar în afara dev.
- N6 🟡: `?workspace=` ignorat acum de API — niciun apelant în repo; consumatori externi ❓ (Sergiu).
- N7: dacă SQL-ul nu e rulat înainte de merge, tot site-ul dă 404 → SQL obligatoriu înainte.
- După reparații: `tsc` ✅, build producție ✅, zero ID-uri hardcodate.

### A doua trecere în practică — ⏳
Necesită: SQL rulat · variabilele Supabase activate și pentru **Preview** în Vercel · teste pe URL-ul de preview (`?ws=gama`, `?ws=i-printsmart`, fără `?ws`).
