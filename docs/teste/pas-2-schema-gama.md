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
| S1 | Anon citește sau scrie în tabelele noi | doar citire pe catalog public; nimic pe comenzi | ⏳ |
| S2 | Admin din workspace A citește/scrie date din B | refuz pe toate tabelele | ⏳ |
| S3 | Insert cu `workspace_id` falsificat | refuz (RLS `WITH CHECK`) | ⏳ |
| S4 | `orders`: anon schimbă statusul (`OrderStatusUpdater`) | refuz; update doar pe server sau admin cu rol | ❌ → 🛠 25.11.2026 (rută server + RLS) · 🔍 echipa roșie ✅ |
| S5 | Client modifică prețul/totalul/componentele după plasare | imposibil; compoziția e înghețată | ⏳ |
| S6 | Eliminarea unei componente `is_required` în compoziție | respinsă pe server | ⏳ |
| S7 | Cantitate 0, negativă, uriașă, zecimală; componentă din alt workspace | CHECK/FK resping | ⏳ |
| S8 | Produs fără stoc | nu apare în catalog, nici în vederile derivate | ⏳ |
| S9 | Două comenzi pe același ultim stoc | rezervarea la plată e atomică; reușește una singură | ⏳ |
| S10 | Ștergere produs/componentă folosită în comenzi vechi | comenzile istorice rămân intacte (snapshot) | ⏳ |
| S11 | RLS recursiv (ca la `user_roles`) | fără recursivitate | ⏳ · 25.11.2026: `user_roles` doar SELECT propriu, fără auto-promovare |
| S12 | i-PrintSmart (♻️): catalog, coș, checkout, admin | identic cu înainte | ⏳ |
| S13 | URL extern/injectat în `product_images` | doar chei din depozitul propriu | ⏳ |

## Rezultate
### Reparație urgentă înainte de pas — 25.11.2026
- Găsit în `pg_policies`: `orders` deschis public (citire, modificare, inserare), `user_roles` cu scriere pe rândul propriu. Reparat: vezi `03-bugs-lectii.md` („RLS deschis pe `orders` și `user_roles`”).
- Echipa roșie: acces între workspace-uri, CSRF, PostgREST anon, auto-promovare → rezistă. Rămase: INSERT anon în `orders` (limitat, definitiv la pasul 5); tranziții de status + istoric (pasul 2).
- Restul atacurilor: după implementarea schemei.
