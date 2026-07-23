import { z } from "zod";

export const ReverseAsinQuerySchema = z.object({
  market: z.string(),
  keywordOrAsin: z.string(),
});
export type ReverseAsinQuery = z.infer<typeof ReverseAsinQuerySchema>;

export const ReverseAsinResultSchema = z.object({
  asin: z.string(),
  title: z.string(),
  price: z.number(),
  rating: z.number(),
  category: z.array(z.string()),
});
export type ReverseAsinResult = z.infer<typeof ReverseAsinResultSchema>;

export const ProblemDetailsSchema = z.object({
  type: z.string(),
  title: z.string(),
  detail: z.string(),
});
export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;

export interface ReverseAsinProvider {
  query(input: ReverseAsinQuery): Promise<ReverseAsinResult>;
}
