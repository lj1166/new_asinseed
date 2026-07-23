import { z } from "zod";

export const ContentEntrySchema = z.object({
  title: z.string(),
  slug: z.string(),
  tags: z.array(z.string()),
  summary: z.string(),
  body: z.string(),
  publishedAt: z.string(),
  viewCount: z.number().optional(),
  author: z
    .object({
      name: z.string(),
      bio: z.string().optional(),
    })
    .optional(),
  sourceCitations: z
    .array(
      z.object({
        label: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
  methodology: z.string().optional(),
  generatedBy: z.enum(["agent", "manual"]),
  workflowState: z.enum(["draft", "in_review", "approved"]),
});
export type ContentEntry = z.infer<typeof ContentEntrySchema>;

export const KeywordEntrySchema = z.object({
  keyword: z.string(),
  searchIntent: z.enum(["informational", "commercial", "navigational", "transactional"]),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["unassigned", "assigned", "published"]),
  relatedArticles: z.array(z.object({ _ref: z.string() })).optional(),
});
export type KeywordEntry = z.infer<typeof KeywordEntrySchema>;

export const MaterialAssetSchema = z.object({
  type: z.enum(["data", "image", "citation", "competitor-analysis"]),
  title: z.string(),
  sourceUrl: z.string().optional(),
  relatedKeywords: z.array(z.object({ _ref: z.string() })).optional(),
  status: z.enum(["unused", "used"]),
});
export type MaterialAsset = z.infer<typeof MaterialAssetSchema>;
