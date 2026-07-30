import type { Locale, LocaleContentMap } from "./locales";

export interface SiteNavLink {
  label: string;
  href: string;
}

/**
 * Copy for site-wide chrome (header/footer) rendered by the locale layout —
 * kept separate from homepage section content because Header/Footer will wrap
 * future non-homepage pages (blog, help center) too, not just this page.
 *
 * All nav/footer hrefs are deliberately restricted to routes that exist in
 * this app today (`/cn`) or in-page anchors rendered by the rebuilt homepage.
 * Legacy extension, help, partner, blog, and affiliate URLs are intentionally
 * absent: promoting any of them into global navigation would create a false
 * capability claim or a dead link.
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
      { label: "关键词工具", href: "/cn/US" },
      { label: "研究方法", href: "/cn#method" },
    ],
    primaryCta: { label: "开始反查", href: "/cn/US" },
    mobileMenuOpenLabel: "打开菜单",
    mobileMenuCloseLabel: "关闭菜单",
    languageSwitchLabel: "切换语言",
    footer: {
      productHeading: "产品",
      productLinks: [{ label: "关键词工具", href: "/cn/US" }],
      resourcesHeading: "探索",
      resourcesLinks: [{ label: "研究方法", href: "/cn#method" }],
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
      { label: "Keyword tool", href: "/cn/US" },
      { label: "Method", href: "/cn#method" },
    ],
    primaryCta: { label: "Start a lookup", href: "/cn/US" },
    mobileMenuOpenLabel: "Open menu",
    mobileMenuCloseLabel: "Close menu",
    languageSwitchLabel: "Switch language",
    footer: {
      productHeading: "Product",
      productLinks: [{ label: "Keyword tool", href: "/cn/US" }],
      resourcesHeading: "Explore",
      resourcesLinks: [{ label: "Method", href: "/cn#method" }],
      languageHeading: "Language",
      legalHeading: "Legal",
      legalComingSoonLabel: "Coming soon",
      legalItems: ["Privacy Policy", "Terms of Service"],
      copyright: "©2013-2026 ASINSEED.COM",
    },
  },
};
