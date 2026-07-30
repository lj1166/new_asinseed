import { z } from "zod";

export const SearchMarketSchema = z.enum(["US", "JP", "UK", "DE", "FR", "IT", "ES", "CA", "IN"]);
export const SEARCH_MARKETS = SearchMarketSchema.options;
export type SearchMarket = z.infer<typeof SearchMarketSchema>;

export const ReverseAsinModeSchema = z.enum(["asin", "keyword"]);
export type ReverseAsinMode = z.infer<typeof ReverseAsinModeSchema>;

export const ReverseAsinQuerySchema = z.object({
  market: SearchMarketSchema,
  keywordOrAsin: z.string().trim().min(1).max(120),
  supplement: z.boolean().default(false),
  exactMatch: z.boolean().default(false),
});
export type ReverseAsinQuery = z.infer<typeof ReverseAsinQuerySchema>;

export function getReverseAsinMode(value: string): ReverseAsinMode {
  return /^B[A-Z0-9]{9}$/i.test(value.trim()) ? "asin" : "keyword";
}

export const ReverseAsinResultItemSchema = z.object({
  keyword: z.string(),
  monthlySearches: z.number().nonnegative(),
  trafficWeight: z.number().int().min(0).max(100).optional(),
  productCount: z.number().nonnegative().optional(),
  monthlyPurchases: z.number().nonnegative().optional(),
  purchaseRate: z.number().min(0).max(1).optional(),
});
export type ReverseAsinResultItem = z.infer<typeof ReverseAsinResultItemSchema>;

export const ReverseAsinResultSchema = z.object({
  market: SearchMarketSchema,
  query: z.string(),
  mode: ReverseAsinModeSchema,
  source: z.literal("mock"),
  items: z.array(ReverseAsinResultItemSchema).min(1),
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
