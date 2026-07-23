import { z } from "zod";

export const ALLOWED_HANDOFF_HOSTS = ["sellersprite.ai"] as const;

export const HandoffRegistryEntrySchema = z.object({
  intent: z.string(),
  targetHost: z.enum(ALLOWED_HANDOFF_HOSTS),
  targetPath: z.string(),
  ctaCopy: z.string(),
});
export type HandoffRegistryEntry = z.infer<typeof HandoffRegistryEntrySchema>;
