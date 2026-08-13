# VAJCO.cz — Launch Checklist

> Status: **žádná položka zatím není odškrtnutá jako "hotovo pro
> produkci"** — tenhle dokument je cílový stav před tím, než na `www.vajco.cz`
> půjde ostrý provoz se skutečnými platbami a osobními údaji.

## Právní / obchodní (viz `PROJECT_AUDIT.md`)

- [ ] Potvrzený právní provozovatel (kdo je prodávající — sekce E auditu).
- [ ] Ohlášený "prodej ze dvora" / registrace hospodářství u krajské veterinární správy.
- [ ] IČO a sídlo doplněné do Obchodních podmínek a patičky.
- [ ] Obchodní podmínky napsané (ne placeholder) — potvrzené, že "rezervace" je nezávazná, platba na místě.
- [ ] Zásady zpracování osobních údajů napsané (ne placeholder), s konkrétní dobou uchování.
- [ ] Potvrzeno, zda smí být použito označení "BIO" — pokud ne, zůstává „volný chov / volný výběh".
- [ ] Kód producenta na vejcích a značení kartonu odpovídá skutečnému registračnímu číslu hospodářství.

## Obsah

- [ ] Kontakty: e-mail, telefon doplněné (aktuálně placeholder).
- [ ] Ceny a produkty odpovídají realitě v den spuštění.
- [ ] Informace o farmě (Klentnice) a výdejním místě (Komín) — přesná adresa doplněná.
- [ ] Reálné fotografie nahrazují `PhotoPlaceholder` bloky (s ověřenou licencí / vlastní tvorbou).
- [ ] Mapa ukazuje přesné (ne přibližné) GPS souřadnice farmy — `farm.isApproximate = false`.

## Technické

- [ ] Databáze: přechod ze SQLite na Postgres/Supabase (`prisma/schema.prisma` provider + `DATABASE_URL`), `npx prisma migrate deploy` proběhlo bez chyb.
- [ ] `ADMIN_PASSWORD` a `ADMIN_SESSION_SECRET` nastavené na silné, unikátní hodnoty v produkčním prostředí (ne dev hodnoty z `.env.example`).
- [ ] Kapacity a výdejní časy v `src/config/reservations.ts` odpovídají reálnému provozu, ne demo hodnotám.
- [ ] Race-condition ochrana kapacity dořešená transakčně (viz `PROJECT_AUDIT.md`, Riziko #1).
- [ ] Idempotenční ochrana proti duplicitnímu odeslání rezervace (Riziko #2).
- [ ] E-mailové potvrzení rezervací funkční (transakční e-mail, ne jen UI potvrzení).
- [ ] Export rezervací do CSV v adminu.
- [ ] Zálohování databáze nastavené (u Supabase: point-in-time recovery / pravidelný export).
- [ ] Error tracking (např. Sentry) zapojený na produkci, bez logování osobních údajů v čistém textu.

## Doména a e-mail

- [ ] `www.vajco.cz` směřuje na produkční nasazení (Vercel doporučeno, viz `README.md`).
- [ ] `vajco.cz` (bez www) přesměrovává na `www.vajco.cz`.
- [ ] HTTPS aktivní a vynucený.
- [ ] Pokud se posílají transakční e-maily: SPF, DKIM, DMARC nastavené pro doménu, ze které se posílá.

## SEO a analytika

- [ ] `NEXT_PUBLIC_SITE_URL` nastavené na `https://www.vajco.cz` v produkčních env proměnných.
- [ ] Google Search Console ověřená doména, sitemap odeslaná.
- [ ] Google Business Profile založený (po potvrzení adresy výdejního místa) — **nezakládat automaticky, jen po vašem schválení**.
- [ ] Analytika (cookie-less nástroj dle doporučení) zapojená, cookie lišta doplněná jen pokud přibude nástroj, který ji vyžaduje.

## Test před spuštěním

- [ ] Celý `QA_CHECKLIST.md` proběhlý na produkčním (nebo staging) prostředí, ne jen lokálně.
- [ ] Zkušební rezervace od začátku do konce provedená reálným člověkem na mobilu i desktopu.
- [ ] Admin ověřil, že vidí testovací rezervaci a umí změnit její stav.
