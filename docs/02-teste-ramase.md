# Teste rămase

Toate testele deschise, dintr-un singur loc. Se bifează `[x]` + dată + rezultat când e confirmat; apoi se actualizează și fișierul capitolului. Cod nou sau modificat = ⚠️ NETESTAT până la confirmare.

## 25.11.2026 — Pasul 2 (schema DB gama): rulat în producție, netestat în aplicație
- [x] 73 de atacuri locale + 73 pe baza reală (72 trec; 1 e bug-ul de status de mai jos) · concurență pe ultimul stoc ✅
- [x] Header (coș), editor poze și selector workspace verificate după `fix-eslint` (preview + producție)
- [ ] 🛠 Migrare de reparație pas 2 (echipa roșie, trecerea 2: R1–R7, 2 × 🟠) + a treia trecere; înainte de pasul 5
- [ ] Decizie Sergiu: aliniere status comenzi (valorile din interfață vs `orders_status_check`) — vezi `03-bugs-lectii.md`
- [ ] Trecerea 2 în practică (preview Vercel, mod test) — cere cod care folosește schema (pașii 3 și 5); până atunci pasul 2 nu poate fi 🛡
- [ ] Aprobarea lui Sergiu pentru pasul 2 (fundal verde + 🛡)
- [ ] Reconfirmat în aplicație: checkout anon → comandă salvată (trigger-ele noi pe `orders`); schimbare status admin (trigger de istoric)

## 21.11.2026 — Site gama.md (cap. 13): începem înregistrarea
- Niciun cod nou încă pentru site. Primele teste intră aici după auditul codului existent.
- La lansare (obligatoriu înainte de plăți și checkout live): teste adversariale pe plăți, checkout și comenzi — vezi [11-testare.md](proiecte/11-testare.md).

## Refăcut 05.10.2026 (`b466674`) — netestat
Lucrul local din 17.06 s-a pierdut; refăcut direct în GitHub. Se testează pe `super-admin-six-bice.vercel.app`.
- [ ] Crop per poză (`CropModal.tsx`) — raport de aspect corect după mărimea aleasă
- [ ] Crop: rotire cadru portret/peisaj; schimbarea mărimii resetează crop-ul
- [ ] Multi-photo → coș: fiecare poză = item separat, cu miniatura cropată (sau originală)
- [ ] Pagina `/ro/cos` afișează miniaturile
- [ ] Header: counter coș fără eroare de hidratare

## Funcționalități existente — de confirmat în producție
- [ ] Checkout → comandă salvată în Supabase pe workspace-ul corect
- [ ] Admin: schimbare status comandă live
- [ ] Selector workspace: date izolate per workspace (i-PrintSmart / Gama / Landing #3)
- [ ] Login redirect `/ro/auth?redirect=…` → `/ro/admin`
- [ ] Rute `/ru` și `/en` — fără texte lipsă

## Infrastructură
- [x] `vercel.json`: un commit doar în `docs/` NU pornește build (verificat la commit-ul docs din 05.10.2026)

## Pre-lansare
Lista completă: [11-testare.md](proiecte/11-testare.md).
