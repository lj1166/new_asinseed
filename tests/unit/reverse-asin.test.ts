import { describe, expect, it } from "vitest";
import { ReverseAsinResultSchema } from "@new-asinseed/contracts";

describe("ReverseAsinResultSchema", () => {
  it("parses a valid fixture", () => {
    const result = ReverseAsinResultSchema.parse({
      asin: "B000000000",
      title: "Mock Earbuds",
      price: 19.99,
      rating: 4.5,
      category: ["Electronics", "Headphones"],
    });
    expect(result.asin).toBe("B000000000");
  });

  it("rejects an invalid fixture", () => {
    expect(() =>
      ReverseAsinResultSchema.parse({
        asin: "B000000000",
        title: "Mock Earbuds",
        price: "not-a-number",
        rating: 4.5,
        category: ["Electronics"],
      }),
    ).toThrow();
  });
});
