import type { Locale, LocaleContentMap } from "./locales";

export interface SiteNavLink {
  label: string;
  href: string;
}

/**
 * Copy for site-wide chrome (header/footer) rendered by the locale layout —
 * kept separate from `homepage-content.ts` because Header/Footer will wrap
 * future non-homepage pages (blog, help center) too, not just this page.
 *
 * All nav/footer hrefs are deliberately restricted to routes that exist in
 * this app today (`/cn`) or in-page anchors on sections this batch
 * actually renders (`#hero-search`, `#capabilities`, `#resources`). Legacy
 * routes like `/en/extension` or `/en/help` are NOT reused here even though
 * they appear as content links inside the page body (see homepage-content.ts)
 * — this batch only implements `/[locale]`, so promoting those into
 * persistent header/footer nav would add dead links on every future page.
 */
export interface SiteChromeCopy {
  brandName: string;
  brandTagline: string;
  nav: SiteNavLink[];
  primaryCta: SiteNavLink;
  mobileMenuOpenLabel: string;
  mobileMenuCloseLabel: string;
  languageSwitchLabel: string;
  footer: {
    productHeading: string;
    productLinks: SiteNavLink[];
    resourcesHeading: string;
    resourcesLinks: SiteNavLink[];
    languageHeading: string;
      legalHeading: string;
    legalComingSoonLabel: string;
    legalItems: string[];
    copyright: string;
  };
}

export const SITE_CHROME_COPY: LocaleContentMap<SiteChromeCopy> = {
  cn: {
    brandName: "AsinSeed",
    brandTagline: "亚马逊关键词反查工具",
    nav: [
      { label: "产品能力", href: "#capabilities" },
      { label: "资源", href: "#resources" },
    ],
    primaryCta: { label: "立即体验", href: "#hero-search" },
    mobileMenuOpenLabel: "打开菜单",
    mobileMenuCloseLabel: "关闭菜单",
    languageSwitchLabel: "切换语言",
    footer: {
      productHeading: "产品",
      productLinks: [{ label: "产品能力", href: "#capabilities" }],
      resourcesHeading: "资源",
      resourcesLinks: [{ label: "帮助与常见问题", href: "#resources" }],
      languageHeading: "语言",
      legalHeading: "法务",
      legalComingSoonLabel: "即将上线",
      legalItems: ["隐私政策", "服务条款"],
      copyright: "©2013-2026 ASINSEED.COM",
    },
  },
  en: {
    brandName: "AsinSeed",
    brandTagline: "Amazon Reverse ASIN Research Tool",
    nav: [
      { label: "Capabilities", href: "#capabilities" },
      { label: "Resources", href: "#resources" },
    ],
    primaryCta: { label: "Try it now", href: "#hero-search" },
    mobileMenuOpenLabel: "Open menu",
    mobileMenuCloseLabel: "Close menu",
    languageSwitchLabel: "Switch language",
    footer: {
      productHeading: "Product",
      productLinks: [{ label: "Capabilities", href: "#capabilities" }],
      resourcesHeading: "Resources",
      resourcesLinks: [{ label: "Help & FAQ", href: "#resources" }],
      languageHeading: "Language",
      legalHeading: "Legal",
      legalComingSoonLabel: "Coming soon",
      legalItems: ["Privacy Policy", "Terms of Service"],
      copyright: "©2013-2026 ASINSEED.COM",
    },
  },
};
