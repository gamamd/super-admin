# Teste rămase

## Lucru din 17.06.2026 — neurcat în repo (ultimul commit: 07.06.2026)
Condiție: Sergiu urcă modificările locale în GitHub, apoi se testează în producție.
- [ ] Crop per poză (`CropModal.tsx`) — raport de aspect corect după mărimea aleasă
- [ ] Multi-photo → coș: fiecare poză = item separat, cu imaginea cropată (sau originală)
- [ ] Pagina `/ro/cos` afișează imaginile reale
- [ ] Header: counter coș fără eroare de hidratare

## Funcționalități existente — de confirmat în producție
- [ ] Checkout → comandă salvată în Supabase pe workspace-ul corect
- [ ] Admin: schimbare status comandă live
- [ ] Selector workspace: date izolate per workspace (i-PrintSmart / Gama / Landing #3)
- [ ] Login redirect `/ro/auth?redirect=…` → `/ro/admin`
- [ ] Rute `/ru` și `/en` — fără texte lipsă

## Infrastructură
- [ ] Ignored Build Step: un commit doar în `docs/` NU pornește build pe Vercel

## Pre-lansare
Lista completă: [11-testare.md](proiecte/11-testare.md).
