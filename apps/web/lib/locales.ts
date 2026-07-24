export const LOCALES = ["en", "zh-cn"] as const;
export type Locale = (typeof LOCALES)[number];
