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

## Funcționalități — 💡 propuse, de confirmat de Sergiu
1. Catalog & căutare: navigare pe ocazie + pe tip; filtre (ocazie, vârstă, băiat/fată, culoare, buget, livrare azi); căutare RO/RU cu toleranță la greșeli și transliterare; vitrine sezoniere automate pe calendar
2. Pagină produs: galerie foto+video; nume descriptiv + cod; compoziție din componente; configurator (culori, cifră vârstă, text cu previzualizare live, preț live); disponibilitate reală + „livrare azi până la ora X”; produse complementare; recenzii cu foto
3. Constructor de compoziție (diferențiator): clientul compune singur, preț + imagine live
4. Checkout: o pagină, fără cont obligatoriu; sloturi reale de 30 min cu capacitate; adresă cu hartă + cost livrare automat; destinatar diferit, mesaj felicitare, livrare surpriză; livrare la maternitate; comandă rapidă; plată online/curier/factură
5. După comandă: confirmare + status pe SMS/Viber/Telegram; urmărire + foto la livrare; cerere recenzie; reamintire anuală
6. Cont client: login fără parolă; istoric, „repetă comanda”, adrese, date importante; Discount Card digital, puncte
7. Decor evenimente & chirie: portofoliu; cerere ofertă cu dată; calendar disponibilitate; chirie cu retur/garanție
8. Corporate (B2B): cerere ofertă, factură pe IDNO, comenzi recurente
9. SEO & conținut: RO/RU complet; URL-uri vechi + 301; schema.org; sitemap; pagini de idei
10. Performanță: mobil-first, < 1 s, Core Web Vitals verzi, imagini optimizate
11. Marketing & analitică: GA4, Meta Pixel + Conversions API, Google Ads, feed Google Merchant / Meta, sursa comenzii → CRM
12. Admin & integrări: comenzi, sloturi, curieri, componente, prețuri, sezoane, conținut; Moy Sklad, CRM (webhook), plăți, SMS/Viber

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

## Decizii deschise
- [ ] Confirmare listă funcționalități
- [ ] Plată online: Paynet sau MAIB ePay
- [ ] Sursa adevărului: preț + stoc din Moy Sklad, poze + descrieri în Super Admin
- [ ] Nume descriptive produse (pe lângă cod)
- [ ] Unealta de design

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
