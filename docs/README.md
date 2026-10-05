# Super Admin — documentație proiect

Platformă SaaS multi-tenant (Next.js + Supabase) — fundația tehnică pentru toate afacerile: gama.md (prioritate curentă), i-PrintSmart (în pauză), Landing #3.
Detaliile fiecărui capitol stau în fișierul lui din `proiecte/`.

**Început de sesiune (Claude):** citește `00-reguli.md` + acest index + doar fișierele capitolelor lucrate.
**Final de sesiune:** Claude actualizează direct fișierele atinse (commit), cu diff aprobat.

## Fișiere generale

| Fișier | Conținut |
|---|---|
| [00-reguli.md](00-reguli.md) | Reguli permanente, mod de lucru, acces tehnic |
| [01-arhitectura.md](01-arhitectura.md) | Structura repo, stack, Supabase, workspace-uri, Vercel |
| [02-teste-ramase.md](02-teste-ramase.md) | Toate testele deschise, ca listă de bifat |
| [03-bugs-lectii.md](03-bugs-lectii.md) | Bug-uri deschise + rezolvate + lecții |
| [04-config.md](04-config.md) | Nume variabile, conturi, Ignored Build Step (fără valori secrete) |

## Capitole

Legendă: ✅ funcțional · ⚠️ în testare / netestat · 🔧 în lucru · ⏸ neînceput · ❌ renunțat / înlocuit · 💡 idee / decizie deschisă
Numerotarea urmează planul „Plan Site Super Admin” (Drive, migrat aici 05.10.2026).

### Prioritate curentă (05.10.2026): gama.md site nou → [cap. 13](proiecte/13-gama-md-site-nou.md)

### Drumul spre prima vânzare i-PrintSmart — ⏸ în pauză
1. ⏸ Upload poze în Supabase Storage (înlocuiește salvarea în localStorage)
2. ⏸ Coș persistent pentru utilizatori logați (6.4)
3. ⏸ Plată MAIB ePay (8.1)
4. ⏸ Calcul livrare (6.10)

### 1. Infrastructură & setup — 🔧 → [01-infrastructura.md](proiecte/01-infrastructura.md)
- Supabase, GitHub, .env ✅ · Vercel ✅ (05.10.2026) · Hetzner/Nginx ❌ (înlocuite de Vercel) · monitoring + backup ⏸

### 2. Arhitectură & structură — 🔧 → [02-arhitectura.md](proiecte/02-arhitectura.md)
- Next.js, i18n, design system, Zustand ✅ · API routes parțial · tabele SaaS (billing, white-label) de verificat

### 3. Design UI/UX — ⏸ → [03-design.md](proiecte/03-design.md)
- Fără Figma; design system direct în cod (`globals.css`) ✅

### 4. Frontend — pagini publice — 🔧 → [04-frontend.md](proiecte/04-frontend.md)
- Header, Footer, Home ✅ · Catalog, Produs, Checkout parțial · Coș ⚠️ refăcut 05.10, netestat

### 5. Personalizator produs — 🔧 → [05-personalizator.md](proiecte/05-personalizator.md)
- Editor foto multi-photo ✅ · Crop per poză ⚠️ refăcut 05.10, netestat · Fabric.js vs Zakeke 💡

### 6. Backend & API — 🔧 → [06-backend-api.md](proiecte/06-backend-api.md)
- Auth email+parolă ✅ · /api/products + /api/categories ✅ · comenzi parțial · restul ⏸

### 7. Panou Admin Universal — 🔧 → [07-admin.md](proiecte/07-admin.md)
- Multi-tenant + selector workspace ✅ · produse ✅ · dashboard + comenzi parțial · roluri parțial · SaaS (billing, white-label) ⏸

### 8. Plăți & integrări financiare — ⏸ → [08-plati.md](proiecte/08-plati.md)
- MAIB ePay ⏸ (prioritate) · Moy Sklad API 💡 verificat fezabil

### 9. Conținut & multilingv — ⏸ → [09-continut.md](proiecte/09-continut.md)
### 10. SEO & performanță — ⏸ → [10-seo.md](proiecte/10-seo.md)
### 11. Testare & calitate — ⏸ → [11-testare.md](proiecte/11-testare.md)
### 12. Lansare & post-lansare — ⏸ → [12-lansare.md](proiecte/12-lansare.md)
### 13. gama.md — site nou de la zero — 🔧 PRIORITATE → [13-gama-md-site-nou.md](proiecte/13-gama-md-site-nou.md)
- Ordinea (05.10.2026): gama.md → i-PrintSmart → Landing #3
