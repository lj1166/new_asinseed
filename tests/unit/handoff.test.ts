import { describe, expect, it } from "vitest";
import { HandoffRegistryEntrySchema } from "@new-asinseed/contracts";

describe("HandoffRegistryEntrySchema", () => {
  it("parses an entry targeting the allowed host", () => {
    const entry = HandoffRegistryEntrySchema.parse({
      intent: "reverse-asin-deep-dive",
      targetHost: "sellersprite.ai",
      targetPath: "/reverse-asin",
      ctaCopy: "Get the full report",
    });
    expect(entry.targetHost).toBe("sellersprite.ai");
  });

  it("rejects an entry targeting a disallowed host", () => {
    expect(() =>
      HandoffRegistryEntrySchema.parse({
        intent: "reverse-asin-deep-dive",
        targetHost: "not-allowed.com",
        targetPath: "/reverse-asin",
        ctaCopy: "Get the full report",
      }),
    ).toThrow();
  });
});
