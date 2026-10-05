# 5. Personalizator produs (modul core) — 🔧

## Editor foto multi-photo (construit 06–07.2026)
- Upload multiplu simultan · setări per poză (mărime, hârtie, cantitate) · butoane ×2 ×5 ×10 · „aplică la toate”
- Avertizare rezoluție mică (sub 150 DPI la mărimea aleasă) · calcul preț live · sumar sticky
- ⚠️ Crop per poză — `CropModal.tsx` (react-image-crop), raport de aspect din mărimea aleasă (neurcat în repo)
- ⚠️ Flux multi-photo → coș: fiecare poză = item separat (neurcat în repo)
- 🔧 **Următorul pas:** salvare sesiune în localStorage (pozele să nu se piardă la refresh)
- ⏸ Verificat dacă alte produse din catalog au nevoie de aceeași logică

## Personalizator design (text, clipart, mockup)
- 5.1 💡 Decizie: Fabric.js de la zero vs Zakeke la start
- 5.2 ❌ marcat greșit ✅ în Drive — Fabric.js instalat, nefolosit
- 5.3 ✅ Upload imagine client cu preview (prin editorul foto)
- 5.4 ⏸ Text (font, mărime, culoare, aliniere)
- 5.5 ⏸ Bibliotecă clipart (min 200)
- 5.6 ⏸ Culoare fundal / produs
- 5.7 ⏸ Mockup realist pe produs
- 5.8 ⏸ Zone de imprimare (față/spate/mânecă)
- 5.9 ⏸ Undo/Redo
- 5.10 🔧 Salvare draft (localStorage guest / cont)
- 5.11 ⏸ Export 300 DPI → Supabase Storage
- 5.12 ⏸ Fișier print trimis automat la admin la comandă
- 5.13 ⏸ Template-uri predefinite per produs
- 5.14 ⏸ Optimizare mobil (pinch zoom, rotate)
- 5.15 🔧 Validare design — avertizare rezoluție ✅ · zonă de siguranță ⏸
