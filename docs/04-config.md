# Configurație — variabile, conturi, deploy

**Fără valori secrete.** Valorile stau în Vercel + `.env.local` (local, Sergiu); toate secretele în documentul Drive „Rezumat Super Admin & Progres” — niciodată în repo.

## Variabile de mediu
Vercel → proiect `super-admin` → Environment Variables (doar Production, 05.10.2026):

- `NEXT_PUBLIC_SUPABASE_URL` — client + server (tip Config)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — client browser (`lib/supabase.ts`) (tip Config; cheia legacy anon)
- `SUPABASE_SECRET_KEY` — doar server, tip Secret; cheia legacy service_role (`lib/supabase-admin.ts`); nu se importă niciodată în componente client

Sursă: codul din repo (05.10.2026). Variabile noi → adăugate aici la creare.

## Token GitHub
- `CLAUDE_GITHUB_TOKEN` — același token ca la `globos-sync`; are acces scriere și pe `gamamd/super-admin` (verificat 05.10.2026). Valoarea: în „Rezumat Super Admin & Progres” + documentul globos-sync (la schimbare — actualizat în ambele).
- Fără dată de expirare. **De făcut (Sergiu):** dată de expirare.

## Vercel
- Echipa `gama-super-admin-s-projects`, plan Hobby; proiect `super-admin` (05.10.2026), URL `super-admin-six-bice.vercel.app`.
- Aplicația Vercel pe GitHub: acces doar la `gamamd/super-admin`.
- Deploy automat la commit pe `main`; preview deploy pe alte branch-uri.
- **Ignored Build Step** — în `vercel.json` (`ignoreCommand`): `git diff --quiet HEAD^ HEAD -- . ':(exclude)docs'` → commit doar în `docs/` = build sărit.

## Supabase
- Proiect `super-admin`, ID `cpkvrnzjqwqbfuvnjkgd`, regiune West EU (Ireland), plan gratuit.
- ID-urile workspace-urilor: vezi [01-arhitectura.md](01-arhitectura.md#supabase).

## Conturi utilizator
- `gama.decor@mail.com` — `super_admin` pe toate 3 workspace-uri.

## Local
- Fără copie locală (05.10.2026) — totul stă în GitHub; Claude lucrează prin GitHub API.
