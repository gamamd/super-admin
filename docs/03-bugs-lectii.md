# Bug-uri și lecții

Format (ca în `globos-sync`): pe eveniment — ce s-a schimbat, commit-uri, ce s-a verificat, ce a rămas neatins, lecția. Testele deschise stau în [02-teste-ramase.md](02-teste-ramase.md).

## Deschise
- ❓ (21.11.2026) Repo-ul `gamamd/super-admin` e public; `docs/` conține ID-ul proiectului Supabase și ID-urile workspace-urilor (nu sunt secrete). De decis de Sergiu dacă devine privat.

- 🔴 (25.11.2026) Comenzile se creează încă din browser (cheia anon), cu totalul calculat în browser: limitate intermediar (total > 0, lungimi, valori tehnice puse de server), dar fără rate-limit și fără verificarea prețului → pasul 5 (comandă + preț pe server, apoi fără INSERT anon).
- 🟠 (25.11.2026) Statusul comenzii: orice rol (inclusiv operator) trece din orice status în orice status, fără istoric → pasul 2 (reguli de tranziție pe rol + istoric).
- 📝 (25.11.2026) Preview-urile Vercel au protecție (redirect la `vercel.com/login`): testul se face logat în Vercel sau direct pe producție, când schimbarea e compatibilă înapoi.

## Rezolvate

### RLS deschis pe `orders` și `user_roles` (25.11.2026)
- Găsit la pregătirea pasului 2: `orders` avea SELECT/UPDATE/INSERT `true` pentru public (oricine citea datele clienților și schimba status, total, plată); `user_roles` avea `ALL` pe `auth.uid() = user_id` fără restricție de scriere (oricine logat își putea da singur rol admin).
- Cod: statusul comenzii doar prin server, rută nouă `POST /api/admin/orders/[id]/status` (rol + workspace activ, aceeași origine, JSON exact); mesaj de eroare în admin; `server-only` pe `lib/supabase-admin.ts`. Commit-uri `628e6c7`, `ae76ec7`.
- SQL (rulat de Sergiu): `supabase/sql/2026-11-25-fix-rls-orders-user-roles.sql` + `2026-11-25-orders-insert-limite.sql`. Politici rămase: `user_roles` doar SELECT propriu; `orders` doar INSERT limitat.
- Verificat pe producție: schimbare de status, selector workspace, checkout „Mulțumim!” după ambele SQL-uri. Echipa roșie (agent separat): fără ocoliri; `rls_auto_enable` = event trigger, neapelabilă.
- Lecție: la orice schemă nouă se verifică `pg_policies` + `relrowsecurity`, nu doar codul; numele unei politici nu spune ce face.

### Cod nesincronizat + build stricat (05.10.2026)
- Lucrul din 17.06 exista doar local și s-a pierdut; ultimul commit era 07.06. Refăcut direct în GitHub (`b466674`).
- Codul din `main` nu trecea build-ul: `ProductEditorWrapper` incompatibil cu editorul multi-photo + tip `locale` în `i18n/request.ts`; `package-lock.json` desincronizat. Reparate.
- Lecție: verificare TypeScript în sandbox înainte de orice commit.

### Vercel niciodată conectat (05.10.2026)
- Repo-ul nu avea niciun deploy; „deploy automat” din Drive era greșit. Proiect creat 05.10.2026.
- Lecție: în Vercel, variabilele `NEXT_PUBLIC_*` nu pot fi tip Secret → Config (sunt publice prin design).
- Lecție: Ignored Build Step nu apare în interfața nouă Vercel → `vercel.json` cu `ignoreCommand`.

### Recursivitate infinită editor (17.06.2026)
- Simptom: „Maximum call stack size exceeded”, browser blocat.
- Cauză: conținutul `ProductEditor.tsx` și `ProductEditorWrapper.tsx` inversat accidental — componenta se importa pe ea însăși.
- Lecție: la înlocuiri de fișiere, verificat numele fișierului vs. componenta exportată.

### Hidratare Header (17.06.2026)
- Counter-ul coșului (Zustand persist) se randa diferit pe server vs. client.
- Fix: state `mounted` + `useEffect` — badge-ul apare doar după montare.

### RLS `user_roles` — recursivitate (07.06.2026)
- Politica verifica `user_roles` pentru acces la `user_roles`. Fix: `auth.uid() = user_id`.

### „supabaseKey is required” (05.2026)
- Cauză: cheia secretă importată în cod de client. Fix: separare `lib/supabase.ts` (anon) / `lib/supabase-admin.ts` (server).

### `middleware.ts` depreciat (05.2026)
- Next.js 16: redenumit `proxy.ts`; matcher-ul exclude `/api/` din i18n.

### `params` Next.js 16 (05.2026)
- Tipizare obligatorie `Promise<{ slug: string }>`.

### `@supabase/auth-helpers-nextjs` depreciat (05.2026)
- Înlocuit cu `@supabase/ssr` (`createBrowserClient`).

### Supabase pauzat (17.06.2026)
- Erori `ENOTFOUND` / `fetch failed` → proiect pauzat de inactivitate → „Resume project”.

## Lecții de lucru
- Comenzile bash copiate cu caractere speciale pot eșua — tastate manual (valabil pentru Git Bash local).
- Drive API poate întoarce conținut vechi imediat după editare.
