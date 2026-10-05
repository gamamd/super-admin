# Bug-uri și lecții

## Deschise
- (niciunul)

## Rezolvate

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
