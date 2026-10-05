# 1. Infrastructură & setup inițial — 🔧

Notă: planul acoperă atât site-urile publice (i-PrintSmart, gama.md, Landing #3) cât și Super Adminul Universal.

- 1.1 ⏸ Domenii — `i-printsmart.com` ✅ achiziționat · `.md` (nic.md) + `.ro` (rotld.ro) ⏸
- 1.2 ❌ Hetzner VPS — înlocuit de Vercel (decis)
- 1.3 ❌ DNS / SSL / Nginx manual — Vercel face SSL automat; rămâne doar configurarea DNS a domeniilor
- 1.4 ✅ Supabase
- 1.5 ✅ GitHub repository (`gamamd/super-admin`)
- 1.6 ⏸ Deploy automat — proiect Vercel inexistent (verificat 05.10.2026: niciun deploy în GitHub); se creează după urcarea lucrului local din 17.06 (GitHub Actions ❌ inutil)
- 1.6.1 ⏸ Ignored Build Step pentru `docs/` — se setează la crearea proiectului Vercel
- 1.7 ✅ Variabile de mediu
- 1.8 ⏸ Monitoring + alerting (Uptime Robot)
- 1.9 ⏸ Backup zilnic DB (retenție 30 zile) — atenție: planul gratuit Supabase nu include backup automat
