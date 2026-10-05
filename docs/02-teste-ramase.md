# Teste rămase

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
