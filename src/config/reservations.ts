/**
 * VAJCO — konfigurace výdejních časů a kapacit.
 *
 * TOTO JE MÍSTO, KDE SE NASTAVUJE VÝDEJNÍ KALENDÁŘ.
 * Nic z tohoto se nesmí objevit natvrdo v komponentách nebo v API —
 * veškerá dostupnost slotů (viz `src/lib/slots.ts`) se počítá z těchto
 * hodnot.
 *
 * Aktuální hodnoty jsou rozumný DEMO režim (výdej st/pá/so odpoledne).
 * Až bude definitivní výdejní kalendář, stačí přepsat hodnoty níže —
 * zbytek aplikace se přizpůsobí automaticky.
 */

export const reservationConfig = {
  timezone: "Europe/Prague",

  /** Dny v týdnu, kdy se vydává (0 = neděle … 6 = sobota). DEMO: středa, pátek, sobota. */
  pickupDays: [3, 5, 6] as number[],

  /** Začátek a konec výdejní doby v daný den (24h formát "HH:mm"). */
  windowStart: "15:00",
  windowEnd: "18:00",

  /** Délka jednoho časového slotu v minutách. */
  slotLengthMinutes: 30,

  /** Maximální počet rezervací (objednávek), které se vejdou do jednoho slotu. */
  maxReservationsPerSlot: 6,

  /** Maximální počet kartonů, které se vejdou do jednoho slotu (napříč všemi rezervacemi). */
  maxCartonsPerSlot: 20,

  /** Kolik dní dopředu lze maximálně rezervovat. */
  bookableDaysAhead: 21,

  /** Minimální předstih rezervace v hodinách (aby nebylo možné rezervovat "za 5 minut"). */
  minLeadHours: 12,

  /** Maximální počet kartonů na jednu rezervaci. */
  maxCartonsPerReservation: 10,
} as const;

export type ReservationConfig = typeof reservationConfig;
