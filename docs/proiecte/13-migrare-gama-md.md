# 13. gama.md versiunea nouă (Cartum → Super Admin) — 🔧 PRIORITATE

Devenit prioritate 05.10.2026 (i-PrintSmart în pauză). Workspace Gama există deja în Supabase. Etapele — de definit în sesiunea următoare.

## Situație (06.2026)
- Site live pe Cartum (Horoshop, SaaS e-commerce).
- Date fragmentate: poze + descrieri pe Cartum; stoc + prețuri în Moy Sklad — fără sincronizare.
- Cartum are export produse (format și conținut de verificat).

## Moy Sklad — verificat fezabil
- API REST `api.moysklad.ru/api/remap/1.2/`; librărie npm `moysklad`.
- O organizație, magazine/depozite separate per afacere → filtrare `store_id`.
- Stoc rar schimbat (baloane) → webhooks recomandate; alternativ polling.
- Căutările în rusă dau rezultate mai bune.

## Transfer produse
- Export Cartum → script import în `products` (workspace Gama) → poze descărcate din URL și reîncărcate în Supabase Storage.

## De făcut la pornire
- [ ] Format export Cartum (CSV/Excel, URL poze?)
- [ ] Token API Moy Sklad pentru super-admin
- [ ] Denumiri exacte magazine/depozite Moy Sklad → mapare `workspace_id`
- [ ] Decizie webhooks vs polling (recomandare: webhooks)
