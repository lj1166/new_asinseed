/**
 * Site language registry.
 *
 * Only entries in ACTIVE_LOCALE_ROUTES are rendered, indexed, or offered in
 * Studio. Planned entries deliberately remain unavailable until their
 * localized content and acceptance checks are complete.
 */
export const SITE_LOCALES = {
  cn: { sanityLocale: "zh-cn", htmlLang: "zh-CN", hreflang: "zh-CN", ogLocale: "zh_CN", title: "简体中文" },
  "zh-tw": { sanityLocale: "zh-tw", htmlLang: "zh-TW", hreflang: "zh-TW", ogLocale: "zh_TW", title: "繁體中文" },
  en: { sanityLocale: "en", htmlLang: "en", hreflang: "en", ogLocale: "en_US", title: "English" },
  fr: { sanityLocale: "fr", htmlLang: "fr", hreflang: "fr", ogLocale: "fr_FR", title: "Français" },
  de: { sanityLocale: "de", htmlLang: "de", hreflang: "de", ogLocale: "de_DE", title: "Deutsch" },
  it: { sanityLocale: "it", htmlLang: "it", hreflang: "it", ogLocale: "it_IT", title: "Italiano" },
  es: { sanityLocale: "es", htmlLang: "es", hreflang: "es", ogLocale: "es_ES", title: "Español" },
  ja: { sanityLocale: "ja", htmlLang: "ja", hreflang: "ja", ogLocale: "ja_JP", title: "日本語" },
  vi: { sanityLocale: "vi", htmlLang: "vi", hreflang: "vi", ogLocale: "vi_VN", title: "Tiếng Việt" },
  ms: { sanityLocale: "ms", htmlLang: "ms", hreflang: "ms", ogLocale: "ms_MY", title: "Bahasa Melayu" },
} as const;

export type SiteLocale = keyof typeof SITE_LOCALES;

// Chinese-first rollout: add a route here only after localized content is
// complete and this locale has passed its own URL/SEO/browser acceptance.
export const ACTIVE_LOCALE_ROUTES = ["cn"] as const satisfies readonly SiteLocale[];
export type Locale = (typeof ACTIVE_LOCALE_ROUTES)[number];
export type PlannedLocale = Exclude<SiteLocale, Locale>;

export type LocaleContentMap<T> = Record<Locale, T> & Partial<Record<PlannedLocale, T>>;

export const SANITY_CONTENT_LOCALES = ["zh-cn", "zh-tw", "en", "fr", "de", "it", "es", "ja", "vi", "ms"] as const;
export type SanityContentLocale = (typeof SANITY_CONTENT_LOCALES)[number];

export const ACTIVE_SANITY_LOCALE_OPTIONS = [
  { title: SITE_LOCALES.cn.title, value: SITE_LOCALES.cn.sanityLocale },
] as const;

export function isActiveLocale(value: string): value is Locale {
  return (ACTIVE_LOCALE_ROUTES as readonly string[]).includes(value);
}

export function getLocaleConfig(locale: Locale) {
  return SITE_LOCALES[locale];
}

export function getActiveLocaleOptions() {
  return ACTIVE_LOCALE_ROUTES.map((route) => ({
    route,
    title: SITE_LOCALES[route].title,
  }));
}
