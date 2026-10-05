# Reguli generale și mod de lucru

Model preluat din `gamamd/globos-sync` (05.10.2026).

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

- **Început:** citește documentul Drive „Rezumat Super Admin & Progres” (ID `1E0EP1CSgpkpHBG_ld_fyanngPeAonKewa6TPFuELl4M`, doar secrete), apoi `docs/00-reguli.md` + `docs/README.md` + doar proiectele lucrate.
- **Final:** Claude actualizează direct în `docs/` fișierele atinse (stare, commit-uri, teste rămase, lecții) printr-un singur commit.
  - Înainte de commit, Claude arată lui Sergiu TOT ce se modifică în documentație (diff, fișier cu fișier) și așteaptă aprobarea.
  - **Cod: NU se arată** — doar descriere în cuvinte: fișierul, ce se schimbă, efecte în producție, ce e netestat.
- **Structura `docs/proiecte/`:** fiecare capitol din planul site-ului = fișier propriu (`01-…` până la `13-…`). Capitol nou → fișier nou + rând în `README.md`. Numerele existente nu se schimbă.

## Economie de tokeni

- Drive: doar documentul de secrete, o dată pe sesiune. Plan Imprimare RM / Schema DB / Master Index — doar la cerere.
- `docs/`: doar `00-reguli.md` + `README.md` + capitolele lucrate.
- Cod: un singur clone pe sesiune; căutare țintită (grep), citire pe porțiuni; fără recitirea fișierelor deja văzute.
- Commit-uri grupate pe task; verificare TypeScript + status deploy automat, fără pași manuali.
- Răspunsuri scurte, liste; codul nu se arată.
- Pași în interfețe (Vercel, Supabase) doar când nu se pot face prin API/cod.

## Acces tehnic

- **GitHub (`gamamd/super-admin`):** același token fine-grained ca la `globos-sync` (Contents: Read and write). Ținut de Sergiu în „Rezumat Super Admin & Progres” (copie și în documentul globos-sync); citit la începutul sesiunii; **nu se stochează niciodată în memoria Claude și nici în repo**.
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
