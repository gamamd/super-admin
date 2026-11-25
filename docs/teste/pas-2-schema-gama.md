# Teste adversariale — Pasul 2: schema DB gama + RLS (cap. 13)

Regula: 00-reguli.md „Harta activităților și teste adversariale”. Lista se scrie înainte de cod (aprobată 25.11.2026).
SQL: `supabase/sql/` (de rulat de Sergiu, după aprobare). Model: Opus.

## Ce face pasul
- Rețetă cu componente (cantitate, obligatoriu) · stoc pe componente · compoziția editată înghețată în comandă și în fișa de producție · depozit separat de poze · mape MoySklad → categorii · etichete (ocazii, filtre, sezoane) · zile blocate · RLS pe `orders`.
- Decizie 25.11.2026: marcajul „obligatoriu” se ține **pe site** (`product_components.is_required`), nu în rețeta MoySklad.

## Tabele propuse (toate cu `workspace_id NOT NULL` + RLS)
`ms_folders` · `product_components` · `stock_cache` · `product_tags` · `product_images` · `order_items` · `order_item_components` · `blocked_days` · câmpuri noi pe `orders` (slot/zi livrare, tip plată, stare rezervare stoc).

## Atacuri (stare: ⏳ netestat · ✅ trecut · ❌ căzut · 🛠 reparat)
| # | Atac | Așteptat | Stare |
|---|---|---|---|
| S1 | Anon citește sau scrie în tabelele noi | doar citire pe catalog public; nimic pe comenzi | ✅ 25.11.2026 |
| S2 | Admin din workspace A citește/scrie date din B | refuz pe toate tabelele | ✅ 25.11.2026 |
| S3 | Insert cu `workspace_id` falsificat | refuz (RLS `WITH CHECK`) | ✅ 25.11.2026 |
| S4 | `orders`: anon schimbă statusul (`OrderStatusUpdater`) | refuz; update doar pe server sau admin cu rol | ❌ → 🛠 25.11.2026 (rută server + RLS) · 🔍 echipa roșie ✅ |
| S5 | Client modifică prețul/totalul/componentele după plasare | imposibil; compoziția e înghețată | 🛠 ✅ 25.11.2026 |
| S6 | Eliminarea unei componente `is_required` în compoziție | respinsă pe server | ✅ 25.11.2026 |
| S7 | Cantitate 0, negativă, uriașă, zecimală; componentă din alt workspace | CHECK/FK resping | ✅ 25.11.2026 |
| S8 | Produs fără stoc | nu apare în catalog, nici în vederile derivate | ✅ 25.11.2026 |
| S9 | Două comenzi pe același ultim stoc | rezervarea la plată e atomică; reușește una singură | ✅ 25.11.2026 |
| S10 | Ștergere produs/componentă folosită în comenzi vechi | comenzile istorice rămân intacte (snapshot) | ✅ 25.11.2026 |
| S11 | RLS recursiv (ca la `user_roles`) | fără recursivitate | ✅ 25.11.2026: `user_roles` doar SELECT propriu, fără auto-promovare; 0 politici pe tabelele noi |
| S12 | i-PrintSmart (♻️): catalog, coș, checkout, admin | identic cu înainte | ✅ 25.11.2026 |
| S13 | URL extern/injectat în `product_images` | doar chei din depozitul propriu | ✅ 25.11.2026 |

## Rezultate
### Reparație urgentă înainte de pas — 25.11.2026
- Găsit în `pg_policies`: `orders` deschis public (citire, modificare, inserare), `user_roles` cu scriere pe rândul propriu. Reparat: vezi `03-bugs-lectii.md` („RLS deschis pe `orders` și `user_roles`”).
- Echipa roșie: acces între workspace-uri, CSRF, PostgREST anon, auto-promovare → rezistă. Rămase: INSERT anon în `orders` (limitat, definitiv la pasul 5); tranziții de status + istoric (pasul 2).
- Restul atacurilor: după implementarea schemei.

### Schema scrisă, testată, rulată — 25.11.2026 (Opus; rulat de Claude în Supabase SQL Editor, cu acordul lui Sergiu)
- SQL: `supabase/sql/2026-11-25-pas-2-schema-gama.sql` (tranzacție, idempotentă; rulată de 2 ori pe Postgres local fără efecte duble). Atacuri: `supabase/sql/tests/pas-2-atacuri.sql` (tranzacție anulată la final; în baza reală nu rămâne nimic).
- Local: 73 de teste, 0 căzute, plus test real de concurență (două comenzi pe ultimul stoc → una reușește, cealaltă e respinsă, `reserved` corect).
- Echipa roșie, trecerea 1 (agent separat) — constatări reproduse, toate 🛠 reparate:
  - 🔴 A1: rezervarea rămânea blocată după ștergerea unei linii → tabel `order_stock_reservations` (se scade exact ce s-a rezervat) + linii înghețate cât timp comanda e rezervată.
  - 🔴 A4: eliberarea fura rezervarea altei comenzi pe produse „la comandă” → același tabel.
  - 🟠 A2: INSERT de linii pe comandă confirmată trecea → trigger și pe INSERT.
  - 🟠 A3: întoarcerea statusului la „new” dezgheța comanda → „înghețat” = nu mai e „new” SAU are stoc rezervat SAU a avut vreodată o schimbare de status.
  - 🟠 S6: compoziție fără rânduri de componente scăpa de verificarea „obligatoriu” → verificarea se face întotdeauna.
  - 🟡 S8: produse din mape nesincronizate și compoziții cu componentă obligatorie inactivă apăreau în catalog → reparat în vederea `catalog_produse`.
  - 🟡 A5: comandă confirmată ștearsă în cascadă → ștergerea refuzată pe comenzi înghețate.
  - 🟡 bucket `product-images`: setările se corectează și dacă bucket-ul exista.
- Rulat în producție 25.11.2026: 11 tabele noi, RLS pe toate, 0 politici noi, 0 drepturi pentru anon/authenticated pe ele și pe vedere, 0 funcții apelabile din browser; cele 5 comenzi existente neatinse.
- Atacuri pe baza reală: 73 de teste, 72 trec. Un singur eșec, nelegat de pasul 2: constrângerea `orders_status_check` acceptă `in_production`, `shipped`, `delivered`, `cancelled`, `returned`, dar aplicația trimite `in_productie`, `expediat`, `livrat`, `anulat` → vezi `03-bugs-lectii.md`.
- Notă S8: tabelul `products` rămâne citibil public (acceptat dinainte), deci anon vede direct produsele fără stoc și coloanele `ms_*`; „fără stoc nu apare” e garantat doar prin vederea `catalog_produse`, folosită de server. De decis la pasul 4 dacă restrângem și `products`.
- Sync-ul de stoc (pasul 3) nu are voie să scrie `reserved`: doar `stock`, la upsert.
- Echipa roșie, trecerea 2 (agent separat, pe codul reparat; fără 🔴) — constatări reproduse, **DESCHISE** (migrare de reparație necesară înainte de pasul 5, care e primul care apelează `rezerva_stoc`):
  - 🟠 R1 cursă: un INSERT de linie în paralel cu `rezerva_stoc` trece după commit → comandă „rezervată” cu o linie nerezervată (supravânzare silențioasă; la fel pe componente). Reparație testată de agent: `comanda_e_inghetata` devine volatilă și blochează rândul comenzii (`for share`).
  - 🟠 R2: o linie cu `product_id` golit (produs șters sau UPDATE) pe comandă nerezervată → `rezerva_stoc` întoarce „rezervat” cu 0 rezervat. Reparație: refuz când o linie nu are produs și nici componente, sau necesarul iese gol.
  - 🟡 R3 `TRUNCATE` ocolește tot (și lasă `reserved` blocat) → revocat `truncate` / trigger BEFORE TRUNCATE.
  - 🟡 R4 ștergerea istoricului de status dezgheață comanda → `order_status_history` doar adăugare.
  - 🟡 R5 scriere directă a `orders.stock_reservation` ocolește funcțiile → permis doar din cele două funcții.
  - 🟡 R6 `stock_cache.reserved` poate fi suprascris de un sync (`reserved = 0`) → trigger care păstrează `reserved`; sync-ul scrie doar `stock`.
  - 🟡 R7 `elibereaza_stoc` fără `order by product_id` (risc de deadlock cu sync în lot).
  - ❓ Decizii Sergiu: (a) după „eliberat”, o comandă restaurată nu mai poate fi rezervată — explicit sau permis; (b) pasul 5 inserează comanda ca „new”, apoi liniile, apoi schimbă statusul; (c) ruta de status nu eliberează stocul la anulare (de legat la pasul 5); (d) ștergerea unui workspace cu comenzi e blocată — dorit?
