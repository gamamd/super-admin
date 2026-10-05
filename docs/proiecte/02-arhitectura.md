# 2. Arhitectură & structură proiect — 🔧

- 2.1 🔧 Arhitectură completă (sitemap, API Gateway central, schemă multi-tenant, flux billing SaaS)
- 2.2 ⚠️ Tabele DB — toate cu `workspace_id` NOT NULL ✅
  - De bază: workspaces, users/user_roles, products, orders, categories ✅
  - customizations, reviews, coupons, pages, media — de verificat în Supabase
  - SaaS: billing_plans, subscriptions, white_label_configs — de verificat în Supabase
- 2.3 🔧 API routes — `/api/products`, `/api/categories` ✅ · orders, users, customize, upload, workspaces, billing, white-label, crm (proxy CRM extern) ⏸
- 2.4 ✅ Next.js (16.2.6)
- 2.5 ✅ i18n `next-intl` RO / RU / EN
- 2.6 ✅ Tailwind + design system (paletă brand, Space Grotesk)
- 2.7 🔧 Convenții cod — ESLint ✅ · Prettier ⏸
- 2.8 ✅ Zustand — coș (persist) + workspace
- 2.9 ⏸ Rutare pe domeniu → workspace (`proxy.ts`) + temă și module per workspace din DB (decis 05.10.2026)
