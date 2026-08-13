# VAJCO.cz — Požadavky na zpracování osobních údajů (GDPR)

> Zdroj obecných zásad: [ÚOOÚ – Základní příručka k ochraně
> údajů](https://uoou.gov.cz/verejnost/zakladni-prirucka-k-ochrane-udaju).
> Toto je technický/organizační návrh pro implementaci, ne právní
> stanovisko — konkrétní znění zásad zpracování by měl před spuštěním
> zkontrolovat právník.

## Jaké údaje sbíráme a proč

Rezervační formulář sbírá **jen to, co je nutné k vyřízení rezervace**:

| Údaj | Účel | Nutné? |
|---|---|---|
| Jméno a příjmení | identifikace rezervace při vyzvednutí | ano |
| Telefon | rychlý kontakt při problému se slotem/výdejem | ano |
| E-mail | potvrzení rezervace (do budoucna) | ano |
| Produkt, počet kartonů, termín, čas | obsah samotné rezervace | ano |
| Poznámka | nepovinný doplněk k rezervaci | ne (volitelné) |
| Souhlas se zpracováním (checkbox) | právní titul zpracování | ano |

**Vědomě nesbíráme** (v souladu se zásadou minimalizace): adresu
zákazníka, datum narození, pohlaví, platební údaje (platí se osobně na
místě, ne na webu).

## Právní titul zpracování

Primárně **plnění/příprava smlouvy** (čl. 6 odst. 1 písm. b) GDPR) —
zpracování je nutné k vyřízení rezervace, kterou si zákazník sám
vyžádal. Zaškrtávací pole souhlasu ve formuláři je doplňkové potvrzení
(transparentnost), ne jediný právní důvod — **checkbox samotný nesmí
být předvyplněný** (splněno — viz `ReservationForm.tsx`, `required`
bez `defaultChecked`).

## Doba uchování

**Zatím nedefinováno — potřebujeme rozhodnutí od vás.** Návrh: údaje o
vyřízených (vyzvednutých) rezervacích uchovávat např. 12 měsíců pro
účely řešení reklamací/nedorozumění, poté anonymizovat nebo smazat.
Zrušené rezervace lze mazat dřív. Než se rozhodne konkrétní lhůta,
databáze údaje **neuchovává automaticky napořád** — mazání zatím není
naimplementované jako automatický proces (bude potřeba buď plánovaná
úloha/cron, nebo ruční úklid administrátorem).

## Zabezpečení

- Databázové připojení jen server-side (Prisma client se nikdy
  nedostane do prohlížeče).
- Admin rozhraní chráněné heslem + podepsanou `httpOnly` cookie (viz
  `src/lib/admin-auth.ts`) — bez tohoto přihlášení nejde vidět žádnou
  rezervaci.
- Žádný veřejný endpoint nevrací seznam rezervací (`/api/availability`
  vrací jen agregovanou dostupnost slotů — počty zbývajících míst, ne
  jména/kontakty).
- Tajné hodnoty (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`,
  `DATABASE_URL`) jen v `.env`, nikdy v gitu (`.gitignore`), nikdy v
  klientském JS bundlu.

## Kdo má přístup

Zatím: kdokoliv se zná admin heslo (sdílené mezi zakladateli). Pokud
přibude třetí osoba (např. brigádník na výdeji), doporučujeme před tím
zvážit jednodušší rozlišení rolí — zatím to není implementováno (V1 má
jedno sdílené heslo).

## Služby třetích stran, které údaje dostávají

**Aktuálně žádné.** Mapa (OpenStreetMap dlaždice) nedostává osobní
údaje zákazníků — zobrazuje jen statickou polohu farmy. Pokud v
budoucnu přibude e-mailová notifikační služba (Resend/Postmark/...),
bude zpracovávat e-mail a jméno zákazníka jako **zpracovatel** — bude
potřeba to doplnit sem a do zásad zpracování na webu.

## Práva subjektu údajů (žádosti zákazníků)

Zatím **není samoobslužný mechanismus** (např. "smaž moje údaje"
tlačítko) — žádosti o výmaz/přístup/opravu se budou zpočátku řešit
ručně (e-mail/telefon → admin najde a smaže/upraví záznam v
administraci). To je v pořádku pro objem V1, ale je potřeba mít
**jasně napsané, na jaký kontakt se žádosti posílají** — tedy potřebujeme
kontaktní e-mail dřív, než zveřejníme stránku "Ochrana osobních údajů"
s konkrétním obsahem (aktuálně je jen placeholder).

## Co je hotové vs. co chybí

| Požadavek | Stav |
|---|---|
| Minimalizace sbíraných údajů | ✅ hotovo |
| Nepředvyplněný souhlas | ✅ hotovo |
| Zabezpečený přenos/uložení | ✅ hotovo (server-only DB přístup, gitignored `.env`) |
| Placeholder stránka „Ochrana osobních údajů" | ✅ hotovo (čeká na právní text) |
| Konkrétní doba uchování + automatický úklid | ❌ chybí — čeká na vaše rozhodnutí |
| Kontaktní bod pro žádosti subjektů údajů | ❌ chybí — čeká na e-mail |
| Formální text zásad zpracování | ❌ chybí — doporučujeme sepsat s právníkem |
