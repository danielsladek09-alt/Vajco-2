import { describe, expect, it } from "vitest";
import { reservationSchema } from "./validation";

const validInput = {
  name: "Jana Nováková",
  phone: "777 123 456",
  email: "jana@example.com",
  product: "CARTON_12" as const,
  cartonCount: 2,
  pickupDate: "2026-08-15",
  pickupTime: "15:00",
  note: "",
  consent: true as const,
  clientToken: "a".repeat(20),
};

describe("reservationSchema", () => {
  it("přijme platnou rezervaci", () => {
    const result = reservationSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("odmítne prázdné jméno", () => {
    const result = reservationSchema.safeParse({ ...validInput, name: "" });
    expect(result.success).toBe(false);
  });

  it("odmítne neplatný telefon", () => {
    const result = reservationSchema.safeParse({ ...validInput, phone: "abc" });
    expect(result.success).toBe(false);
  });

  it("odmítne neplatný e-mail", () => {
    const result = reservationSchema.safeParse({ ...validInput, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("odmítne nulový počet kartonů", () => {
    const result = reservationSchema.safeParse({ ...validInput, cartonCount: 0 });
    expect(result.success).toBe(false);
  });

  it("odmítne počet kartonů nad limit", () => {
    const result = reservationSchema.safeParse({ ...validInput, cartonCount: 999 });
    expect(result.success).toBe(false);
  });

  it("odmítne rezervaci bez souhlasu se zpracováním údajů", () => {
    const result = reservationSchema.safeParse({ ...validInput, consent: false });
    expect(result.success).toBe(false);
  });

  it("odmítne rezervaci bez klientského tokenu (idempotence)", () => {
    const result = reservationSchema.safeParse({ ...validInput, clientToken: "" });
    expect(result.success).toBe(false);
  });

  it("odmítne neplatný formát data", () => {
    const result = reservationSchema.safeParse({ ...validInput, pickupDate: "15.8.2026" });
    expect(result.success).toBe(false);
  });
});
