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
- Notă 22.11.2026: ✅ aici = pas **aprobat** în ordine, nu executat. Execuția se urmărește în hartă (`docs/harta/`). Pasul 1 executat, testat adversarial și live pe producție la 22.11.2026 (🛡).
Bază: auditul codului din 21.11.2026 — codul existent e al i-PrintSmart (ID workspace hardcodat în 10 fișiere, Header/Footer/home/editor foto); pentru gama.md lipsesc toate piesele MVP. Model între paranteze, conform `00-reguli.md`.
1. ✅ Fundația multi-tenant: rutare domeniu → workspace, scos ID-ul hardcodat, temă per workspace, protejat `POST /api/products` (Opus) — 🛡 executat 22.11.2026
2. ✅ Schema DB gama: produse + rețetă, ocazii, ID-uri MoySklad, comenzi cu decor și slot, zile blocate, RLS (Opus; SQL rulat de Sergiu)
3. ✅ Sync MoySklad read-only, doar mapele indicate de Sergiu (Opus; necesită token API + mapare depozite)
4. ✅ Catalog și produs gama + RO/RU real (Sonnet)
5. ✅ Coș persistent în DB + checkout scurt cu decor și calendar, preț calculat pe server (Opus)
6. ✅ Plăți în mod test (MIA QR, card, avans, la livrare), apoi comanda → MoySklad 3.7.3 (Opus; necesită decizia Paynet/MAIB și regula pe tip de produs)
7. ✅ SEO de bază, `noindex`, GA4/Pixel, confidențialitate (Sonnet)
8. ✅ Admin (listă comenzi, zile blocate, editare produs), apoi teste pe preview Vercel (Sonnet)
- 21.11.2026: azi se notează doar fundamentul (meniul + ordinea); nu se implementează nimic.

## Site ↔ MoySklad: catalog și compoziții (23.11.2026)
Explicația lui Sergiu; MoySklad are deja logica ei, iar site-ul o oglindește.

### Catalogul „Produse”
- ✅ Categoria „Produse” a site-ului = **oglinda mapelor din MoySklad**: Articole Sărbători/Produse, Baloane cu heliu, Produse, Servicii. Corecturi de nume sau grupare mapă → categorie se pot face doar pe site. ❓ lista exactă a mapelor și a corecturilor (se întreabă la pasul 3, conform regulii „cu ce mape lucrăm”).
- ✅ Din MoySklad vin pozele, stocul și, în mare parte, categoriile. Scop: tot stocul din MoySklad prezentat pe site.
- ✅ „Produse” = sursa adevărului pentru **toate celelalte categorii** ale site-ului (ocazii, compoziții etc.): sunt vederi peste același catalog.
- ✅ Etichetele de ocazie, filtrele și sezoanele se atribuie **pe site** (nivel separat, fără legătură cu MoySklad). Nu contrazic „MoySklad master” pentru stoc, preț, poze și descrieri.
- ✅ „Servicii” nu sunt produse pe site, ci opțiuni în comandă.
- ✅ **Fără stoc → produsul nu apare** (nici în categoriile derivate).
- ✅ Produsele făcute sau aduse la comandă apar cu mențiunea „la comandă”. Se rezolvă de obicei în câteva ore; termenul nu se afișează, rămâne doar idee. ❓ cum se marchează în MoySklad.
- ✅ **Rezervarea stocului doar la plată**, nu din coș (coșurile abandonate fac probleme). ❓ plata la livrare: rezervare la confirmarea comenzii. Caietul, sec. 4, spune „la plasarea comenzii, eliberare dacă plata nu vine”: de aliniat (propunere, caietul nu se modifică fără aprobare).
- ✅ Poze: sursa de bază = MoySklad; se vor genera multe poze individuale. ❓ unde se păstrează pozele generate (MoySklad nu se modifică de pe site).
- 📝 Substituirea brandului: proiectul „Substituire brand” (3.1.3, Comenzi materiale) e în dezvoltare. Se implementează pe site după ce e finalizat acolo.

### Compoziții editabile (diferența față de concurență)
- ✅ Categoriile cu compoziții: clientul editează pe pagina produsului:
  1. **cantitatea**
  2. **modelul**
  3. **adaugă** orice produs din stoc
  4. **elimină** complet un element din model
- ✅ Elementele obligatorii nu apar ca opțiune de eliminare (ex. heliul la balonul cu heliu). ❓ unde se marchează „obligatoriu” (rețetă în MoySklad sau pe site): se decide la schema DB (pasul 2).
- ✅ Manopera e inclusă mereu în prețul final → neglijată în calcul; cazurile speciale se discută individual.
- ✅ Clientul vede vizual compoziția aleasă. Se dezvoltă pas cu pas până la lansare: (a) listă cu pozele componentelor, (b) schemă aranjată din poze, (c) imagine AI. ❓ ce nivel la lansare.
- 📝 Partea grea a proiectului. Pasul 2 (schema DB) trebuie să acopere: rețetă cu componente (cantitate, obligatoriu), stoc pe componente, compoziția editată salvată în comandă și fișa de producție.

## Comunicarea cu clienții (23.11.2026) — sursa comenzilor
- ✅ Atenție deosebită: canalele de comunicare aduc comenzile. Trebuie **numerotate exact canalele** și **metodele de gestiune**. ❓ Lista se completează cu Sergiu; candidați propuși (💡, de confirmat): 1 telefon · 2 Instagram · 3 Facebook · 4 Viber · 5 WhatsApp · 6 Telegram · 7 site (coș și checkout) · 8 chat/asistent AI de pe site · 9 email · 10 SMS (doar notificări?) · 11 vizită la oficiu/atelier · 12 Horoshop (până la închidere) · 13 reclame. Pentru fiecare: cine răspunde, unde ajunge în CRM, cum devine comandă.
- ✅ CRM-ul (`crm-gamamd`) e proiect separat, dezvoltat dar nefinalizat; se finalizează în paralel acolo, iar site-ul se integrează (6.16). Nu se atinge din acest proiect.
- ✅ La un moment dat, vânzările pe site le face un **asistent AI** super pregătit, capabil să consulte 100% orice comandă (caiet sec. 5, 3.7.4). Muncă migăloasă; se face.
- ✅ **Comanda de pe site merge automat în MoySklad** (3.7.3 → 3.7.2), fără intervenție manuală. Ținta rămâne automatul; trecerea pe comenzi reale doar cu aprobarea explicită (00-reguli).

## SEO: vizibilitate în asistenți AI (ChatGPT, Gemini, Claude) (23.11.2026)
- 📝 Cerut de Sergiu: scenarii ca gama.md să fie recomandat în răspunsurile asistenților AI. Se adaugă la SEO (cap. 10, punctul 10.11). Detaliile de mai jos sunt 💡 propuse, de aprobat.
- 💡 **Fundamentele SEO rămân baza**: asistenții AI se sprijină pe aceleași indexuri și semnale (Google, Bing).
- 💡 **robots.txt:** permitem boții de căutare AI (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot) și Googlebot/Bingbot. Boții de antrenare (GPTBot, ClaudeBot, Google-Extended) sunt o decizie separată ❓; blocarea lor nu schimbă clasarea în Google. Lista de boți se reverifică la implementare.
- 💡 **Date de produs curate și complete, citibile de mașini:** Product + Offer (preț, stoc), componență, înălțime, durata de zbor, livrare; feed Google Merchant din MoySklad.
- 💡 **Conținut gata de răspuns:** pagini de ocazie cu FAQ („ce baloane pentru externare”, „cât costă decorul de botez”), text real pe pagină (nu în imagini), RO și RU.
- 💡 **Dovezi externe:** asistenții se bazează pe surse care se confirmă între ele → recenzii reale, Google Business Profile, mențiuni pe alte site-uri, social.
- 💡 **Randare pe server și viteză**, ca boții să vadă conținutul fără JavaScript.
- 💡 **Măsurare:** listă de întrebări reale RO/RU testate lunar în ChatGPT, Gemini, Claude, Perplexity (punct de plecare înainte de lansare), vizitele boților în loguri, trafic din chat-uri în GA4.
- ❓ Mai târziu: vânzare direct în asistenți AI („comerț agentic”), dacă devine posibil pentru Moldova.
- Surse (23.11.2026): ghidul Shopify „AI Discoverability Checklist”, ghidul Yotpo despre GEO, liste de boți AI (Hostinger, Search Engine Journal).

## Harta site-ului: grupul „Front-end” (23.11.2026)
- ✅ Cerere: în hartă, un grup aparte **Front-end** cu toate funcțiile fiecărei pagini și legăturile lor cu celelalte mecanisme, ca să nu scape nimic. Se stabilește toată partea tehnică, abia apoi se trece la lucru.
- 📝 Pagini: Home · Catalog și ocazii · Produs · Compoziție editabilă · Coș și checkout · Livrare · Căutare · Cont și urmărire · Contact și asistent AI · Conținut și încredere. Detaliul fiecărei funcții și legăturile sunt în hartă (`docs/harta/`).

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
11. Livrare — ❓ (categorie aparte în meniu, decis 22.11.2026; confirmat 23.11.2026: **calcul complex**: zone pe km, prag de livrare gratuită, oră fixă, intervale de 30 min, maternitate; regulile se stabilesc la aria D, înainte de cod)

## Nedecis încă
- [ ] ⚠️ URGENT (SEO): URL-uri — păstrăm cele vechi 1:1 sau curățăm + redirect 301 (pentru aria I)
- [ ] Meniul principal — lista categoriilor e notată mai sus (21.11.2026); rămân de explicat conținutul fiecăreia și rolul „Produse” (toate produsele sau categorie separată)
- [ ] Lista numerotată a canalelor de comunicare cu clienții + metodele de gestiune (23.11.2026)
- [ ] Mapele MoySklad oglindite și corecturile de categorie; marcajul „la comandă” și „obligatoriu” în MoySklad
- [ ] Rezervarea stocului la plată: cazul plății la livrare; alinierea caietului, sec. 4
- [ ] Unde se păstrează pozele generate individual
- [ ] Nivelul vizual al compoziției la lansare (listă / schemă / AI)
- [ ] Boții de antrenare AI (GPTBot, ClaudeBot, Google-Extended): permiși sau nu
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

## Design și vitrină: catalog și produs (pasul 4)
Tema de design a site-ului gama.md; include vitrina (home, catalog, produs) din pasul 4 al „Ordinii lucrărilor”. Platforma (cap. 3) dă motorul de teme; aici doar specificul gama.md.

### Principii (22.11.2026)
- ✅ 22.11.2026: site-ul trebuie să fie **super estetic**; design făcut de un designer pentru **toată povestea** (home, catalog, produs, configurator, checkout, livrare), cu o singură direcție vizuală.
- ✅ 22.11.2026: **actualizare periodică a designului** (bannere, vitrine, vizuale sezoniere), la intervale regulate.
- ✅ 22.11.2026: **factor uman minim, automatizare maximă** → designeri AI, inclusiv pentru actualizările periodice. Sergiu nu e sigur că Claude Design e suficient pentru design de site (netestat).
- ❓ Care unealtă AI: se decide prin **pilot** — aceeași temă (home + pagină produs) în 3 unelte (candidate: Claude Design, v0 al Vercel, Figma Make); Sergiu alege pe rezultat.
- 💡 Recomandat: Claude Design (concept + machete) → implementare în cod de Claude. Alternativă: v0 (Vercel).
- Flux: brief (brand, public, referințe mondiale) → design system → machete mobil-first (home, categorie, produs + configurator, checkout) → iterații → implementare

### Puncte de design (📝 notate 22.11.2026; se discută pe rând)
Sursa: caiet secț. 2, 7, 11, 14 și aria A–B din acest capitol. 💡 = propus de Claude, de aprobat de Sergiu.
- 📝 Direcție vizuală și brand — 💡 o singură direcție, referințe mondiale (benchmark)
- 📝 Design system gama.md — 💡 culori, tipografie RO/RU, componente, ghid de stil aplicabil automat
- 📝 Mobil-first, text și butoane mari, contrast ridicat (caiet 14)
- 📝 Home / vitrina principală cu sezonul activ și bannere sezoniere automate (aria A)
- 📝 Meniu (11 categorii), antet cu zona de livrare aleasă o dată, căutare cu sugestii (caiet 14)
- 📝 Card produs și listare: preț „de la”, „cel mai devreme”, Hi-Float; filtre în cascadă, panou mobil (aria A)
- 📝 Pagină de ocazie (landing SEO și destinație pentru reclame) (caiet 2)
- 📝 Pagina produsului: galerie cu scară, componență + înălțime, durata de zbor, bară de livrare gratuită, selector maternitate (aria B)
- 📝 Configurator: interfață — paleta 60/30/10, previzualizare și preț live (caiet 2; construirea = aria C)
- 📝 Coș și checkout: rezumat ca un bon, previzualizarea textului, calendar, adresă cu pin, canal de confirmare (caiet 14)
- 📝 Pagina și elementele „Livrare” (categorie aparte)
- 📝 Stil fotografie și imagini — 💡 fundal, lumină, scară uniforme; stilul se aplică la sursă (poza stă pe Комплект)
- 📝 Blocuri de încredere: portofoliu, recenzii, „Cum lucrăm”, garanții, FAQ (caiet 7)
- 📝 Urmărire comandă și mesaje în același stil (caiet 14)
- 📝 Microcopy RO/RU — 💡 lungimi diferite, chirilică, verificare ortografică
- 📝 Stări goale, erori, 404, zero rezultate (caiet 14)
- 📝 Design și viteză (Core Web Vitals) — designul nu strică scorul Google Ads
- 📝 Accesibilitate (caiet 11)
- 📝 Actualizare periodică și pilotul de designeri AI (vezi Principii)

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

## Stare la sfârșitul sesiunii 22.11.2026
- ✅ Pasul 1 (fundația multi-tenant) executat, testat adversarial (preview + producție) și live; commit `c9594ef` (cod) și `7312dbb` (docs). Dovezi: `docs/teste/pas-1-multi-tenant.md`.
- Infrastructură rămasă după pasul 1: variabilele Supabase există acum și la Preview în Vercel; `workspace_domains` conține 3 domenii Vercel (toate → i-PrintSmart); previzualizare = adresa branch-ului + `?ws=gama` / `?ws=i-printsmart` / `?ws=off` (doar în afara producției).
- ⚠️ N6: consumatori externi ai `/api/products?workspace=` necunoscuți (Request Logs, ultima oră: 0 cereri; istoric Hobby scurt, nu e dovadă) → risc acceptat, de reverificat la pasul 4.
- 📝 N8: textele paginii de start și footer sunt scrise în cod și identice la toate workspace-urile → pasul 4.
- Următorul pas: 2 (schema DB gama + RLS, **Opus**) — începem cu lista de atacuri, înainte de cod. Constatări de rezolvat acolo: `OrderStatusUpdater` schimbă statusul din browser (RLS pe `orders`).
- Deschise (❓): pilotul de design (3 direcții de propus din benchmark) · alegerea instrumentului AI de design prin pilot · ⚠️ URGENT URL-uri (1:1 vs curățate + 301) · regula de plată pe tip de produs · livrare în afara Chișinăului · pasul 5: preț și comandă calculate pe server.
