# 14. Site i-PrintSmart — ⏸ în pauză

Capitol de site: doar ce e specific i-PrintSmart. Funcțiile comune se construiesc în platformă (cap. 1–12).
Piață: RM (principală), RO (secundară); nișă export Etsy (motive tradiționale); B2B prioritar pentru primele venituri.

## Drumul spre prima vânzare — ⏸
1. ⏸ Upload poze în Supabase Storage (înlocuiește localStorage)
2. ⏸ Coș persistent pentru utilizatori logați (6.4)
3. ⏸ Plată MAIB ePay (8.1)
4. ⏸ Calcul livrare (6.10)

## Domenii (din 1.1)
- `i-printsmart.com` ✅ achiziționat · `.md` (nic.md) + `.ro` (rotld.ro) ⏸

## Design (din 3)
- Paletă: fundal #FFFFFF, suprafețe #F5F4F2, text #1A1A1A, text secundar #6B6660, accent #C4B080, border #E0DDD8; font Space Grotesk
- ✅ Home implementat direct în cod (din 3.3)

## Frontend specific (din 4)
- ✅ Home — Hero, Categorii, Produse populare (DB), De ce noi, B2B (din 4.4)
- ⚠️ Coș — miniaturi reale, fiecare poză = item separat (refăcut 05.10.2026, `b466674`, netestat) (din 4.7)

## Editor foto multi-photo (din 5, construit 06–07.2026)
- Upload multiplu simultan · setări per poză (mărime, hârtie, cantitate) · butoane ×2 ×5 ×10 · „aplică la toate”
- Avertizare rezoluție mică (sub 150 DPI la mărimea aleasă) · calcul preț live · sumar sticky
- ⚠️ Crop per poză — `CropModal.tsx`, cadru pe proporția mărimii, rotire portret/peisaj (refăcut 05.10.2026, `b466674`, netestat)
- ⚠️ Flux multi-photo → coș: fiecare poză = item separat, în coș doar miniatura (refăcut 05.10.2026, netestat)
- ⏸ **Următorul pas:** upload poze originale în Supabase Storage — localStorage (~5 MB) nu poate ține pozele; obligatoriu înainte de prima vânzare
- ⏸ Verificat dacă alte produse din catalog au nevoie de aceeași logică

## Personalizator — părți de print (din 5)
- ⏸ Bibliotecă clipart (min 200) (fost 5.5)
- ⏸ Zone de imprimare față/spate/mânecă (fost 5.8)
- ⏸ Export 300 DPI → Supabase Storage (fost 5.11)
- ⏸ Fișier print trimis automat la admin la comandă (fost 5.12)

## Conținut (din 9)
- ⏸ Texte RO (bază) — pagini, butoane, erori, emailuri
- ⏸ Traducere RU (traducător nativ pentru texte cheie) + EN
- ⏸ Descrieri SEO produse RO + RU + EN
- ⏸ Imagini produse (min 4/produs)
- ⏸ Pagini statice
- ⏸ Template-uri personalizator (min 5/produs popular)
- ⏸ Emailuri tranzacționale

## Plăți & livrare specifice
- RM: MAIB ePay (8.1), ramburs · RO: Netopia (8.2) · internațional: Stripe (8.4)
- Curieri: Nova Poshta MD, Poșta Moldovei; Fan Courier / DPD pentru RO (6.10)
