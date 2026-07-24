import { z } from "zod";

/**
 * Legacy behavior (verified against cn/en index.jsp inline `<script>`,
 * `keywords.indexOf('BO') === 0`):
 * GET /suggestions?station={station}&keyword={keywords}
 * Client-side guards skip the request entirely when the keyword is empty,
 * >= 30 chars, or starts with the literal (case-sensitive) substring "BO".
 * Note this is "BO" (letter O), not "B0" (digit zero) — real ASINs start
 * with "B0", so this check rarely fires in practice. Preserved verbatim as
 * a legacy quirk rather than "corrected" to what was likely intended.
 */
export const SuggestionQuerySchema = z.object({
  station: z.string().min(1),
  keyword: z.string().min(1).max(29),
});
export type SuggestionQuery = z.infer<typeof SuggestionQuerySchema>;

export const SuggestionItemSchema = z.object({
  keyword: z.string(),
  searches: z.number(),
});
export type SuggestionItem = z.infer<typeof SuggestionItemSchema>;

/**
 * Legacy response is either a redirect signal ({code:302,url}) or a plain
 * JSON array of suggestion items — this union mirrors both branches instead
 * of forcing a single shape onto a contract that historically had two.
 */
export const SuggestionRedirectSchema = z.object({
  code: z.literal(302),
  url: z.string(),
});
export type SuggestionRedirect = z.infer<typeof SuggestionRedirectSchema>;

export const SuggestionResponseSchema = z.union([
  SuggestionRedirectSchema,
  z.array(SuggestionItemSchema),
]);
export type SuggestionResponse = z.infer<typeof SuggestionResponseSchema>;

export interface SuggestionProvider {
  query(input: SuggestionQuery): Promise<SuggestionResponse>;
}
