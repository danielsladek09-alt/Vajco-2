# VAJCO.cz — Předvývojový audit (Fáze 0)

> Status: **K SCHVÁLENÍ**. Toto je analýza, ne popis hotového řešení. Dokud
> tenhle dokument neschválíte (a nedáte odpovědi v sekci „Nevyřešené
> otázky"), stavba webu dál nepokračuje nad rámec toho, co už existuje
> jako pracovní koncept.

## A. Co přesně stavíme

- **VAJCO** je nová česká značka prodávající čerstvá vejce z vlastního
  chovu, kterou založili dva kamarádi (17 a 15 let).
- **Zákazník**: primárně lidé z Brna a okolí, kterým záleží na tom, odkud
  jídlo pochází, a jsou ochotní si pro něj osobně dojet.
- **Co prodáváme**: karton 12 vajec (106,80 Kč) a karton 30 vajec (267 Kč),
  8,90 Kč/vejce, z volného chovu na podestýlce, farma u Klentnice na
  Pálavě.
- **Jak funguje "rezervace"**: zákazník na webu vybere počet vajec, termín
  a čas vyzvednutí, zadá kontakt a odešle. Online se nic neplatí — platba
  proběhne až na místě při vyzvednutí.
- **Kde se vyzvedává**: výdejní místo v Brně-Komíně (přesná adresa zatím
  není určená).
- **Kde vejce vznikají**: farma v Klentnici, vedle Café Fara, na Pálavě.
- **Hlavní cíl webu**: přimět návštěvníka k odeslání rezervace (ne k
  platbě online — to je zásadní rozdíl oproti klasickému e-shopu).
- **Sekundární cíle**: vybudovat důvěryhodnost nové značky, vyprávět
  příběh dvou mladých zakladatelů, připravit základ pro budoucí růst
  (víc produktů, víc výdejních míst, celorepublikový dosah).

---

## B. Nevyřešené otázky

Rozdělené podle toho, kdo je může (musí) vyřešit.

### ZNÁME (ze zadání)
- Ceny, produkty, farma (Klentnice), výdejní město/čtvrť (Brno-Komín),
  věk zakladatelů, hlavní brand sdělení.

### NEZNÁME — musíme dostat od vás
| # | Otázka | Proč je to blokující |
|---|---|---|
| 1 | Přesná adresa výdejního místa v Komíně | Bez ní nejde nic doručit/navigovat, ani slíbit zákazníkovi místo |
| 2 | Přesné GPS souřadnice farmy (Klentnice) | Aktuálně web ukazuje jen přibližný střed obce — viz `farm.isApproximate` v configu |
| 3 | Konkrétní výdejní dny a hodiny | Demo config má st/pá/so 15–18 h — je to reálné, nebo si to vymýšlíme? |
| 4 | Maximální kapacita na slot (rezervací i kartonů) | Kolik vajec fyzicky zvládnete připravit na jeden výdej? |
| 5 | Kdo rezervaci potvrzuje a jak | Potvrzuje se automaticky, nebo ji někdo z vás ručně schvaluje? |
| 6 | Co se stane při nevyzvednutí | Propadá rezervace? Voláte zákazníkovi? Časový limit? |
| 7 | Lze rezervaci měnit/rušit zákazníkem samostatně, nebo jen přes vás | Ovlivňuje, jestli potřebujeme "moje rezervace" účet/odkaz |
| 8 | Kombinace 12 + 30 v jedné rezervaci | Aktuálně systém řeší jen "produkt A **nebo** B × počet kartonů" |
| 9 | **Kdo je právní prodávající** (viz sekce Legal Business Setup) | Bez tohoto nejde napsat pravdivé obchodní podmínky ani "O nás" v právním smyslu |
| 10 | IČO, sídlo, kontaktní e-mail, telefon | Bez toho nejdou doplnit obchodní podmínky, patička, ani ověření u SVS |
| 11 | Máte již ohlášený "prodej ze dvora" u krajské veterinární správy? | Viz sekce C — je to podmínka provozu, ne jen webu |
| 12 | Je aktuální chov skutečně BIO certifikovaný? | Viz sekce D — bez potvrzení se "BIO" nikde nepoužije |

### MŮŽEME ROZHODNOUT SAMI (a v tomto auditu navrhujeme)
- Technický stack, databázové schéma, admin nástroj, texty/copywriting
  varianty, vizuální směr (s vaším finálním výběrem), SEO strategie,
  cookie/analytics minimalismus, rate limiting, honeypot proti spamu.

### MUSÍME OVĚŘIT (u úřadu / právníka, ne odhadem)
- Přesné znění hygienických/značkovacích povinností pro váš konkrétní
  případ (viz sekce C) — u místně příslušné krajské veterinární správy.
- Právní kvalifikace "rezervace" vs. "objednávka" pro váš konkrétní flow
  (viz sekce F) — u advokáta.
- Právní nastavení podnikání nezletilých (viz sekce E) — u
  advokáta/notáře, případně přímo dotazem u soudu.

---

## C. Právní a regulační audit — prodej vajec

Zdroje: Státní veterinární správa (SVS), Ministerstvo zemědělství (MZe),
nařízení Komise (ES) č. 589/2008. Odkazy viz konec dokumentu.

**Malé množství "ze dvora"**: Chovatelé mohou prodávat nebalená čerstvá
vejce v malých množstvích přímo spotřebiteli ve svém hospodářství, na
tržišti, přes prodejní automat, nebo dodávat do místního maloobchodu.
Za "malé množství" se považuje **nejvýše 6 000 vajec za kalendářní
měsíc**. Právní základ: zákon č. 166/1999 Sb. (o veterinární péči, §27a)
a vyhláška č. 289/2007 Sb.

→ **Pro VAJCO**: pokud plánujete růst nad 6 000 vajec/měsíc (500 kartonů
po 12, nebo 200 po 30), tenhle limit je potřeba hlídat, nebo se
zaregistrovat jako standardní balírna/třídírna vajec. **TOTO JE NUTNÉ
OVĚŘIT U PŘÍSLUŠNÉ KRAJSKÉ VETERINÁRNÍ SPRÁVY** — konkrétně i to, jestli
"rezervace přes web s vyzvednutím osobně" pořád spadá pod režim "prodej
ze dvora", nebo už je z pohledu SVS něco jiného (typicky ano, pokud
zákazník fyzicky přijde na místo prodeje/výdeje, ale chceme mít
potvrzeno).

**Značení vajec** (nařízení (ES) 589/2008): na vejci musí být kód
producenta (metoda chovu 0–3, kód státu, poslední čtyřčíslí registračního
čísla hospodářství). Na obalu: číslo balírny/třídírny, hmotnostní
skupina (S/M/L/XL), datum minimální trvanlivosti (max. 28 dní po
snášce), podmínky skladování, způsob chovu, jakostní třída (třída A =
"čerstvá"). Metoda chovu na kódu: 0 = ekologický chov, 1 = volný výběh,
2 = halový chov, 3 = klecový chov.

→ **Pro VAJCO**: pokud je popis "volný chov / volný výběh" pravdivý,
kód by měl začínat **1**. Než web/etikety spustíme, potřebujeme vaše
**registrační číslo hospodářství** — bez něj nejde nikde tvrdit
konkrétní kód. **TOTO JE NUTNÉ OVĚŘIT/DOPLNIT VÁMI.**

**PROBLÉM**: zadání nikde neuvádí, jestli už máte registrované
hospodářství / ohlášený prodej u KVS. Web může sbírat rezervace, ale
**samotný prodej vajec je navázaný na splnění těchto povinností
nezávisle na webu** — to není něco, co web "vyřeší" sám.
**PRIORITA: Critical.**

---

## D. Pozor na „BIO"

Zadání v jedné části zmiňuje „bio čerstvá vejce", jinde popisuje chov
jako „volný chov / volný výběh, slepice na podestýlce". **To není totéž.**
BIO/ekologická produkce se řídí nařízením (EU) 2018/848 a vyžaduje
**certifikaci** od akreditované kontrolní organizace (v ČR např.
KEZ, Biokont) přes registraci u ÚKZÚZ/MZe — nejde o samovolné označení.

**Rozhodnutí v tomto auditu**: web **nikde nepoužívá slovo "BIO"**.
Místo toho: *"Vejce z volného chovu / volného výběhu"* + *"Slepice
chované na podestýlce."* — to jsou tvrzení, která odpovídají tomu, co
zadání skutečně popisuje, a nevyžadují certifikaci, kterou nemáme
potvrzenou.

V kódu (`src/config/site.ts`) je pro to hotový přepínač:
```ts
export const certification = {
  label: "Vejce z volného chovu / volného výběhu",
  isBio: false,
  bioCertificateNote: null,
};
```
Jakmile budete mít **platnou BIO certifikaci v ruce**, stačí přepsat
`isBio: true` a doplnit číslo certifikátu — nikde jinde se nic měnit
nemusí. Do té doby **žádné BIO tvrzení na web nepatří**. **PRIORITA:
Critical — nepravdivé tvrzení o certifikaci je přestupek podle zákona
o potravinách i klamavá obchodní praktika podle zákona o ochraně
spotřebitele.**

---

## E. Nezletilí zakladatelé — Legal Business Setup

Je vám 17 a 15 let. Český právní řád **umožňuje** nezletilému podnikat,
ale ne automaticky:

- Podle občanského zákoníku (zákon č. 89/2012 Sb.) může nezletilý, který
  nemá plnou svéprávnost, se **souhlasem zákonného zástupce** a
  **přivolením soudu** samostatně provozovat obchodní závod nebo
  obdobnou výdělečnou činnost. Od 1. 1. 2014 živnostenský zákon
  nevyžaduje 18 let, ale plnou svéprávnost — kterou přivolení soudu
  nahrazuje.
- Bez tohoto přivolení nemůže nezletilý (obzvlášť 15letý) platně
  samostatně podnikat/uzavírat obchodní smlouvy.

**PROBLÉM**: Zadání neříká, kdo je (nebo bude) formální provozovatel —
jestli živnost založí straší ze zakladatelů (17 let, potřebuje souhlas
zástupce + soudu), jestli živnost/firmu založí **rodič nebo jiný dospělý**
jménem projektu (mladí by byli "tváří" značky, ne právně
podnikajícími), nebo jiná varianta (např. založení s.r.o. přes
zákonného zástupce jako jednatele).

**PROČ JE TO PROBLÉM**: Bez jasného právního provozovatele nejde napsat
pravdivé obchodní podmínky, fakturovat, ani legálně přijímat platby (i
když jen na místě v hotovosti/kartou). Je to nejvyšší právní riziko
celého projektu — vyšší než cokoliv na webu.

**DOPORUČENÍ**: Web je technicky připravený na to, aby "provozovatel"
byl kdykoliv doplněná hodnota (viz `siteConfig` a budoucí stránka
Obchodní podmínky) — ale **kdo skutečně prodává, musíte s advokátem
(případně notářem) vyřešit mimo web**, ideálně předtím, než přijmete
první skutečnou platbu. **PRIORITA: Critical. POTŘEBUJEME OD VÁS**:
potvrzení, kdo bude formální prodávající, jakmile to s právníkem/rodiči
vyřešíte.

---

## F. E-commerce / klasifikace „rezervace"

Podle občanského zákoníku (§1811, §1820) má prodávající při
uzavírání smlouvy na dálku (typicky e-shop) přísné informační
povinnosti. Nedávná tzv. "tlačítková novela" (§1826a) navíc vyžaduje,
aby tlačítko, které zákazníka **zavazuje k platbě**, bylo výslovně
označené (např. "Objednávka zavazující k platbě") — jinak zákazník
objednávkou není vázán.

**Pro VAJCO to znamená konkrétní doporučení**:
- Tlačítko a celý flow **nesmí tvářit jako placená objednávka** — proto
  je aktuální návrh pojmenovaný **"Rezervovat vejce"**, ne "Objednat" /
  "Koupit", a u tlačítka i ve shrnutí je vždy viditelná věta *"Platba
  proběhne až při převzetí."*
- I tak doporučujeme formulaci chápat jako **nezávaznou rezervaci /
  příslib**, ne jako uzavřenou kupní smlouvu — ke skutečné kupní
  smlouvě dochází až osobně na místě při předání a zaplacení. To je
  potřeba mít **stejně formulované v Obchodních podmínkách**, jakmile
  vzniknou.
- I přesto doporučujeme do formuláře doplnit **jasné shrnutí před
  odesláním** (produkt, množství, cena, termín, že se online neplatí) —
  to web už dělá v potvrzovací obrazovce, ale je dobré to mít i **před**
  odesláním, ne jen po něm. *(Návrh do Fáze 1: přidat "zkontroluj svoji
  rezervaci" krok před finálním odesláním.)*

**TOTO JE NUTNÉ OVĚŘIT U ADVOKÁTA** — konkrétně, jestli tahle
formulace v praxi obstojí, obzvlášť ve spojení s otázkou nezletilých
prodávajících (sekce E). **PRIORITA: High.**

---

## G. Rezervace musí být fail-safe — scénáře a návrh řešení

| Scénář | Návrh řešení (co web dělá / má dělat) |
|---|---|
| Kapacita slotu už není | Server-side kontrola (`checkSlotCapacity`) při odeslání, ne jen na klientu — plný slot je v selectu rovnou zobrazený jako "obsazeno" |
| Dva lidé odešlou poslední místo současně | **Race condition** — řešeno databázovou transakcí při zápisu (viz sekce Race Conditions níže); aktuální implementace to zatím dělá "read-then-write" bez transakčního zámku — **potřeba dopracovat, viz Riziko #1** |
| Zákazník odešle rezervaci 2× (dvojklik) | Tlačítko se po odeslání disabluje (`isPending`), formulář po úspěchu zmizí a nahradí se potvrzením — zabraňuje opakovanému odeslání stejného requestu z UI. Bez idempotenčního klíče ale technicky **nejde** vyloučit dva rychlé samostatné requesty (viz Riziko #2) |
| Zákazník nepřijede | Bez definovaného pravidla (viz otázka #6) — návrh: administrace umožní ručně označit "Zrušeno"/"Nevyzvednuto", žádná automatika zatím |
| Zákazník chce změnit čas/počet | Zatím žádné samoobslužné "moje rezervace" — změnu/zrušení řeší admin ručně (telefon/e-mail); je to vědomé zjednodušení pro verzi 1 |
| Vejce dojdou mimo systém (mimořádně) | Admin může slot i zpětně "uzavřít" snížením kapacity v configu pro budoucí sloty; **pro už vzniklé rezervace na daný slot je potřeba zákazníky kontaktovat ručně** — automatická hromadná notifikace zatím není součástí V1 |
| Výdejní den se celý zruší | Config (`reservationConfig.pickupDays`) lze změnit ihned; existující rezervace na zrušený den ale zůstanou v DB se starým datem — je potřeba je řešit ručně přes admin |
| Systém/DB nefunguhe | Formulář zobrazí lidskou chybovou hlášku (ne "500 Internal Server Error"), rezervace se neuloží — zákazník to může zkusit znovu |

**Riziko #1 — race condition při kapacitě** *(Critical)*: Aktuální
návrh počítá obsazenost slotu dotazem do databáze (`findMany` → součet)
a teprve pak zapisuje novou rezervaci — mezi těmito dvěma kroky teoreticky
může vzniknout souběh (dva požadavky projdou kontrolou současně).
**Doporučení pro Fázi 7**: přesunout kontrolu kapacity do jedné databázové
transakce (`prisma.$transaction`) se serializovanou úrovní izolace, nebo
použít DB unikátní omezení/atomický čítač na úrovni slotu. U očekávaného
provozu VAJCO (desítky, ne tisíce rezervací najednou) je riziko v praxi
nízké, ale mělo by být opravené před ostrým spuštěním, ne až po
incidentu.

**Riziko #2 — duplicitní odeslání** *(Medium)*: doporučujeme doplnit
klientský idempotenční token (náhodné ID vygenerované při načtení
formuláře, poslané spolu s daty, DB unique index na `(idempotencyKey)`),
aby ani dva nezávislé requesty z jednoho prohlížeče nevytvořily dvě
rezervace.

---

## H. Administrace — pracovní nástroj, ne jen seznam

Návrh nad rámec původního seznamu (rozšířeno o vaše požadavky z
tohoto promptu):
- Přehled **Dnes** a **Zítra** (počet rezervací, kartonů, vajec).
- Filtr podle data, podle stavu, (doplnit: podle času slotu).
- Změna stavu (Nová → Potvrzená → Vyzvednuto, nebo Zrušená).
- **Export do CSV** — *není zatím implementováno, přidáme do Fáze 8*.
- Ruční editace/zrušení rezervace — *aktuálně jde jen měnit stav, ne
  přepisovat detaily (jméno, čas...); doplníme, pokud potvrdíte, že to
  potřebujete, nebo to bude zatím řešeno telefonicky mimo systém.*

---

## I. Notifikace (e-mail)

**Zatím NENÍ implementováno** — vyžaduje transakční e-mailovou službu
(Resend, Postmark, SES...) a ověřenou doménu (viz sekce Domain/Deployment
níže — SPF/DKIM/DMARC). Bez e-mailové domény nejde spolehlivě posílat
potvrzení, aniž skončí ve spamu.

**Návrh pro Fázi 9+**: potvrzovací e-mail „VAJCO na tebe čeká" se
souhrnem rezervace, odděleně od jakéhokoliv budoucího marketingového
newsletteru (transakční e-mail nesmí vyžadovat marketingový souhlas —
posílá se z titulu plnění rezervace, ne marketingu). **POTŘEBUJEME OD
VÁS**: e-mailovou doménu / adresu, ze které se bude posílat, až bude k
dispozici.

---

## J. Cookies a analytika

**Návrh**: minimalisticky.
- Žádné cookies nejsou technicky nutné pro fungování webu ani
  rezervace (formulář posílá server action, admin session cookie je
  nutná/technická → nepotřebuje souhlas).
- Pokud budete chtít měřit návštěvnost/konverze (doporučujeme —
  viz sekce Analytika), navrhujeme jeden lehký, **cookie-less** nástroj
  (např. Plausible/Umami) — u těch typicky **není potřeba cookie lišta**,
  protože nepoužívají trvalé identifikátory/cookies.
- Google Analytics / Meta Pixel **nenasazujeme automaticky** — obojí
  vyžaduje cookie lištu s aktivním souhlasem před načtením. Pokud je
  budete chtít, řekněte a doplníme včetně cookie lišty.

---

## K. Analytika a KPI

Hlavní KPI: **Reservation Conversion Rate** = počet odeslaných rezervací
/ počet návštěvníků. Doplňkově sledovat: kliknutí na "Rezervovat" v
Hero/Products/PickupSection/FinalCta (abychom věděli, které CTA
funguje), rozestup mezi "začal vyplňovat formulář" a "odeslal", nejčastěji
volený produkt a čas. **Návrh implementace až po potvrzení nástroje**
(viz sekce J) — bez zbytečného sbírání osobních dat pro účely analytiky.

---

## L. SEO strategie (shrnutí — detail níže v odpovědi)

Přirozené, ne "keyword stuffing". Cílové fráze: *čerstvá vejce Brno, vejce
Brno, vejce z farmy Brno, vejce Pálava, vejce Klentnice, vejce volný chov,
prodej vajec Brno.* Návrh: title/meta/H1 už cílí na "Čerstvá vejce z
Pálavy" + Brno v textu Pickup sekce; doplnit strukturovaná data (viz
kód — `OrganizationJsonLd`, do budoucna možná `LocalBusiness`, jakmile
bude adresa).

---

## M. Bezpečnost (shrnutí — detail v `PRIVACY_REQUIREMENTS.md` a v odpovědi)

- Cena a kapacita se **vždy počítají na serveru** (viz `getProductPrice`,
  `checkSlotCapacity` volané ze server action `createReservation`) —
  klient nemůže cenu ovlivnit úpravou requestu.
- Admin chráněný heslem + podepsanou httpOnly cookie, ne veřejně
  přístupný, žádné tajné klíče v klientském kódu.
- Rate limiting a honeypot proti spamu v rezervačním formuláři.
- Zbývá doplnit: striktnější rate limiting per-slot (viz Riziko #1),
  CSRF ochrana je řešená tím, že Next.js server actions ji mají
  zabudovanou (Origin header check).

---

## Zdroje (WebSearch, ne oficiální právní stanovisko)

- [Prodej ze dvora – Bezpečnost potravin](https://bezpecnostpotravin.cz/kategorie/prodej-ze-dvora/)
- [Publikace SVS: pravidla prodeje ze dvora](https://www.svscr.cz/publikace-svs-shrnuje-pravidla-zpracovani-vlastni-produkce-a-prodeje-ze-dvora/)
- [Prodej ze dvora | MZe](https://mze.gov.cz/public/portal/mze/potraviny/zivotni-situace/prodej-maleho-mnozstvi-potravin-zivocisneho-puvodu-prodej-ze-dvora)
- [SVS ČR: označování a uchovávání vajec](https://bezpecnostpotravin.cz/svs-cr-oznacovani-a-uchovavani-vajec/)
- [Nařízení (ES) č. 589/2008](https://esipa.cz/sbirka/sbsrv.dll/sb?CP=32008R0589&DR=SB)
- [Se souhlasem soudu může nezletilý podnikat](https://www.pravnilinka.cz/obcansky-zakonik/se-souhlasem-soudu-muze-nezletily-podnikat-nebo-ziskat-svepravnost)
- [Možnost výdělečné činnosti nezletilých podle občanského zákoníku](https://www.pravniprostor.cz/clanky/obcanske-pravo/moznost-vydelecne-cinnosti-nezletilych-podle-obcanskeho-zakoniku)
- [Nařízení (EU) 2018/848 o ekologické produkci](https://eur-lex.europa.eu/legal-content/CS/LSU/?uri=CELEX%3A32018R0848)
- [ČOI: Povinnosti prodávajícího při prodeji zboží](https://coi.gov.cz/faq/a-povinnosti-prodavajiciho-pri-prodeji-zbozi-2/)
- [ČOI: tlačítko „Objednávka zavazující k platbě"](https://coi.gov.cz/tlacitko/)
- [ÚOOÚ: Základní příručka k ochraně údajů](https://uoou.gov.cz/verejnost/zakladni-prirucka-k-ochrane-udaju)

> **Upozornění**: Tento dokument je analýza na základě veřejně
> dostupných zdrojů, **není to právní stanovisko**. Body označené
> „TOTO JE NUTNÉ OVĚŘIT" musí potvrdit příslušný úřad nebo advokát
> předtím, než začnete reálně prodávat.
