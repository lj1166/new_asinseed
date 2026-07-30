import { z } from "zod";
import { SANITY_CONTENT_LOCALES } from "./locales";

export const HOMEPAGE_LOCALES = SANITY_CONTENT_LOCALES;

export const HomepageFaqEntrySchema = z.object({
  locale: z.enum(HOMEPAGE_LOCALES),
  question: z.string(),
  answer: z.string(),
  order: z.number().optional(),
});
export type HomepageFaqEntry = z.infer<typeof HomepageFaqEntrySchema>;

export const HomepageTestimonialEntrySchema = z.object({
  locale: z.enum(HOMEPAGE_LOCALES),
  quoteText: z.string(),
  authorName: z.string(),
  authorTitle: z.string().optional(),
  avatarUrl: z.string().optional(),
  order: z.number().optional(),
});
export type HomepageTestimonialEntry = z.infer<typeof HomepageTestimonialEntrySchema>;

const HomepageContentCardSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

/**
 * Operator-maintained copy for the semantic sections of the rebuilt homepage.
 * The visible H1/subheading deliberately remain in `homepageSeo`; this keeps
 * page metadata and visible Hero ownership explicit rather than creating two
 * competing title fields in Studio.
 */
export const HomepageContentSchema = z.object({
  locale: z.enum(HOMEPAGE_LOCALES),
  eyebrow: z.string().min(1),
  toolSubmitLabel: z.string().min(1),
  toolHint: z.string().min(1),
  methodTitle: z.string().min(1),
  methodDescription: z.string().min(1),
  methodPoints: z.array(HomepageContentCardSchema).min(3).max(3),
});
export type HomepageContent = z.infer<typeof HomepageContentSchema>;
