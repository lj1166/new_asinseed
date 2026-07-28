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
