import { z } from "zod";
import { reservationConfig } from "@/config/reservations";

/**
 * Validace rezervačního formuláře — používá se jak na klientu (hned po
 * ztrátě fokusu / před odesláním), tak znovu na serveru (server action),
 * protože klientské validaci se nikdy nedá věřit samo o sobě.
 *
 * Chybové hlášky jsou psané lidsky, ne technicky.
 */

const phoneRegex = /^(\+?\d{1,3}[\s-]?)?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;

export const reservationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Zkontroluj prosím jméno.")
    .max(100, "Jméno je moc dlouhé."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Zkontroluj prosím telefonní číslo."),
  email: z.string().trim().min(1, "Zadej prosím e-mail.").email("Zkontroluj prosím e-mail."),
  product: z.enum(["CARTON_12", "CARTON_30"], {
    message: "Vyber prosím, kolik vajec chceš.",
  }),
  cartonCount: z
    .number({ message: "Zadej prosím počet kartonů." })
    .int("Počet kartonů musí být celé číslo.")
    .min(1, "Vyber alespoň jeden karton.")
    .max(
      reservationConfig.maxCartonsPerReservation,
      `Na jednu rezervaci lze objednat maximálně ${reservationConfig.maxCartonsPerReservation} kartonů.`,
    ),
  pickupDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Vyber prosím datum vyzvednutí."),
  pickupTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Vyber prosím čas vyzvednutí."),
  note: z.string().trim().max(500, "Poznámka je moc dlouhá.").optional().or(z.literal("")),
  consent: z.literal(true, {
    message: "Pro odeslání rezervace potřebujeme tvůj souhlas se zpracováním údajů.",
  }),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export const reservationFormDefaults = {
  name: "",
  phone: "",
  email: "",
  product: "CARTON_12" as const,
  cartonCount: 1,
  pickupDate: "",
  pickupTime: "",
  note: "",
  consent: false as boolean,
};
