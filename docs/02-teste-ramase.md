# Teste rămase

Toate testele deschise, dintr-un singur loc. Se bifează `[x]` + dată + rezultat când e confirmat; apoi se actualizează și fișierul capitolului. Cod nou sau modificat = ⚠️ NETESTAT până la confirmare.

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
