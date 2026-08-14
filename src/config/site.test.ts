import { describe, expect, it } from "vitest";
import { getProductPrice, formatPrice, products } from "./site";

describe("getProductPrice", () => {
  it("počítá cenu kartonu 12 vajec na serveru z configu, ne z natvrdo zadaného čísla", () => {
    expect(getProductPrice("carton-12")).toBeCloseTo(12 * products.pricePerEgg, 2);
  });

  it("počítá cenu kartonu 30 vajec", () => {
    expect(getProductPrice("carton-30")).toBeCloseTo(30 * products.pricePerEgg, 2);
  });

  it("odpovídá cenám ze zadání (106,80 Kč a 267 Kč při 8,90 Kč/vejce)", () => {
    expect(products.pricePerEgg).toBe(8.9);
    expect(getProductPrice("carton-12")).toBeCloseTo(106.8, 2);
    expect(getProductPrice("carton-30")).toBeCloseTo(267, 2);
  });
});

describe("formatPrice", () => {
  it("formátuje celé částky bez desetinných míst", () => {
    expect(formatPrice(267)).toBe("267 Kč");
  });

  it("formátuje částky s halíři na dvě desetinná místa", () => {
    expect(formatPrice(106.8)).toBe("106,80 Kč");
  });
});
