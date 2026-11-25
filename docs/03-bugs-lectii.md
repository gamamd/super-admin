# Bug-uri și lecții

Format (ca în `globos-sync`): pe eveniment — ce s-a schimbat, commit-uri, ce s-a verificat, ce a rămas neatins, lecția. Testele deschise stau în [02-teste-ramase.md](02-teste-ramase.md).

## Deschise
- ❓ (21.11.2026) Repo-ul `gamamd/super-admin` e public; `docs/` conține ID-ul proiectului Supabase și ID-urile workspace-urilor (nu sunt secrete). De decis de Sergiu dacă devine privat.

- 🔴 (25.11.2026) Comenzile se creează încă din browser (cheia anon), cu totalul calculat în browser: limitate intermediar (total > 0, lungimi, valori tehnice puse de server), dar fără rate-limit și fără verificarea prețului → pasul 5 (comandă + preț pe server, apoi fără INSERT anon).
- 🟠 (25.11.2026) Statusul comenzii: orice rol (inclusiv operator) trece din orice status în orice status. Istoricul există din pasul 2 (`order_status_history`); regulile de tranziție pe rol rămân ❓ de decis.
- 🔴 (25.11.2026, existent dinainte) Statusuri nealiniate: baza (`orders_status_check`) acceptă `new, confirmed, in_production, shipped, delivered, cancelled, returned`, dar interfața și ruta `/api/admin/orders/[id]/status` folosesc `in_productie, expediat, livrat, anulat` → 4 din cele 6 opțiuni din admin dau „Eroare la salvare”. Propunere (2 fișiere: `OrderStatusUpdater.tsx` și `route.ts`): valorile din cod devin cele din bază, etichetele rămân în română; fără schimbare în DB. Aștept aprobarea lui Sergiu.
- 🟠 (25.11.2026) Pasul 2, trecerea 2 a echipei roșii: cursă între INSERT de linie și `rezerva_stoc`, rezervare goală pe linie fără produs, plus 5 constatări 🟡 (TRUNCATE, istoric șters, scriere directă pe `stock_reservation`, `reserved` suprascris de sync, ordine la eliberare). SQL-ul rulat în producție nu e folosit încă de aplicație (risc 0 acum); reparație în migrare nouă înainte de pasul 5 → [teste/pas-2-schema-gama.md](teste/pas-2-schema-gama.md).
- 🟡 (25.11.2026) Tabelul `products` e citibil public (inclusiv produse fără stoc și coloanele `ms_*`): de restrâns la pasul 4, odată ce site-ul citește doar prin `catalog_produse`.
- 📝 (25.11.2026) Preview-urile Vercel au protecție (redirect la `vercel.com/login`): testul se face logat în Vercel sau direct pe producție, când schimbarea e compatibilă înapoi.

## Rezolvate

### Pasul 2: schema DB gama + RLS (25.11.2026)
- Ce s-a schimbat: 11 tabele noi (`ms_folders`, `product_components`, `stock_cache`, `tags`, `product_tags`, `product_images`, `blocked_days`, `order_items`, `order_item_components`, `order_status_history`, `order_stock_reservations`), câmpuri noi pe `products` și `orders`, vederea `catalog_produse`, funcțiile `rezerva_stoc` / `elibereaza_stoc`, bucket `product-images`. Tot ce e nou: RLS activ, fără politici, fără drepturi pentru browser; doar serverul scrie și citește.
- Commit-uri: `987ac64` (SQL), `333c18e` (atacuri). SQL rulat în producție 25.11.2026 de Claude, în Supabase SQL Editor, cu acordul lui Sergiu.
- Verificat: 73 de teste locale și 73 pe baza reală (tranzacție anulată), echipa roșie trecerea 1 (8 defecte, reparate), concurență pe ultimul stoc. Trecerea 2 a găsit alte 2 🟠 + 6 🟡, deschise (vezi „Deschise”). Detalii: [teste/pas-2-schema-gama.md](teste/pas-2-schema-gama.md).
- Neatins: codul aplicației (nimic nu citește încă tabelele noi), comenzile existente, i-PrintSmart.
- Lecții:
  - Într-o migrare, funcțiile `language sql` sunt verificate la creare și cer ca tabelele la care se referă să existe deja; cele care referă tabele create mai jos se scriu `plpgsql`.
  - Stocul rezervat se ține pe rânduri (cât s-a rezervat efectiv), nu se recalculează din liniile de acum: liniile se pot schimba între rezervare și eliberare.
  - „Înghețat” nu se judecă după statusul curent (se poate reveni la „new”), ci și după istoric și rezervare.
  - Testele pe baza reală se rulează într-o tranzacție care se anulează singură la final (rezultatul vine ca mesaj de eroare); mesajul „destructive operations” din Supabase apare la orice `drop`/`delete`, chiar și pe rânduri de test.
  - La orice test pe baza reală: date de test cu e-mail `.invalid` și ID-uri fixe, ca un `delete` să nu poată atinge comenzi reale.
  - Constrângerile existente se citesc din `pg_constraint` înainte de a presupune valori (așa a ieșit la iveală nealinierea statusurilor).

### Verificări și curățare cod (25.11.2026)
- ESLint: 6 erori reparate (`Header`, `ProductEditorWrapper`, `WorkspaceSelector`), commit `b6f8bbd`; rămân 6 avertismente (`<img>`, variabile nefolosite). Build local trece cu fonturile simulate (sandbox-ul blochează Google Fonts).
- Verificat pe preview și producție: header fără erori, editor de poze, selector workspace cu date izolate.
- Lecție: `next build` cere `SUPABASE_SECRET_KEY` (nu `SUPABASE_SERVICE_ROLE_KEY`) chiar și pentru colectarea paginilor.

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
