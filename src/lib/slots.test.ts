import { describe, expect, it } from "vitest";
import { getSlotsForDate } from "./slot-math";

// 2026-08-15 je sobota, 2026-08-16 je neděle — podle demo configu
// (`reservationConfig.pickupDays`) se vydává st/pá/so, takže sobota má
// sloty a neděle žádné.
describe("getSlotsForDate", () => {
  it("vrátí sloty pro výdejní den (sobota)", () => {
    const slots = getSlotsForDate("2026-08-15");
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0]).toBe("15:00");
    expect(slots[slots.length - 1]).toBe("17:30");
  });

  it("nevrátí žádné sloty pro nevýdejní den (neděle)", () => {
    const slots = getSlotsForDate("2026-08-16");
    expect(slots).toEqual([]);
  });

  it("respektuje délku slotu z configu (30 minut → 6 slotů mezi 15:00 a 18:00)", () => {
    const slots = getSlotsForDate("2026-08-15");
    expect(slots).toEqual(["15:00", "15:30", "16:00", "16:30", "17:00", "17:30"]);
  });
});
