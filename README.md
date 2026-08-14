# VAJCO.cz

Web značky VAJCO — čerstvá vejce z vlastního chovu u Klentnice na
Pálavě, s online rezervací a vyzvednutím v Brně-Komíně.

> **Než cokoliv nasadíte naostro**, přečtěte si `PROJECT_AUDIT.md` a
> `LAUNCH_CHECKLIST.md` — obsahují seznam právních a obsahových věcí
> (adresa výdejny, GPS farmy, kdo je právní prodávající, BIO ano/ne...),
> které ještě čekají na potvrzení a přímo ovlivňují, co smí web tvrdit.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript + React 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [Prisma](https://www.prisma.io) ORM — SQLite lokálně, Postgres (Supabase) v produkci
- [framer-motion](https://www.framer.com/motion/) pro animace, [lucide-react](https://lucide.dev) pro ikony
- [Leaflet](https://leafletjs.com) / OpenStreetMap pro mapu farmy (bez API klíče)
- [Zod](https://zod.dev) pro server-side validaci

## Instalace a lokální spuštění

```bash
npm install
cp .env.example .env
```

Uprav `.env` — pro lokální vývoj stačí nastavit `ADMIN_PASSWORD` a
`ADMIN_SESSION_SECRET` (viz níže), `DATABASE_URL` už je přednastavené
na lokální SQLite soubor.

```bash
npx prisma migrate dev   # vytvoří lokální databázi prisma/dev.db
npm run dev               # http://localhost:3000
```

Administrace běží na `/admin` (heslo z `ADMIN_PASSWORD`).

## Environment proměnné

Kompletní přehled a komentáře viz [`\.env.example`](./.env.example).
Shrnutí:

| Proměnná | Účel | Povinná lokálně? |
|---|---|---|
| `DATABASE_URL` | připojení k databázi | ne (výchozí SQLite funguje rovnou) |
| `ADMIN_PASSWORD` | heslo do administrace | ano |
| `ADMIN_SESSION_SECRET` | podpis admin session cookie (`openssl rand -base64 32`) | ano |
| `NEXT_PUBLIC_SITE_URL` | kanonická URL webu (SEO, sitemap) | ne (default `https://www.vajco.cz`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `_PHONE` / `_INSTAGRAM_URL` / `_FACEBOOK_URL` | kontakty v patičce | ne — dokud nejsou, patička je zobrazí jako "brzy doplníme" |
| `NEXT_PUBLIC_FARM_LAT` / `_LNG` / `_EXACT` | poloha farmy na mapě | ne — bez nich se použije přibližný střed Klentnice |

**Nikdy necommitovat `.env` do gitu** — je v `.gitignore`, sdílí se jen `.env.example` s prázdnými/ukázkovými hodnotami.

## Databáze

Lokálně appka běží na SQLite (`prisma/dev.db`) bez jakéhokoliv
externího nastavení. Pro produkci (doporučeno: Supabase Postgres):

1. V `prisma/schema.prisma` přepiš `provider = "sqlite"` na `provider = "postgresql"`.
2. Nastav `DATABASE_URL` v produkčním prostředí na connection string ze Supabase (Project Settings → Database).
3. Spusť `npx prisma migrate deploy`.

Schéma (`prisma/schema.prisma`) se tím nemění — jde jen o přepnutí providera a URL.

### Konfigurace cen, kapacit a výdejních časů

Vše, co se bude pravděpodobně měnit, je na jednom místě — **nikdy se
neupravuje přímo v komponentách**:

- `src/config/site.ts` — cena za vejce, produkty, výdejní místo, farma/GPS, kontakty.
- `src/config/reservations.ts` — výdejní dny, časové okno, délka slotu, maximální kapacita na slot.

## Rezervační systém

Kapacita slotu se kontroluje **a zapisuje atomicky v jedné databázové
transakci** (`src/actions/reservation.ts`) — chrání proti souběžným
rezervacím na poslední místo. Formulář navíc posílá klientský
idempotenční token, takže dvojklik na "Rezervovat" nevytvoří dvě
rezervace. Detail v `PROJECT_AUDIT.md`, sekce G.

## Administrace

`/admin` — chráněno heslem (`ADMIN_PASSWORD`), session cookie platí 8
hodin. Přehled dnešních/celkových rezervací, filtr podle data, změna
stavu, export do CSV.

## Nasazení (Vercel doporučeno)

1. Repozitář připoj k Vercelu (Import Project).
2. Nastav environment proměnné z `.env.example` v nastavení projektu.
3. Nastav produkční databázi (viz výše — Supabase Postgres).
4. Deploy.

### Připojení domény `www.vajco.cz`

1. Ve Vercelu: Project → Settings → Domains → přidat `www.vajco.cz`.
2. U registrátora domény nastav DNS podle instrukcí, které Vercel zobrazí (typicky CNAME na `cname.vercel-dns.com`).
3. Přidej i `vajco.cz` (bez www) a nastav ve Vercelu jako redirect na `www.vajco.cz`.
4. HTTPS certifikát Vercel vystaví automaticky po ověření DNS.

## Testování a QA

Viz `QA_CHECKLIST.md` pro test plán před spuštěním. Základní příkazy:

```bash
npm run build   # produkční build + typecheck
npm run lint    # ESLint
npm test        # unit testy (ceny, validace, generování slotů)
```

## Struktura projektu

```
src/
  app/            Next.js App Router — stránky, layouty, API routy
  components/     UI komponenty
  actions/        server actions (rezervace, admin)
  lib/            byznys logika (sloty, validace, auth, rate limit)
  config/         centrální konfigurace (ceny, kapacity, kontakty)
prisma/           databázové schéma a migrace
```

## Dokumentace k projektu

- `PROJECT_AUDIT.md` — právní/technické/UX riziko a otevřené otázky
- `PRIVACY_REQUIREMENTS.md` — zpracování osobních údajů (GDPR)
- `BRAND_STRATEGY.md` — pozicionování, tone of voice, copywriting, vizuální směr
- `QA_CHECKLIST.md` — test plán
- `LAUNCH_CHECKLIST.md` — co musí být hotové před ostrým spuštěním
