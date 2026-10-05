# 1. Infrastructură & setup inițial — 🔧

Capitol de platformă (comun tuturor site-urilor).

- 1.1 Domenii — per site, în capitolul fiecărui site (13 gama.md, 14 i-PrintSmart); aici doar conectarea DNS → Vercel
- 1.2 ❌ Hetzner VPS — înlocuit de Vercel (decis)
- 1.3 ❌ DNS / SSL / Nginx manual — Vercel face SSL automat; rămâne doar configurarea DNS a domeniilor
- 1.4 ✅ Supabase
- 1.5 ✅ GitHub repository (`gamamd/super-admin`)
- 1.6 ✅ Deploy automat Vercel — proiect creat + primul deploy reușit 05.10.2026 (GitHub Actions ❌ inutil)
- 1.6.1 ✅ Ignored Build Step pentru `docs/` — prin `vercel.json` (05.10.2026)
- 1.7 ✅ Variabile de mediu
- 1.8 ⏸ Monitoring + alerting (Uptime Robot)
- 1.9 ⏸ Backup zilnic DB (retenție 30 zile) — atenție: planul gratuit Supabase nu include backup automat
