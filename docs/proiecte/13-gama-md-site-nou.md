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

## Principiu director: SEO + Google Ads (22.11.2026)
- ✅ Site-ul se promovează prin Google Ads și SEO; de aici vin comenzile. Eficiența acestor capitole e prioritate maximă.
- Consecințe tehnice (📝, de detaliat în cap. 10):
  - viteză mobil (Core Web Vitals) = scor de calitate Google Ads și poziție SEO
  - randare pe server, URL-uri curate, pagină SEO pentru fiecare ocazie și combinație importantă de filtre
  - date structurate Product (preț, stoc) și feed Google Merchant din MoySklad
  - stoc și preț mereu corecte; reclamele nu duc la produse epuizate
  - hreflang RO/RU, sitemap, GA4 + conversii Google Ads (inclusiv „Enhanced conversions”)
  - SEO nu mai e „de bază” în MVP: se tratează ca funcție centrală, nu ca pas 7 de la final

## Decizii tehnice (22.11.2026)
- ✅ Poze: copiate din MoySklad în stocarea site-ului (Supabase Storage); MoySklad rămâne master, schimbarea se propagă la sync.
- ✅ Sync MoySklad: **polling** (MoySklad nu poate trimite webhook-uri spre site — blocat/Rusia). Frecvența depinde de planul Vercel (Hobby = cron o dată pe zi) → ❓ de reverificat la alegerea planului.
- ✅ Plată online: **MAIB ePay** (include Apple/Google Pay + QR MIA).
- ✅ Planuri plătite (Vercel, Supabase) înainte de a atașa domeniul `gama.md`; până atunci testare internă pe planurile gratuite.
- 📝 Cod specific gama.md într-un director separat de i-PrintSmart (decide Claude).

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
- **Site = master:** nume, video, SEO, filtre, ocazii, sezoane (poze și descrieri RO/RU → MoySklad, decis 21.11.2026 — vezi mai jos)
- Regulă: fiecare informație se editează într-un singur loc; celălalt sistem doar o citește
- Rețetele compozițiilor se creează în Moy Sklad (Комплекты / Техкарты) — de făcut de echipa gama.md

## Decizii (21.11.2026)
- ✅ Site-ul se construiește în `gamamd/super-admin` (workspace Gama). Fără repo separat. Hosting Vercel (neschimbat), test pe preview-uri de branch.
- ✅ Paralel cu Horoshop: doar intern. Clienții rămân pe site-ul vechi până în ultimul moment; domeniul `gama.md` nu se atașează fără aprobare; URL de test `noindex`.
- ✅ MoySklad = master și pentru poze și descrieri (înlocuiește „Site = master” din 05.10.2026 doar pentru aceste două). Poza stă pe Комплект; Артикул nu se afișează pe site.
- ✅ Plăți la MVP: card, MIA, avans, plată la livrare — toate opțiunile. ❓ Regula pe tip de produs.
- ❓ Livrare în afara Chișinăului: decis mai târziu; zone configurabile.
- ✅ MVP (aprobat 21.11.2026): catalog din MoySklad (doar produse cu poză) pe ocazii + compoziții cu rețetă · coș și checkout scurt cu câmpuri de decor · calendar de livrare cu zile blocate manual · plată card, MIA, avans, la livrare · comanda în MoySklad (3.7.3) · RO/RU · SEO de bază · GA4/Pixel. Capacitatea automată din Freya → valul 2.
- ✅ Caietul de sarcini „site nou gama.md” = lista de idei; deciziile tehnice se notează aici. Împărțirea în sub-capitole se decide mai târziu (❓).
- ✅ Stack și platformă neschimbate (Next.js, Supabase, Vercel, multi-tenant pe domeniu). Pasul „alegere tehnologie” din planul inițial al proiectului dispare.

## Ordinea lucrărilor (aprobată 21.11.2026)
Bază: auditul codului din 21.11.2026 — codul existent e al i-PrintSmart (ID workspace hardcodat în 10 fișiere, Header/Footer/home/editor foto); pentru gama.md lipsesc toate piesele MVP. Model între paranteze, conform `00-reguli.md`.
1. ✅ Fundația multi-tenant: rutare domeniu → workspace, scos ID-ul hardcodat, temă per workspace, protejat `POST /api/products` (Opus)
2. ✅ Schema DB gama: produse + rețetă, ocazii, ID-uri MoySklad, comenzi cu decor și slot, zile blocate, RLS (Opus; SQL rulat de Sergiu)
3. ✅ Sync MoySklad read-only, doar mapele indicate de Sergiu (Opus; necesită token API + mapare depozite)
4. ✅ Catalog și produs gama + RO/RU real (Sonnet)
5. ✅ Coș persistent în DB + checkout scurt cu decor și calendar, preț calculat pe server (Opus)
6. ✅ Plăți în mod test (MIA QR, card, avans, la livrare), apoi comanda → MoySklad 3.7.3 (Opus; necesită decizia Paynet/MAIB și regula pe tip de produs)
7. ✅ SEO de bază, `noindex`, GA4/Pixel, confidențialitate (Sonnet)
8. ✅ Admin (listă comenzi, zile blocate, editare produs), apoi teste pe preview Vercel (Sonnet)
- 21.11.2026: azi se notează doar fundamentul (meniul + ordinea); nu se implementează nimic.

## Meniul principal — categorii (21.11.2026)
Punct de pornire = meniul actual gama.md (captură 21.11.2026), în această ordine. 📝 notat; conținutul fiecărei categorii îl explică Sergiu pe rând → ❓ până atunci.
1. Produse — ❓
2. Zile de naștere — ❓
3. Compoziții din baloane cu heliu — ❓
4. Externare din maternitate — ❓
5. Inimi / Surprize — ❓
6. Bride / Nuntă — ❓
7. Gender Party — ❓
8. Decor Cumetrie / Botez — ❓
9. Baloane / Decor pentru Companii — ❓
10. Invitații / Plicuri — ❓
11. Livrare — ❓ (categorie aparte în meniu, decis 22.11.2026)

## Nedecis încă
- [ ] ⚠️ URGENT (SEO): URL-uri — păstrăm cele vechi 1:1 sau curățăm + redirect 301 (pentru aria I)
- [ ] Meniul principal — lista categoriilor e notată mai sus (21.11.2026); rămân de explicat conținutul fiecăreia și rolul „Produse” (toate produsele sau categorie separată)
- [ ] C. Configurator „Construiește-ți compoziția” (legat de rețetele din B)
- [ ] D. Checkout & sloturi de livrare
- [ ] E. După comandă & retenție (foto înainte de livrare, notificări, memento-uri)
- [ ] F. Cont client & loialitate — ideile (login prin telefon + cod, cabinet, trepte/puncte, calendarul sărbătorilor) sunt notate în caiet, secț. 15 (21.11.2026); deciziile se iau când ajungem la această etapă (4 întrebări deschise listate acolo)
- [ ] G. Decor evenimente, zone foto, chirie
- [ ] H. Corporate / B2B
- [ ] I. SEO & conținut
- [ ] J. Performanță & mobil
- [ ] K. Marketing & analitică
- [ ] L. Admin & operațiuni
- [ ] Unealta de design
- [ ] Câți clienți folosesc azi contul de pe site / Discount Card-ul (pentru aria F)
- [ ] avocado.md declară aceeași adresă (V. Alecsandri 13) — e afacerea noastră? Dacă da, risc de concurență SEO cu gama.md

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
- ✅ 22.11.2026: site-ul trebuie să fie **super estetic**; design făcut de un designer pentru **toată povestea** (home, catalog, produs, configurator, checkout, livrare), cu o singură direcție vizuală.
- ✅ 22.11.2026: **actualizare periodică a designului** (bannere, vitrine, vizuale sezoniere), la intervale regulate.
- ❓ Cine face designul și actualizările: designer uman, Claude Design sau mixt.
- 💡 Recomandat: Claude Design (concept + machete) → implementare în cod de Claude. Alternativă: v0 (Vercel).
- Flux: brief (brand, public, referințe mondiale) → design system → machete mobil-first (home, categorie, produs + configurator, checkout) → iterații → implementare

## Moy Sklad — verificat fezabil
- API REST `api.moysklad.ru/api/remap/1.2/`; librărie npm `moysklad`
- O organizație, depozite separate per afacere → filtrare `store_id`
- Webhooks imposibile (MoySklad blocat spre exterior) → polling, decis 22.11.2026
- Căutările în rusă dau rezultate mai bune

## Preluare date din Cartum
- Export Cartum → script import în `products` (workspace Gama) → poze reîncărcate în Supabase Storage

## De făcut tehnic
- [ ] Rutare domeniu → workspace + temă per workspace (Header-ul are „i-printsmart” fix în cod) — vezi 2.9
- [ ] Format export Cartum (CSV/Excel, URL poze?)
- [ ] Token API Moy Sklad pentru super-admin
- [ ] Denumiri magazine/depozite Moy Sklad → mapare `workspace_id`
- [ ] Analiza vânzărilor din Moy Sklad: ce se vinde împreună (bază pentru cross-sell)
