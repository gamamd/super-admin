# 13. gama.md — site nou de la zero — 🔧 PRIORITATE

Decizie 05.10.2026: site construit de la zero în Super Admin — NU migrare/replică Cartum.
Obiectiv: unul din cele mai performante site-uri din lume în nișa lui. Fără termen; calitate înaintea vitezei.
Cartum = doar sursă de date (produse, poze, URL-uri) și referință a ce există azi.
Capitol de site: doar ce e specific gama.md. Funcțiile comune se construiesc în platformă (cap. 1–12) — vezi „Unde se construiește”.

## Site actual (Cartum/Horoshop) — analizat 05.10.2026
- Catalog: 10 categorii + ~25 subcategorii; amestec ocazii (zi de naștere, externare, cumătrie, nuntă, gender party, corporate) + tipuri produs (folie, latex, cifre, walker…)
- Produs: titlu = cod (C1322), articol, preț MDL, stoc, etichete Nou/Hit/Love, filtre (Pentru cine, Tematică), descriere „Prețul include…”, variante
- Tipuri speciale: text personalizat, chirie decor, invitații/plicuri
- Comandă: coș + cupon, comandă rapidă, cont, favorite, comparare, Discount Card, „Comandă apel”
- Livrare: gratuită > 475 lei în Chișinău, altfel 50 lei; oră fixă +50 lei; interval 30 min, 06:00–21:00; raioane pe km
- Plată: curier, oficiu (cash/card), online Paynet
- RO/RU cu slug-uri diferite pe limbă
- Probleme: titluri = coduri (SEO slab), slug ≠ cod, bannere RO → URL RU, vitrine sezoniere neactualizate, fără legătură cu Moy Sklad

## Studiu de referință
- Benchmark internațional 05.10.2026 → [../studii/benchmark-gama-md.md](../studii/benchmark-gama-md.md) — 12 arii (A–L)
- Model principal: livrare flori/cadouri (Flowwow, Bloom & Wild, Floward, Interflora), nu magazine de party
- Metodă: ariile se discută pe rând; notițe ✅ decis · 💡 de discutat · ❌ respins · Faza 1/2/3

## Decizii (05.10.2026)

### A. Catalog, navigare, căutare — ✅ Faza 1
- Filtre: ocazie, vârstă/cifră, băiat/fată, paletă, buget (300/500/1000/2000), tip, tematică, „Livrare azi”
- Filtre dependente (în cascadă): ocazia + genul deschid vârste, tematici și palete specifice (ex. Zi de naștere → Băiețel → mașini, super-eroi…; Externare → băiat/fată/gemeni)
- Filtrele fără rezultate nu se afișează
- Comode: scurtături gata făcute („Băiețel 1 an”, „Sub 500 lei”), panou mobil cu număr live de produse, chip-uri pentru filtrele active
- Fiecare combinație de filtre are link propriu (partajabil); combinațiile importante = pagini SEO
- Sărbători sezoniere automate: apariție programată (ex. 14 feb → apare 3 feb; 8 Martie → apare 27 feb), dispariție a doua zi după dată, repetare anuală, Paște calculat automat; produsele se etichetează din timp și apar singure, cu banner + filtru
- Căutare RO/RU tolerantă (diacritice, „цифра 1”, „выписка”) + cod intern căutabil (clienți din Instagram)
- Unde: motor în platformă (cap. 4 + 7); ocazii, tematici, date configurate pe workspace Gama
- „Livrare azi” — după sloturile de livrare (aria D)

### B. Pagina de produs — ✅
- Nume descriptiv + cod: AI propune, Sergiu aprobă
- Galerie cu scară vizibilă; video — de la caz la caz
- **Produs = rețetă de componente legate de stoc:** clientul modifică tot (culori, cantități, înlocuiri) în limita disponibilului; preț și componență recalculate live; fișă de producție automată pentru atelier → motor comun cu configuratorul (aria C)
- Componența + înălțimea — de creat pentru toate produsele, prin rețete
- Hi-Float obligatoriu → durata de zbor afișată pe fiecare produs
- Cross-sell: automat din istoricul vânzărilor (Moy Sklad + comenzi site); manual la start — azi nu se știe ce se vinde împreună
- Contact de pe produs = widget-ul propriu cu CRM (proiect separat, în lucru), nu butoane Viber/Telegram directe
- Bară „mai adaugă X lei pentru livrare gratuită”; selector maternitate la externare
- Faza 1: nume, galerie, rețete, Hi-Float, widget · Faza 1 târziu: mesaj dinamic de livrare · Faza 2: recenzii cu foto, cross-sell automat

### Moy Sklad — ✅
- Legat 100% de site, sincronizare automată bidirecțională; comenzile site intră în Moy Sklad, stocul scade imediat
- **Moy Sklad = master:** stoc, prețuri, componente, rețete, comenzi
- **Site = master:** nume, poze, video, descrieri RO/RU, SEO, filtre, ocazii, sezoane
- Regulă: fiecare informație se editează într-un singur loc; celălalt sistem doar o citește
- Rețetele compozițiilor se creează în Moy Sklad (Комплекты / Техкарты) — de făcut de echipa gama.md

## Nedecis încă
- [ ] Meniul principal — temă separată; pornim de la structura actuală gama.md
- [ ] C. Configurator „Construiește-ți compoziția” (legat de rețetele din B)
- [ ] D. Checkout & sloturi de livrare
- [ ] E. După comandă & retenție (foto înainte de livrare, notificări, memento-uri)
- [ ] F. Cont client & loialitate
- [ ] G. Decor evenimente, zone foto, chirie
- [ ] H. Corporate / B2B
- [ ] I. SEO & conținut
- [ ] J. Performanță & mobil
- [ ] K. Marketing & analitică
- [ ] L. Admin & operațiuni
- [ ] Plată online: Paynet sau MAIB ePay (studiul: maib include automat Apple/Google Pay + QR MIA)
- [ ] Unealta de design

## Unde se construiește (platformă)
- Rutare domeniu → workspace, temă → 2.9 · motor de teme → 3
- Componente catalog, produs, coș, checkout, cont, recenzii → 4
- Configurator (text, culori, cifră, preț live) → 5
- Livrare, sloturi, curieri → 6.10 · CRM webhook → 6.16 · cupoane → 6.6
- Admin (comenzi, produse, categorii, bannere) → 7
- Plăți, Moy Sklad → 8
- RO/RU, slug-uri per limbă → 9
- SEO, analitică, Pixel → 10
- Specific doar gama.md (aici): constructor de compoziție, chirie decor, livrare la maternitate, vitrine sezoniere, design propriu

## Design — AI
- 💡 Recomandat: Claude Design (concept + machete) → implementare în cod de Claude. Alternativă: v0 (Vercel).
- Flux: brief (brand, public, referințe mondiale) → design system → machete mobil-first (home, categorie, produs + configurator, checkout) → iterații → implementare

## Moy Sklad — verificat fezabil
- API REST `api.moysklad.ru/api/remap/1.2/`; librărie npm `moysklad`
- O organizație, depozite separate per afacere → filtrare `store_id`
- Stoc rar schimbat → webhooks recomandate; alternativ polling
- Căutările în rusă dau rezultate mai bune

## Preluare date din Cartum
- Export Cartum → script import în `products` (workspace Gama) → poze reîncărcate în Supabase Storage

## De făcut tehnic
- [ ] Rutare domeniu → workspace + temă per workspace (Header-ul are „i-printsmart” fix în cod) — vezi 2.9
- [ ] Format export Cartum (CSV/Excel, URL poze?)
- [ ] Token API Moy Sklad pentru super-admin
- [ ] Denumiri magazine/depozite Moy Sklad → mapare `workspace_id`
