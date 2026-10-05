# Bug-uri și lecții

## Deschise
- **Cod nesincronizat (05.10.2026):** modificările din 17.06.2026 există doar local la Sergiu, nu în GitHub. Blochează lucrul direct pe cod până la push.

## Rezolvate

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
