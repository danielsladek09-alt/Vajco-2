# VAJCO.cz — QA Checklist

> Status: **připraveno k provedení** po schválení auditu a dokončení
> zbývajících fází. Zaškrtávejte při ostrém testování před spuštěním
> a po každé větší změně.

## Homepage

- [ ] Desktop (1440px+): Hero, Why, Products, Reservation, Pickup, Farm, About, Final CTA se zobrazují bez přetečení/ořezu.
- [ ] Tablet (768–1024px): grid sekcí se správně zalamuje na 1–2 sloupce.
- [ ] Mobile (360–430px): žádný horizontální scroll, texty se nepřekrývají, CTA tlačítka jsou dosažitelná palcem.
- [ ] Všechny kotvy v menu (`#nase-vejce`, `#o-nas`, `#farma`, `#rezervace`) skutečně scrollují na správnou sekci.
- [ ] Mobilní hamburger menu se otevře/zavře, po kliknutí na odkaz se zavře a scrollne správně.

## Rezervace

- [ ] Rezervace 12 vajec — happy path, potvrzovací obrazovka ukazuje správný souhrn a cenu.
- [ ] Rezervace 30 vajec — happy path.
- [ ] Rezervace více kartonů (2–10) — cena se přepočítá správně, nad limit (`maxCartonsPerReservation`) nejde přidat.
- [ ] Neplatný e-mail → lidská chybová hláška, ne technická.
- [ ] Neplatný telefon → lidská chybová hláška.
- [ ] Prázdné jméno → lidská chybová hláška.
- [ ] Výběr plně obsazeného slotu → nejde vybrat / server odmítne se srozumitelnou hláškou.
- [ ] Výběr termínu, který mezitím (jiným requestem) obsadil někdo jiný → server-side kontrola kapacity zamítne rezervaci se srozumitelnou hláškou, ne 500.
- [ ] Dvojklik na "Rezervovat vejce" nevytvoří dvě rezervace (viz `PROJECT_AUDIT.md`, Riziko #2 — ověřit po doplnění idempotenčního klíče).
- [ ] Zrušení rezervace v adminu — zákazníkovi zmizí možnost ji "znovu potvrdit" (stavový přechod dává smysl).
- [ ] Honeypot pole (`website`) vyplněné → rezervace se tiše zahodí, žádná chyba pro bota, žádný záznam v DB.
- [ ] Rate limit (5 rezervací / 10 min z jedné IP) → po překročení se zobrazí srozumitelná hláška.

## Admin

- [ ] Přístup na `/admin` bez přihlášení → redirect na `/admin/login`.
- [ ] Špatné heslo → chybová hláška, žádný přístup.
- [ ] Správné heslo → přístup k dashboardu, session vydrží nastavenou dobu (8 h).
- [ ] Seznam rezervací se zobrazuje, filtr podle data funguje.
- [ ] Změna stavu rezervace (Nová → Potvrzená → Vyzvednuto / Zrušená) se okamžitě projeví.
- [ ] Odhlášení zruší session cookie a znovu vyžaduje heslo.
- [ ] Export do CSV — *doplnit test, až bude implementováno (Fáze 8)*.

## Security

- [ ] Nepřihlášený uživatel nemá přes žádné URL přístup k datům rezervací (jménům, telefonům, e-mailům).
- [ ] Přímý request na `/api/availability` vrací jen agregované počty (kolik zbývá míst), ne osobní údaje.
- [ ] Změna ceny/kapacity v požadavku z prohlížeče (např. přes devtools) nemá vliv — server si cenu i kapacitu vždy dopočítá sám z configu a DB.
- [ ] `.env` není v gitu, `git log` neobsahuje žádné heslo/secret.
- [ ] Admin cookie je `httpOnly` (ověřit v devtools, že není čitelná z `document.cookie`).

## SEO

- [ ] `<title>` a meta description na homepage i podstránkách odpovídají obsahu.
- [ ] `sitemap.xml` a `robots.txt` dostupné a validní.
- [ ] Open Graph náhled (title/description/image) vypadá dobře při sdílení odkazu.
- [ ] Strukturovaná data (`OrganizationJsonLd`) validní přes Rich Results Test.
- [ ] Nadpisová hierarchie (h1 → h2 → h3) dává smysl, jen jeden `<h1>` na stránku.

## Performance

- [ ] Obrázky/fotky (až budou reálné) mají definovanou velikost a lazy loading mimo Hero.
- [ ] Lighthouse (mobile) — Performance, Accessibility, Best Practices, SEO ≥ 90 jako cíl.
- [ ] Mapa (Leaflet) se načítá až po interakci/scrollu do sekce, ne blokuje první vykreslení stránky.
- [ ] Fonty se načítají s `display: swap` (bez blikání layoutu / bez neviditelného textu).

## Accessibility

- [ ] Kontrast textu na krémovém i tmavém pozadí splňuje WCAG AA.
- [ ] Formulář má správně napojené `<label>` na všechna pole.
- [ ] Celý rezervační formulář jde vyplnit jen klávesnicí (tab pořadí dává smysl).
- [ ] Focus stavy jsou viditelné (žádné `outline: none` bez náhrady).
- [ ] `prefers-reduced-motion` vypne/zkrátí animace (ověřit v OS nastavení).
- [ ] Mapa má textovou alternativu (adresa/popis vedle mapy, ne jen vizuální).
