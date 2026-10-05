# 7. Panou Admin Universal — 🔧

Decizie: adminul e Universal Multi-Tenant — gestionează i-PrintSmart / Gama / Landing #3; toate funcțiile se construiesc pe `workspace_id`. Rută: `/ro/admin`.

- 7.0 ✅ `workspace_id` pe toate tabelele, date izolate
- 7.1 🔧 Autentificare admin — rute protejate prin `proxy.ts` ✅ · 2FA ⏸
- 7.2 🔧 Dashboard — stats + listă comenzi ✅ · grafice ⏸
- 7.3 🔧 Comenzi — detalii + schimbare status live ✅ · filtrare ⏸
- 7.4 ✅ Produse — listă + adăugare · editare / ștergere / variante / stoc de verificat
- 7.5 ⏸ Categorii
- 7.6 ⏸ Clienți
- 7.7 ⏸ Cupoane
- 7.8 ⏸ Recenzii
- 7.9 ⏸ Editor pagini statice (Tiptap)
- 7.10 ⏸ Traduceri din admin
- 7.11 ⏸ Rapoarte + export
- 7.12 ⏸ Bannere homepage
- 7.13 ⏸ Template-uri personalizator
- 7.14 ⏸ Notificări interne admin
- 7.15 ⏸ Log activitate admin
- 7.16 ✅ Selector workspace (cookie `active_workspace`)
- 7.17 🔧 Roluri per workspace — tabel `user_roles` ✅ · permisiuni granulare ⏸
- 7.18 ⏸ Billing SaaS (Stripe Billing / Paddle)
- 7.19 ⏸ White-label configurator
- 7.20 ⏸ Super Admin global (peste workspace-uri)
- 7.21 ⏸ Onboarding client SaaS (wizard)
