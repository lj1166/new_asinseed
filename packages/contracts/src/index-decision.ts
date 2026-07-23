import { z } from "zod";

export const IndexDecisionSchema = z.object({
  index: z.boolean(),
  reason: z.enum(["static-content", "query-result", "pending-quality-review"]),
  inSitemap: z.boolean(),
});
export type IndexDecision = z.infer<typeof IndexDecisionSchema>;
