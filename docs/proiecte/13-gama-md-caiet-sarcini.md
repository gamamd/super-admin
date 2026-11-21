# 3.34.1 Caiet de sarcini — site nou gama.md (etapa 2) — 📝 ciornă 21.11.2026

Colectăm aici ideile pentru proiectul separat „Site nou gama.md”. Scop: crește calitatea site-ului, fidelizează clienții, crește vânzările. Statusuri: ✅ fericită (de reținut) · ❓ de decis cu Sergiu · 🔒 deja decis în alt proiect.

## 0. Ce avem deja notat (21.11.2026)
- 🔒 Poze mari standard 1200×1200 din MoySklad → [3.17](3.17-poze-produse.md), [3.26](3.26-poze-frumoase.md); 428 Комплект-e încă fără poză.
- 🔒 Plata MIA pe site prin **QR MIA comerciant** (link/QR dinamic per comandă, confirmare automată) → [3.18](3.18-verificare-plati-banca.md); plata cu cardul = alt serviciu maib (e-commerce), de întrebat.
- 🔒 Catalog propriu cu metadate complete, compoziții cu rețetă legate de Комплект-e, căutare vizuală după poza clientului, variantă configurator → [3.7.4](3.07.04-ai-agent-vanzari.md).
- 🔒 Descrieri pentru client: MoySklad „Контент для площадок” (fișă pe canal; denumirile interne BHF/K12/+He nu merg pe site) → 3.7.4 / 3.17.
- 🔒 Comenzile de pe site intră în MoySklad prin API → [3.7.3](3.07.03-inregistrare-comanda.md) → motorul [3.7.2](3.07.02-verificare-comanda.md).
- 🔒 Textele pe decor (Oracal, nume PVC) → [3.20](3.20-texte-banere-decor.md); e-Factura automată → [3.2.1](3.02.01-efactura.md).
- 🔒 Marketing, măsurare pe canal → [3.32](3.32-promovare.md). Asistent AI = API Anthropic, nu abonament (3.7.4).

## 1. Fundație (platforma)
- ✅ **Platformă multi-site**: un singur „creier” (catalog, stoc, comenzi, clienți) și mai multe vitrine (gama.md + site-urile planificate). Arhitectura se cheamă „headless” / multi-storefront — același backend servește mai multe site-uri și, ulterior, asistentul AI. ❓ alegere tehnologie (la proiectul separat).
- ✅ **MoySklad = sursa adevărului** (catalog, preț, stoc); site-ul nu duplică munca (etapa 3 din 3.34).
- ✅ Română + rusă complete (denumiri, conținut, SEO), comutare cu un click.
- ✅ Mobil primul (majoritatea comenzilor de baloane se plasează din telefon) + viteză mare.
- ❓ Pe același domeniu sau subdomeniu pe timpul tranziției de la Horoshop; redirecturi 301 pentru a păstra SEO.

## 2. Catalog și descoperire
- ✅ **Navigare pe ocazii**, nu doar pe categorii: zi de naștere (copil/adult/vârstă), externare, cumătrii, nuntă, aniversare, corporativ, absolvire, sezon (1 și 8 Martie, Paște, 1 Iunie, Crăciun). Fiecare ocazie = pagină cu compoziții gata, prețuri „de la”, întrebări frecvente.
- ✅ **Compoziții finite cu rețetă** (din Комплект-e / șabloane Decor): clientul vede poza decorului și ce conține; „comandă acest decor” cu un click. Piesa-cheie pentru vânzări: clientul cumpără rezultatul, nu 40 de baloane.
- ✅ **Configurator de decor** (arc, ghirlandă, set cifre, buchet): alegi tema + paleta (Baza 60% / Suplimentar 30% / Accent 10%, regula din șabloane) + mărimea; previzualizare și preț live. Se bazează pe șabloanele „GRUP …” deja create în MoySklad.
- ✅ **Filtre pe culoare, mărime, brand, finisaj**, cu paleta noastră fotografiată uniform; „culori care merg împreună”.
- ✅ **Căutare după poză** („vreau ceva ca în poza asta”) → cele mai apropiate compoziții (3.7.4).
- ✅ **Cifre și litere personalizate** (vârsta, nume): alegi cifra, culoarea, adaugi nume; legătură cu 3.20 (texte Oracal).
- ✅ **Seturi cu preț avantajos** („pachet petrecere”: arc + cifre + baloane cu heliu) cu prețul separat vs set afișat — standard în ecommerce pentru creșterea valorii comenzii.
- ❓ Compararea compozițiilor, listă de favorite (wishlist) trimisă pe Viber/WhatsApp unei persoane (soțul/soția decide împreună).
- ❓ Video scurt (10–15 s) pe compozițiile principale.

## 3. Comanda (checkout)
Checkout-ul e cel mai important punct: media abandonului coșului e ~70%, iar îmbunătățirea designului de checkout aduce în medie ~+35% conversie (Baymard).
- ✅ **Calendar de livrare cu data și intervalul orar**, zile blocate automat (sărbători, lipsa de capacitate), termen minim pe tip de produs (decorul complex cere mai mult timp decât baloane cu heliu). Cerut des de magazinele de baloane în alte țări.
- ✅ **Capacitate pe zi** din Freya/MoySklad: site-ul nu acceptă mai mult decât putem executa; zilele aglomerate (8 Martie) se închid singure.
- ✅ **Prețul livrării calculat pe adresă/zonă** (Chișinău, suburbii, Bălți etc.), harta adresei (se leagă de regula „adresă pe hartă” din 3.7.2).
- ✅ **Checkout scurt**: fără cont obligatoriu, un singur ecran pe mobil, câmpuri minime (telefon + adresă + dată). Contul se oferă după comandă.
- ✅ **Câmpuri specifice decorului**: vârsta, numele sărbătoritului, textul de pe decor, ora începutului sărbătorii, etaj/acces, persoana de contact la locație, mesaj pe felicitare. Intră direct în comanda MoySklad (3.7.2 verifică).
- ✅ **Plăți**: card Visa/Mastercard (maib e-commerce) + **MIA** + Apple/Google Pay unde e posibil; **avans** pentru decorurile mari (cu link/QR MIA, 3.18); plată la livrare doar pentru baloane simple. Plata cu cardul prin maib se oferă de la ~1,9% (de confirmat în contract); există integrări gata pentru platforme populare, iar maib acceptă și MIA în același pachet e-commerce.
- ✅ **Comandă prin chat**: buton „Comandă pe Viber/WhatsApp/Telegram” cu coșul deja completat (mulți clienți din Moldova preferă chat-ul).
- ❓ Rambursări și anulare cu reguli clare afișate (încredere); termen de modificare a comenzii.

## 4. Stoc, disponibilitate, substituiri
- ✅ **Disponibilitate reală pentru DATA aleasă**, nu doar „în stoc” (stocul DA/DD + Prag minim + comenzile în așteptare).
- ✅ **Substituire automată de brand/culoare** când produsul exact lipsește, cu acordul clientului („Nu avem Grabo roșu, avem Gemar roșu identic, ok?”) → [3.1.3](3.01.03-substituire-brand.md).
- ✅ Produsele nepotrivite/necompletate (fără poză, din „Propuneri”) nu apar pe site (regula „mapele finale”).
- ✅ Rezervarea stocului la plasarea comenzii; eliberare automată dacă plata nu vine în X minute.

## 5. Asistent AI în widget (etapa 4 din 3.34, detaliat în 3.7.4)
- ✅ Chat 24/7 în română/rusă: consultare (ce se potrivește pentru ocazia/vârsta/bugetul clientului), căutare în catalog, completare comandă prin unelte, răspuns la programe/livrare/prețuri. În studii despre asistenți AI de cumpărături apar creșteri de conversie de până la ~20% (McKinsey, citat de Shopify) — de măsurat în pilotul propriu.
- ✅ Clientul poate încărca poza decorului dorit → propuneri din catalog (3.7.4).
- ✅ **Predare către om** fără pierderea conversației (agentul vede tot istoricul în CRM) când e nevoie sau la cerere.
- ✅ Confirmare om la comenzile DD complexe (decizie 3.7.4); comenzile DA standard pot trece autonom după plată confirmată.
- ✅ Mențiune în politica de confidențialitate (conversațiile sunt procesate de un asistent AI).

## 6. Fidelizare (clienți care revin)
Datele din industrie: ~28% repeat rate mediu în ecommerce, iar clienții existenți aduc o parte mare din venit (stat. citate în studii despre loyalty) — pentru noi, ocaziile se repetă în fiecare an, deci potențialul e mare.
- ✅ **Calendarul sărbătorilor mele**: clientul salvează zilele de naștere ale copiilor/rudelor/colegilor; cu 2–3 săptămâni înainte primește amintire + propunere de decor (Viber/SMS/email). Pentru o afacere de ocazii, aceasta e cea mai naturală formă de fidelizare.
- ✅ **„Comandă din nou”** cu un click după istoric (aceeași compoziție, altă dată), cu poza decorului făcut.
- ✅ **Cont cu istoric + adrese salvate + facturi** (și e-Factura automată pentru persoane juridice).
- ✅ **Program de puncte / discount pe trepte** (simplu: după a 3-a comandă, reducere sau livrare gratuită; clienții VIP — corporativi, recurenți) ❓ forma exactă.
- ✅ **Recenzii cu poze reale** după livrare (cerere automată după X ore), publicate pe pagina compoziției.
- ✅ **Recomandare prieten**: cod de reducere pentru ambii.
- ✅ **Carduri cadou / vouchere** (mai ales pentru nașteri, nunți, corporativ).
- ✅ Mesaj automat de „mulțumesc” după eveniment + poza finală a decorului (din Freya, atelierul o poate încărca), cu buton „distribuie” (reclamă gratuită).
- ❓ Cercul „Clienți corporativi”: prețuri speciale, contract anual, factură lunară.

## 7. Încredere și conținut (conversie + SEO)
- ✅ **Portofoliu real**: lucrările noastre, legate de rețeta din MoySklad și de ocazie (arhiva de comenzi cu poza decorului finit — 3.7.4 cere salvarea pozei pe fiecare comandă din 29.10).
- ✅ Pagini „Cum lucrăm” (de la comandă la montaj), garanții (heliu, termenul de plutire), prețuri transparente „de la … MDL”, FAQ (cât ține heliul, cât în avans, cum se anulează).
- ✅ Recenzii Google/Facebook afișate; poze „înainte/după” de la montaj.
- ✅ Ghiduri utile (cum alegi decorul pentru externare, cumătrii, aniversarea copilului) — conținut care aduce trafic din Google.
- ✅ SEO local: Chișinău, cartiere, „baloane cu heliu livrare”; date structurate (produs, preț, disponibilitate, recenzii), feed Google Merchant.
- ❓ Blog / secțiune idei și tendințe de decor (sezon).

## 8. Corporativ (B2B)
- ✅ Pagină „Corporativ / evenimente” cu cerere de ofertă, portofoliu corporativ (ghirlande, logotipuri Egor Print, piloni), ofertă PDF generată.
- ✅ IDNO la comandă → **e-Factura emisă automat** în ziua livrării (deja funcționează în sistem, 3.2.1).
- ❓ Cont de firmă cu mai mulți utilizatori, istoric facturi. (Tipuri de preț pe grupuri de clienți se obțin pe platformele cu funcții B2B.)

## 9. Marketing și măsurare (legat de 3.32)
- ✅ **Sursa comenzii** (UTM / canal / campanie) salvată pe comanda MoySklad → cost pe comandă și rezultat pe canal.
- ✅ Pixel/Conversions API Meta, Google Ads, GA4, TikTok — evenimente corecte (vizualizare, coș, plată).
- ✅ **Recuperare coș abandonat** (email / SMS / Viber, după 1 oră și 24 h) și „ai uitat să alegi ora livrării”.
- ✅ **Landing-uri sezoniere** gata înainte de vârf (1 și 8 Martie, Paște, 1 Septembrie, Crăciun) cu termen limită de comandă și stoc dedicat (legătură 3.12 Prag minim).
- ❓ Newsletter și segmentare după ocazie.

## 10. Operare și integrare (spatele comenzii)
- ✅ Comanda de pe site → MoySklad (3.7.3) → verificare 3.7.2 → Freya (atelier, livrări), fără retastare.
- ✅ **Statusul comenzii către client** (acceptată, în pregătire, pe drum, livrată) pe SMS/Viber/email.
- ✅ **„Curierul e în drum”**: link cu locația, din TrackGPS (3.10).
- ✅ Poza decorului final în contul clientului și în mesajul de mulțumire.
- ✅ Chestionar scurt după livrare (nota 1–5); notele mici ajung la Sergiu (se leagă de 3.14.6 raportare calitate).
- ✅ Panou intern: comenzi site, abandon, vânzări pe ocazii/canal, produse căutate dar indisponibile (semnal pentru aprovizionare).

## 11. Cerințe nefuncționale
- Viteză mobilă, securitate (plăți conform cerințelor băncii: siglele și informațiile cerute pe site), backup, GDPR / politică de confidențialitate, accesibilitate, jurnal de erori.
- Fără dependență de o singură platformă: datele rămân în MoySklad + baza noastră (legat de 3.6 și „independența MoySklad”).

## 12. Priorități propuse (de confirmat)
**MVP (primul lansat):** catalog din MoySklad pe ocazii + compoziții cu rețetă · calendar de livrare cu capacitate · checkout scurt cu câmpuri de decor · plată card + MIA · comandă în MoySklad · RO/RU · SEO de bază · Pixel/GA4.
**Valul 2:** asistent AI · configurator · căutare după poză · cont + „comandă din nou” · calendarul sărbătorilor · recenzii cu poze · coș abandonat · corporativ cu e-Factura.
**Valul 3:** puncte/VIP · recomandare prieten · carduri cadou · poze/status/tracking în cont · multi-site complet.

## 13. Întrebări deschise pentru Sergiu
- Pe ce se bazează acum cele mai multe comenzi (chat, telefon, site)? Cât din comenzi vin de pe site-ul actual?
- Livrăm în afara Chișinăului? Care zone și ce prețuri?
- Vrem plata integrală online sau doar avans? Ce facem cu plata la livrare?
- Ce tip de reduceri/puncte acceptăm fără să afectăm marja?
- Site-ul nou înlocuiește Horoshop complet sau merg în paralel la început?
- Care sunt celelalte site-uri planificate (domenii/teme diferite) — pentru a proiecta platforma comună?

## Surse (studiu 21.11.2026)
- Baymard Institute — cart abandonment ~70% și +35% conversie din designul checkout: https://baymard.com/research/checkout-usability
- Shopify (cu McKinsey) — asistenți AI de cumpărături: https://www.shopify.com/blog/ai-personal-shopper
- Date repeat rate / loyalty: https://www.sender.net/marketing-glossary/repeat-purchase-rate/statistics/ · https://www.rivo.io/blog/loyalty-program-statistics
- maib e-commerce (carduri, MIA): https://www.maib.md/en/persoane-juridice/e-commerce/e-commerce · https://www.maib.md/en/maib-people/elena-guneavoi-mia-in-solutiile-e-commerce-maib-interviu-cu-elena-guneavoi-product-manager-payments-in-cadrul-maib
- Multi-store / headless: https://www.hostinger.com/tutorials/?p=158827 · https://www.salesforce.com/commerce/multi-store-ecommerce/
- Calendar de livrare pentru magazine de baloane: https://beyondspace.studio/case-studies/empowering-balloon-decor-services-case-study-of-party-labs
- Concurenți locali văzuți pe Glovo Chișinău (seturi numerotate „Baloane cu heliu #NN”, 150–1 950 MDL, fără configurator): https://glovoapp.com/eu/md/chisinau/stores/mia-flori-ksn
- Notă: cifrele din surse externe sunt orientative; nu sunt măsurate pe gama.md.
