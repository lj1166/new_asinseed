import { HandoffRegistryEntrySchema, type HandoffRegistryEntry } from "@new-asinseed/contracts";

// Stage 0 placeholder — one illustrative entry only. Real entries land as
// Stage 1+ pages are migrated and their handoff CTAs are actually defined.
export const HANDOFF_REGISTRY: HandoffRegistryEntry[] = [
  HandoffRegistryEntrySchema.parse({
    intent: "reverse-asin-deep-dive",
    targetHost: "sellersprite.ai",
    targetPath: "/reverse-asin",
    ctaCopy: "Get the full Reverse ASIN report on SellerSprite",
  }),
];
