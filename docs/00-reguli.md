# Reguli generale și mod de lucru

Model preluat din `gamamd/globos-sync` (05.10.2026). Aliniat la regulile din 20.11.2026 ale `globos-sync` în 21.11.2026 (economie de tokeni, Sonnet/Opus, fără Drive la început de sesiune, reguli pentru site-uri).

## Mod de lucru

- **Model (05.10.2026):** Sergiu și Claude discută și decid împreună; Sergiu dă aprobările cerute; toată execuția tehnică e a lui Claude.
- Schimbările de cod le face Claude direct, prin commit GitHub API. Nu se mai dă cod de copy-paste (înainte de 05.10.2026 se lucra prin copy-paste în VS Code).
- Aprobarea lui Sergiu e **obligatorie** înainte de a modifica fișiere existente.
- Claude confirmă fișierul exact înainte de commit.
- Pașii se dau unul câte unul.
- Verificare TypeScript (`npx tsc --noEmit`, în sandbox-ul Claude) obligatorie înainte de ORICE commit de cod.
- „Mai întâi gândim, după facem” — calitate și durabilitate, nu viteză.

## Reguli permanente

- **Workspace-first:** orice funcție e legată de `workspace_id`. Testul: „dacă mâine apare un client nou cu workspace nou, funcția merge automat?”
- CRM-ul (`gamamd/crm-gamamd`) e proiect separat — nu se modifică de aici. Super Admin îl consumă doar prin API/webhook.
- Cod nou/modificat semnalat „⚠️ netestat” până e confirmat funcțional în producție.
- Deciziile finale care implică bani/comenzi reale rămân manuale.
- Fișierele din Drive se citesc doar la începutul sesiunii și la cererea lui Sergiu.
- Planul de afaceri „Plan Imprimare RM” (Drive) NU e documentație tehnică — rămâne în Drive, se citește doar la cerere.

## Început / final de sesiune

- **Început (din 21.11.2026, ca în `globos-sync`):** `docs/00-reguli.md` + `docs/README.md` + doar proiectele lucrate; pentru site: și caietul de sarcini „site nou gama.md” (lista de idei). Drive se citește doar la cererea lui Sergiu (documentul „Secrete Super Admin”, ID `1E0EP1CSgpkpHBG_ld_fyanngPeAonKewa6TPFuELl4M`, doar secrete).
- **Final:** Claude actualizează direct în `docs/` fișierele atinse (stare, commit-uri, teste rămase, lecții) printr-un singur commit.
  - Înainte de commit, Claude arată lui Sergiu TOT ce se modifică în documentație (diff, fișier cu fișier) și așteaptă aprobarea.
  - **Cod: NU se arată** — doar descriere în cuvinte: fișierul, ce se schimbă, efecte în producție, ce e netestat.
- **Structura `docs/proiecte/`:** fiecare capitol = fișier propriu. Capitol nou → fișier nou + rând în `README.md`. Numerele existente nu se schimbă.
  - `01-…` – `12-…` = **platforma comună** (motoare configurabile per workspace)
  - `13-…` și următoarele = **câte un capitol per site** (doar specificul lui): 13 gama.md, 14 i-PrintSmart
  - Testul pentru orice funcție nouă: „e utilă și altor site-uri?” → da = platformă (1–12), activată per workspace; nu = capitolul site-ului

## Economie de tokeni

- Drive: doar documentul de secrete, o dată pe sesiune. Plan Imprimare RM / Master Index — doar la cerere.
- `docs/`: doar `00-reguli.md` + `README.md` + capitolele lucrate.
- Cod: un singur clone pe sesiune; căutare țintită (grep), citire pe porțiuni; fără recitirea fișierelor deja văzute.
- Commit-uri grupate pe task; verificare TypeScript + status deploy automat, fără pași manuali.
- Răspunsuri scurte, liste; codul nu se arată.
- Pași în interfețe (Vercel, Supabase) doar când nu se pot face prin API/cod.

## Acces tehnic

- **GitHub (`gamamd/super-admin`):** din 21.11.2026 accesul vine prin sesiune (atașare repo), ca la `globos-sync`. Dacă e nevoie de token, îl ține Sergiu în „Secrete Super Admin” (Drive, doar la cererea lui); **nu se stochează niciodată în memoria Claude și nici în repo**.
- **Vercel:** proiect `super-admin`, echipa `gama-super-admin-s-projects` (creat 05.10.2026), `super-admin-six-bice.vercel.app`.
  - Fiecare commit pe `main` = deploy automat în producție.
  - Commit-urile doar în `docs/` NU declanșează build — regula e în `vercel.json` (`ignoreCommand`), nu în interfața Vercel.
  - Statusul deploy-ului îl verifică Claude prin GitHub API (commit status) — fără screenshot-uri.
  - Conectorul Vercel (Claude): autorizat greșit, fără acces la echipă — de refăcut doar dacă e nevoie de loguri.
  - Preview deployments: un branch separat primește URL propriu de test → se poate testa înainte de `main`.
- **Supabase:** fără acces direct al lui Claude. Modificările de schemă (SQL) le rulează Sergiu în SQL Editor, după aprobare.

## Lecții de platformă (permanente)

- **Next.js 16:** `middleware.ts` → redenumit `proxy.ts`; `params` în App Router sunt `Promise<{ slug: string }>`.
- **Supabase client/server:** `lib/supabase.ts` exportă doar clientul browser (anon); cheia secretă stă doar în `lib/supabase-admin.ts`, folosit doar pe server.
- **RLS:** politica pe `user_roles` nu verifică `user_roles` (recursivitate) — se folosește `auth.uid() = user_id`.
- **Supabase gratuit** se pauzează după inactivitate → erori `ENOTFOUND` / `fetch failed`: dashboard Supabase → „Resume project”.
- **Drive API:** citirea imediat după editare poate întoarce conținut vechi — se așteaptă câteva secunde.
- **Terminal local:** Git Bash, nu PowerShell.

## Economie de tokeni și modele (aliniat 21.11.2026, după `globos-sync` 20.11.2026)

- O conversație = un subiect. Când subiectul se schimbă, Claude propune conversație nouă.
- Comenzile se grupează, rezultatele sunt scurte, fără loguri întregi. Documentele nu se recitesc fără motiv; Drive doar la cererea lui Sergiu.
- **Sonnet:** pagini de prezentare, catalog simplu, formulare, texte, design, note în `docs/`, verificări de stare.
- **Opus:** integrarea MoySklad, plăți, conturi de client, schema bazei de date și RLS, arhitectura multi-tenant, diagnostic cu cauză necunoscută, orice atinge comenzi reale.
- Nu există comutare automată. Claude anunță de la început „Asta cere Opus, schimbă modelul”, iar la final „Partea grea e gata, poți reveni pe Sonnet” (sau „Rămâi pe Opus”).
- Conectorii nefolosiți rămân deconectați.

## Reguli pentru site-uri (aliniate 21.11.2026)

- **Paralel cu Horoshop:** pentru clienți, gama.md rămâne pe site-ul actual până în ultimul moment. Site-ul nou rulează în paralel doar intern, pe preview Vercel sau URL de test, cu `noindex`. Domeniul `gama.md` nu se atașează la Vercel fără aprobarea lui Sergiu.
- **MoySklad = sursa adevărului** pentru catalog, preț, stoc, componente, rețete și, din 21.11.2026, poze și descrieri (conținutul pe canal „Контент для площадок”). Site-ul doar citește; nu modifică produse în MoySklad. Comenzile intră în MoySklad doar prin 3.7.3, apoi trec prin 3.7.2.
- **Se citește doar ce e nevoie:** filtru pe mapă / cale / cod, niciodată tot sortimentul. La orice import sau script nou, Claude întreabă întâi cu ce mape lucrăm.
- **Poza stă doar pe Комплект** (regulă globos-sync 20.11.2026); site-ul ia pozele de acolo.
- **Артикул (linkul furnizorului) nu se afișează niciodată pe site.** Внешний код e liber pentru integrarea site-ului.
- **Memorie stabilă:** orice stare a utilizatorilor (coș, ciorne, sesiuni) se ține în baza de date, nu doar în `localStorage` sau în memoria serverului.
- **Workspace-first** rămâne testul pentru orice funcție nouă.
- **Plăți:** întâi în mod test; trecerea în producție doar cu aprobarea explicită a lui Sergiu.
- **Date personale ale clienților:** colectate minim, fără a ajunge în docs sau chat; politică de confidențialitate care menționează asistentul AI.
- **Anunțuri:** orice modificare care afectează oamenii din firmă (agenți, atelier) se anunță prin 3.30, din proiectul „Comenzi materiale”.
- **`globos-sync` și `crm-gamamd`** nu se ating din acest proiect. Citire din `globos-sync` doar la cererea explicită a lui Sergiu și doar fișierele indicate.
- Orice decizie nouă se notează în cap. 13, în aceeași zi, cu data. Ideile noi se propun; Sergiu aprobă înainte să intre în caiet.
