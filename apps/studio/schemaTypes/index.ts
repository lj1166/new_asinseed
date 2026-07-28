import { seoObject } from "./seoObject";
import { siteSettings } from "./siteSettings";
import { homepageSeo } from "./homepageSeo";
import { contentEntry } from "./contentEntry";
import { keywordEntry } from "./keywordEntry";
import { materialAsset } from "./materialAsset";
import { homepageFaqEntry } from "./homepageFaqEntry";
import { homepageTestimonialEntry } from "./homepageTestimonialEntry";
import { homepageContent } from "./homepageContent";

export const schemaTypes = [
  // Shared object types (registered first so documents can reference by name)
  seoObject,
  // Singleton / global config
  siteSettings,
  // Per-page SEO documents
  homepageSeo,
  homepageContent,
  // Content pipeline (Track B)
  contentEntry,
  keywordEntry,
  materialAsset,
  // Homepage dynamic content
  homepageFaqEntry,
  homepageTestimonialEntry,
];
