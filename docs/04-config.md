# Configurație — variabile, conturi, deploy

**Fără valori secrete.** Valorile stau în Vercel + `.env.local` (local, Sergiu); tokenul GitHub doar în documentul Drive „Proiect Furnizori Gama Decor” — niciodată în repo.

## Variabile de mediu
Vercel → Project → Settings → Environment Variables (+ `.env.local` local):

- `NEXT_PUBLIC_SUPABASE_URL` — client + server
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — client browser (`lib/supabase.ts`)
- `SUPABASE_SECRET_KEY` — doar server (`lib/supabase-admin.ts`); nu se importă niciodată în componente client

Sursă: codul din repo (05.10.2026). Variabile noi → adăugate aici la creare.

## Token GitHub
- `CLAUDE_GITHUB_TOKEN` — același token ca la `globos-sync`; are acces scriere și pe `gamamd/super-admin` (verificat 05.10.2026). Valoarea: doar în Drive.
- Fără dată de expirare. **De făcut (Sergiu):** dată de expirare.

## Vercel
- Cont `gamamd1`, plan Hobby.
- Deploy automat la commit pe `main`; preview deploy pe alte branch-uri.
- **Ignored Build Step** (Settings → Git → Ignored Build Step → Custom):
  `git diff --quiet HEAD^ HEAD -- . ':(exclude)docs'`
  → commit doar în `docs/` = build sărit; orice alt fișier = build normal.

## Supabase
- Proiect `super-admin`, ID `cpkvrnzjqwqbfuvnjkgd`, regiune West EU (Ireland), plan gratuit.
- ID-urile workspace-urilor: vezi [01-arhitectura.md](01-arhitectura.md#supabase).

## Conturi utilizator
- `gama.decor@mail.com` — `super_admin` pe toate 3 workspace-uri.

## Local (Sergiu)
- Proiect: `Desktop/super-admin`, rulează la `localhost:3000`.
- Node.js v24.16.0, Git 2.54.0, VS Code, terminal Git Bash.
