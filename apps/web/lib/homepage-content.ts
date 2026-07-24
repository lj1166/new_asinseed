import type { HomepageFaqEntry, HomepageTestimonialEntry } from "@new-asinseed/contracts";

import type { Locale } from "./locales";

export interface StationOption {
  code: string;
  flagSrc: string;
  label: string;
}

export interface FeatureBlock {
  icon: string;
  title: string;
  body: string;
}

export interface PartnerLink {
  name: string;
  /**
   * Legacy cn "SellerSprite" logo used `href="javascript:void(0);"` — a
   * non-functional link. Preserved here as `href: null` so the renderer can
   * skip the anchor entirely instead of carrying over a dead `javascript:`
   * URI.
   */
  href: string | null;
  opensNewTab: boolean;
  logoSrc: string;
  alt: string;
}

export interface VideoBullet {
  text: string;
  link?: { href: string; label: string; opensNewTab: boolean };
}

export interface HomepageCopy {
  pageTitle: string;
  hero: {
    heading: string;
    subheading: string;
    searchPlaceholder: string;
    searchAriaLabel: string;
    submitLabel: string;
    historyLabel: string;
    emptyValidationMessage: string;
    examplesLabel: string;
    examples: { label: string; href: string }[];
  };
  stations: StationOption[];
  features: FeatureBlock[];
  extension: {
    heading: string;
    bullets: string[];
    ctaHref: string;
    ctaLabel: string;
    ctaOpensNewTab: boolean;
    imageSrc: string;
  };
  video: {
    heading: string;
    bullets: VideoBullet[];
    imageSrc: string;
  };
  partnersHeading: string;
  partners: PartnerLink[];
  faq: {
    heading: string;
    contacts: {
      icon: string;
      title: string;
      body: string;
      linkHref: string;
      linkLabel: string;
      linkOpensNewTab: boolean;
    }[];
  };
}

const CN_STATIONS: StationOption[] = [
  { code: "US", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/us.svg", label: "美国站" },
  { code: "JP", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/jp.svg", label: "日本站" },
  { code: "UK", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/gb.svg", label: "英国站" },
  { code: "DE", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/de.svg", label: "德国站" },
  { code: "FR", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/fr.svg", label: "法国站" },
  { code: "IT", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/it.svg", label: "意大利" },
  { code: "ES", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/es.svg", label: "西班牙" },
  { code: "CA", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/ca.svg", label: "加拿大" },
  { code: "IN", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/in.svg", label: "印度站" },
];

// Note: German (not "Germany") is the literal legacy label — preserved verbatim.
const EN_STATIONS: StationOption[] = [
  { code: "US", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/us.svg", label: "United States" },
  { code: "JP", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/jp.svg", label: "Japan" },
  { code: "UK", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/gb.svg", label: "United Kingdom" },
  { code: "DE", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/de.svg", label: "German" },
  { code: "FR", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/fr.svg", label: "France" },
  { code: "IT", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/it.svg", label: "Italy" },
  { code: "ES", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/es.svg", label: "Spain" },
  { code: "CA", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/ca.svg", label: "Canada" },
  { code: "IN", flagSrc: "/assets-frontend/vendor/flag-icon-css/flags/4x3/in.svg", label: "India" },
];

export const HOMEPAGE_COPY: Record<Locale, HomepageCopy> = {
  "zh-cn": {
    pageTitle: "AsinSeed - 超准确的亚马逊关键词反查工具",
    hero: {
      heading: "AsinSeed - 超准确的亚马逊关键词反查工具",
      subheading: "一键反查竞品核心流量词",
      searchPlaceholder: "请输入关键词或ASIN，如：flashlight或B071J24FNY",
      searchAriaLabel: "请输入产品ASIN",
      submitLabel: "获取流量词",
      historyLabel: "查询历史",
      emptyValidationMessage: "请输入需要查询的产品ASIN或关键词",
      examplesLabel: "示例:",
      examples: [
        { label: "flashlight", href: "/cn/US?q=flashlight" },
        { label: "B01IHHLB3W", href: "/cn/US/B01IHHLB3W?qid=4800e5f0acc9" },
        { label: "B07YC8PVF1", href: "/cn/US/B07YC8PVF1?qid=b66085ef26ef" },
      ],
    },
    stations: CN_STATIONS,
    features: [
      {
        icon: "/assets/svg/flat-icons/icon-terms.svg",
        title: "真实用户搜索词",
        body: "基于业内领先的大数据和人工智能技术，挖掘亚马逊竞品的核心流量词，真实反映ASIN的搜索流量入口",
      },
      {
        icon: "/assets/svg/flat-icons/icon-data.svg",
        title: "亿级关键词和商品",
        body: "每月更新商品和关键词数据近8亿条，再基于独家算法计算出每个ASIN的真实搜索流量词，让您优化Listing和PPC广告一步到位",
      },
      {
        icon: "/assets/svg/flat-icons/icon-country.svg",
        title: "支持9国站点",
        // Source quirk, preserved verbatim: heading says "9国" but this body
        // text lists only 8 countries (missing India, which the station
        // dropdown itself does include).
        body: "同步更新美国、日本、英国、德国、法国、意大利、西班牙、加拿大，帮您对比了解各国的搜索习惯",
      },
    ],
    extension: {
      heading: "Chrome浏览器插件",
      bullets: [
        "一键查询ASIN核心流量词",
        "终生无限次试用，每月有免费无限制查询额度",
        "支持关键词导出，直接用来优化Listing和PPC广告",
      ],
      ctaHref: "/cn/extension",
      ctaLabel: "前往下载",
      ctaOpensNewTab: false,
      imageSrc: "/assets/images/extension/extension-20181121.png",
    },
    video: {
      heading: "视频讲解",
      bullets: [
        { text: "全面为您讲解AsinSeed的Web版及Chrome插件使用方法；" },
        { text: "介绍流量词、流量权重、搜索量等指标的具体含义；" },
        { text: "告诉您如何查看变体的流量词，以及识别核心变体来选品和竞品分析；" },
        { text: "高级视频课程即将推出，教您如何用AsinSeed优化Listing和PPC广告词；" },
        {
          text: "2018年11月19日跨境电商大神Moss直播流量词概念",
          link: {
            href: "https://www.asinseed.com/cn/blog/amazon-keyword-moss",
            label: "点击进入",
            opensNewTab: true,
          },
        },
      ],
      imageSrc: "/assets/images/video/introduce-video-20181122.png",
    },
    partnersHeading: "合作伙伴",
    partners: [
      { name: "Amazon", href: "https://www.amazon.com", opensNewTab: true, logoSrc: "/assets/svg/partner/amazon-original.svg", alt: "Amazon" },
      { name: "卖家精灵", href: null, opensNewTab: false, logoSrc: "/assets/svg/partner/sellerspirit-original.svg", alt: "卖家精灵" },
      { name: "雨果网", href: "http://www.cifnews.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/yuguo-original.svg", alt: "雨果网" },
      { name: "亿恩网", href: "http://www.ennews.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/yien-original.svg", alt: "亿恩网" },
      { name: "PayPal", href: "https://www.paypal.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/paypal-original.svg", alt: "PayPal" },
      { name: "卖家成长", href: "http://www.sellergrowth.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/growth-original.svg", alt: "卖家成长" },
      { name: "AMZ123", href: "http://www.amz123.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/amz123-original.svg", alt: "AMZ123" },
      { name: "知无不言", href: "http://www.wearesellers.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/zhiwu-original.svg", alt: "知无不言" },
      { name: "创蓝论坛", href: "https://bbs.ichuanglan.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/chuanglan.png", alt: "创蓝论坛" },
      { name: "旺销王", href: "http://www.wxwerp.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/wangxiao-original.png", alt: "旺销王" },
      { name: "闯蒙跨境", href: "http://www.cmteco.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/chuangmen-original.png", alt: "闯蒙跨境" },
      { name: "邦阅网", href: "https://www.52by.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/bangyue-original.png", alt: "邦阅网" },
      { name: "赴彼岸", href: "http://www.sellerfba.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/fubian-original.png", alt: "赴彼岸" },
      { name: "丝路互联", href: "http://www.silulink.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/silulink-original.png", alt: "丝路互联" },
      { name: "跨境卫士", href: "https://www.kuajingvs.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/kuajingvs_n.png", alt: "跨境卫士" },
      { name: "融皓科技", href: "https://ronghoo.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/ronghaokeji.png", alt: "融皓科技" },
      { name: "米境通跨境电商erp管理系统", href: "https://www.miwaimao.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/miwaimao.jpg", alt: "米境通跨境电商erp管理系统" },
      // Real production referral/affiliate parameter, preserved verbatim (not fabricated).
      { name: "AdsPower电商指纹浏览器", href: "https://www.adspower.net/?code=e1i4pvk&source=sellersprite", opensNewTab: true, logoSrc: "/assets/svg/partner/ads-power.png", alt: "AdsPower电商指纹浏览器" },
      { name: "灯塔跨境", href: "https://123.dtkj.net/", opensNewTab: true, logoSrc: "/assets/svg/partner/dtkjs.png", alt: "灯塔跨境" },
    ],
    faq: {
      heading: "常见问题",
      contacts: [
        {
          icon: "fa-envelope",
          title: "找不到您关心的问题?",
          body: "给我们发送邮件，详尽描述您的问题，我们将尽快回复您。",
          linkHref: "/cn/help",
          linkLabel: "写邮件给我们",
          linkOpensNewTab: false,
        },
        {
          icon: "fab fa-slack",
          title: "技术咨询",
          body: "在API接入、资源整合方面出现问题? 联系我们技术部，全程为您解答。",
          linkHref: "https://www.sellersprite.com/v3/knowledge/feature/about-api",
          linkLabel: "API文档",
          linkOpensNewTab: true,
        },
      ],
    },
  },
  en: {
    pageTitle: "AsinSeed - Amazon Reverse ASIN Research Tool-AsinSeed",
    hero: {
      heading: "AsinSeed - Amazon Reverse Asin Search Tool, Free Amazon Keyword Tool",
      subheading: "Find the exact keywords used by your competitors",
      // Verbatim: double space before "/ B0773WG6NK" is a literal source quirk.
      searchPlaceholder: "Enter Keyword or Asin, eg. flashlight  / B0773WG6NK",
      searchAriaLabel: "Enter Amazon ASIN",
      submitLabel: "Reverse Search",
      historyLabel: "Search Log",
      emptyValidationMessage: "ASIN or Keyword is required.",
      examplesLabel: "Examples:",
      examples: [
        { label: "flashlight", href: "/en/US?q=flashlight" },
        { label: "B01IHHLB3W", href: "/en/US/B01IHHLB3W?qid=4800e5f0acc9" },
        { label: "B07YC8PVF1", href: "/en/US/B07YC8PVF1?qid=b66085ef26ef" },
      ],
    },
    stations: EN_STATIONS,
    features: [
      {
        icon: "/assets/svg/flat-icons/icon-terms.svg",
        title: "Find Out Actual User Search Terms",
        body: "Dig into your competitors real keywords which bring them the most traffic. The most straight forward method of optimizing keywords Save your PPC cost and boost your keywords rank",
      },
      {
        icon: "/assets/svg/flat-icons/icon-data.svg",
        title: "Billions of Keywords and Products",
        body: "0.8 billion keywords updated monthly. Compute each asin traffic with our proprietary algorithm. Provide detailed data of market competition and demand",
      },
      {
        icon: "/assets/svg/flat-icons/icon-country.svg",
        title: "Support 9 Amazon Marketplace",
        body: "Support US, Japan, UK, Germany, France, Italy, Spain and Canada. Supports 6+ months of search traffic for each ASIN. Get a deeper understanding of search habits from any market place.",
      },
    ],
    extension: {
      heading: "Chrome Extension",
      // Source asymmetry, preserved verbatim: en lists a 4th bullet ("Support
      // all marketplaces in web app") that has no cn counterpart.
      bullets: [
        "Discover high traffic keywords of competitors with one click",
        "Life time trials, free lookup times without any limits every month",
        "Unlimited keywords export, directly used to optimize Listing and PPC advertising",
        "Support all marketplaces in web app",
      ],
      ctaHref: "/en/extension",
      ctaLabel: "DOWNLOAD NOW",
      ctaOpensNewTab: true,
      imageSrc: "/assets/images/extension/extension-20181121-en.png",
    },
    video: {
      heading: "AsinSeed Video",
      // Source asymmetry, preserved verbatim: en has 4 bullets and omits the
      // cn-only 5th bullet linking to the Moss livestream blog post.
      bullets: [
        { text: "The presentation of AsinSeed Web version and the usage of Chrome plug-in." },
        { text: "Introduce the meaning of traffic keywords, weight, and searches." },
        {
          text: "The brief of choosing and analyzing compatible products by finding the traffic keywords of the child ASIN, and identifying the core one.",
        },
        {
          text: "The advanced video version will be released soon. It will include that how to use AsinSeed to optimize Listing and PPC words.",
        },
      ],
      imageSrc: "/assets/images/video/introduce-video-en-20181122.png",
    },
    partnersHeading: "Partners",
    partners: [
      { name: "Amazon", href: "https://developer.amazonservices.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/amazon-en.png", alt: "Amazon" },
      // Unlike cn's non-functional SellerSprite logo, en's really does link out.
      { name: "SellerSprite", href: "http://www.sellersprite.com/en", opensNewTab: true, logoSrc: "/assets/svg/partner/sellersprite-en.png", alt: "SellerSprite" },
      { name: "WebRetailer", href: "https://www.webretailer.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/webretailer.png", alt: "WebRetailer" },
      { name: "CloudFlare", href: "https://www.cloudflare.com", opensNewTab: true, logoSrc: "/assets/svg/partner/cloudflare-en.png", alt: "CloudFlare" },
      { name: "PayPal", href: "https://www.paypal.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/paypal-en.png", alt: "PayPal" },
      { name: "amazon-tools", href: "https://jordiob.com/amazon-tools/", opensNewTab: true, logoSrc: "/assets/svg/partner/amazon-tools-original.png", alt: "amazon-tools" },
      { name: "fba4u", href: "https://fba4u.com/product-category/keyword-tools/", opensNewTab: true, logoSrc: "/assets/svg/partner/fba4u-original.png", alt: "fba4u" },
      { name: "fbahero", href: "https://fba-hero.com/", opensNewTab: true, logoSrc: "/assets/svg/partner/fbahero-original.png", alt: "fbahero" },
    ],
    faq: {
      heading: "FAQ",
      contacts: [
        {
          icon: "fa-envelope",
          title: "Can't find your answer?",
          body: "We want to answer all of your queries. Get in touch and we'll get back to you as soon as we can.",
          linkHref: "/en/help",
          linkLabel: "Email us",
          linkOpensNewTab: false,
        },
        {
          icon: "fab fa-slack",
          title: "Technical questions",
          // Verbatim source quirk: no space after "questions?".
          body: "Have some technical questions?Contact our technical department to answer your questions.",
          linkHref: "https://shimo.im/docs/ON6rp4yrhCcmv2Y7",
          linkLabel: "API",
          linkOpensNewTab: true,
        },
      ],
    },
  },
};

/**
 * Static fallback testimonials, used when Sanity is not configured (see
 * lib/homepage-data.ts). Carousel order and avatar files are copied
 * verbatim from the legacy carousel — note that cn's 3rd testimonial
 * ("Kerry") uses the avatar file `levin.png`, a legacy filename/name
 * mismatch preserved as-is rather than "corrected".
 */
export const HOMEPAGE_TESTIMONIALS_SEED: Record<Locale, HomepageTestimonialEntry[]> = {
  "zh-cn": [
    {
      locale: "zh-cn",
      quoteText:
        "我们真正需要的，是流量词而不是关键词！不带来流量的关键词优化都是耍流氓。如何最有效地寻找流量词？我推荐AsinSeed，它是我见过的最有诚意的一款亚马逊关键词反查工具。",
      authorName: "Moss",
      authorTitle: "知名跨境电商讲师和操盘手",
      avatarUrl: "/assets/images/240x240/moss.png",
      order: 0,
    },
    {
      locale: "zh-cn",
      quoteText:
        "做亚马逊卖家服务多年，很多卖家提问能否开发一款反查竞品流量词的工具，因为Listing关键词优化是一切推广的基础，例如自然搜索流量和广告流量(特别是自动投放)，于是为响应大众需求我们开发了AsinSeed，寓意ASIN的流量之源。",
      authorName: "老陈",
      authorTitle: "AsinSeed创始人兼产品经理",
      avatarUrl: "/assets/images/240x240/ceo_chen.png",
      order: 1,
    },
    {
      locale: "zh-cn",
      quoteText:
        "做亚马逊日本站已经5年，市面上支持日本站的关键词工具很少，关键词反查工具几乎没有；没想到AsinSeed一面世就这么给力，并且关键词比我们采购的ASIN报告还丰富、精准，这样我们优化关键词更有目标性。",
      authorName: "Kerry",
      authorTitle: "深圳某日本站大卖",
      avatarUrl: "/assets/images/240x240/levin.png",
      order: 2,
    },
    {
      locale: "zh-cn",
      quoteText:
        "根据对手的实际引流词比分析竞品Listing以及用关键词推荐工具(行业词)来优化Listing和CPC广告来得更直接、省力、精准，即使像蓝牙耳机等同质化竞品用了AsinSeed查询后，我们竟然惊奇地发现流量词有这么大的差异。",
      authorName: "David",
      authorTitle: "广州某蓝牙耳机大卖",
      avatarUrl: "/assets/images/240x240/david.png",
      order: 3,
    },
  ],
  en: [
    {
      locale: "en",
      quoteText:
        "As a service provider of Amazon for many years, many sellers hope us develope a tool, to discover competitors keywords which bring real traffic. They think it's most straight forward method of opitimizing listing with competitor keywords. Listing SEO is the basis of all promotion, such as organic traffic and advertising traffic(especially auto sponsored ads), so we develope AsinSeed, which means Source(seed) of ASIN.",
      authorName: "Mr. Chen",
      authorTitle: "AsinSeed Founder & Product Manager",
      avatarUrl: "/assets/images/240x240/ceo_chen.png",
      order: 0,
    },
    {
      locale: "en",
      quoteText:
        "Working on Amazon Japan marketplace for 5 years. There are very few keyword tools which support Japanese, and reverse asin keyword tools are more rare. I didn’t expect AsinSeed to be so powerful, and the keywords are richer and more accurate than the ASIN report we purchased.",
      authorName: "Kerry",
      authorTitle: "Japanese Seller from ShenZhen in China",
      avatarUrl: "/assets/images/240x240/levin.png",
      order: 1,
    },
    {
      locale: "en",
      quoteText:
        "According to the actual traffic keywords of competitors, it is more direct, labor-saving and reliable to optimizing the listing, compared to keyword recommendation tool (industry keywords) . Even if the bluetooth headset is so familiar, after we use AsinSeed, we have a shock that there was such a great difference in the real traffic keywords.",
      authorName: "David",
      authorTitle: "Bluetooth Seller from GuangZhou in China",
      avatarUrl: "/assets/images/240x240/david.png",
      order: 2,
    },
  ],
};

/**
 * PLACEHOLDER Q&A content. The legacy FAQ accordion (`jsp/{locale}/__frontend/base/qa.jsp`)
 * renders `${questionList}` from an admin-managed CMS `tips` table
 * (`/admin/cms/tips/edit/${question.id}`) — the real question/answer text is
 * database-sourced and does not exist in any static source file, so it
 * cannot be extracted. These entries are explicitly fabricated placeholders
 * and must be replaced with real content fetched from Sanity (or the actual
 * legacy `tips` table) before this page is considered content-complete.
 */
export const HOMEPAGE_FAQ_SEED: Record<Locale, HomepageFaqEntry[]> = {
  "zh-cn": [
    {
      locale: "zh-cn",
      question: "[占位内容] 这是一个示例问题？",
      answer: "[占位内容] 真实的常见问题内容来自后台 CMS（tips 表），尚未接入，此处为占位文本。",
      order: 0,
    },
  ],
  en: [
    {
      locale: "en",
      question: "[Placeholder] This is a sample question?",
      answer: "[Placeholder] Real FAQ content is CMS-sourced (the legacy `tips` table) and not yet wired up — this is placeholder text.",
      order: 0,
    },
  ],
};

export interface ContentPreviewCard {
  badge: string;
  title: string;
  body: string;
}

export interface MethodologyStep {
  title: string;
  body: string;
}

/**
 * Copy for the three NEW homepage sections added in this batch (capability
 * showcase, content/SEO entry points, methodology). Kept as a separate export
 * from `HOMEPAGE_COPY` so the existing, already-P4-verified fields above are
 * never touched by this batch's additions. `contentHub.cards` follow the same
 * explicit `[占位内容]`/`[Placeholder]` convention as `HOMEPAGE_FAQ_SEED`
 * above — no real `/blog` or `/help` routes exist yet, so these render as
 * non-clickable "coming soon" cards rather than fabricated links.
 */
export interface HomepageSectionsCopy {
  capabilities: {
    eyebrow: string;
    title: string;
    description: string;
  };
  contentHub: {
    eyebrow: string;
    title: string;
    description: string;
    cards: ContentPreviewCard[];
  };
  methodology: {
    eyebrow: string;
    title: string;
    description: string;
    steps: MethodologyStep[];
    credibilityHeading: string;
  };
}

export const HOMEPAGE_SECTIONS_COPY: Record<Locale, HomepageSectionsCopy> = {
  "zh-cn": {
    capabilities: {
      eyebrow: "产品能力",
      title: "核心产品能力",
      description: "以下为 AsinSeed 当前的核心能力说明；如需实际查询，请使用上方搜索框。",
    },
    contentHub: {
      eyebrow: "资源",
      title: "内容与帮助中心",
      description: "博客与帮助中心内容即将上线，届时将从内容管理系统同步。",
      cards: [
        {
          badge: "即将上线",
          title: "[占位内容] 博客",
          body: "[占位内容] 选品、关键词优化相关的文章将陆续发布于此。",
        },
        {
          badge: "即将上线",
          title: "[占位内容] 帮助中心",
          body: "[占位内容] 常见操作指南与使用教程将陆续发布于此。",
        },
      ],
    },
    methodology: {
      eyebrow: "方法论",
      title: "我们如何工作",
      description:
        "AsinSeed 的核心逻辑是：从真实的亚马逊搜索与商品数据出发，通过算法计算出与竞品强相关的流量词，最终转化为可执行的Listing与广告优化动作。",
      steps: [
        { title: "数据来源", body: "持续同步亚马逊多站点的商品与关键词数据。" },
        { title: "分析方法", body: "基于独家算法计算ASIN与关键词的真实关联及流量权重。" },
        { title: "可执行洞察", body: "将分析结果转化为可直接用于Listing优化和广告投放的关键词清单。" },
      ],
      credibilityHeading: "来自真实用户与合作伙伴的认可",
    },
  },
  en: {
    capabilities: {
      eyebrow: "Capabilities",
      title: "Core Product Capabilities",
      description: "An overview of what AsinSeed does today. Use the search box above to try a real (mock-data) lookup.",
    },
    contentHub: {
      eyebrow: "Resources",
      title: "Content & Help Center",
      description: "Blog and help center content is coming soon and will be synced from our content system.",
      cards: [
        {
          badge: "Coming soon",
          title: "[Placeholder] Blog",
          body: "[Placeholder] Articles on product research and keyword optimization will be published here.",
        },
        {
          badge: "Coming soon",
          title: "[Placeholder] Help Center",
          body: "[Placeholder] Guides and tutorials will be published here.",
        },
      ],
    },
    methodology: {
      eyebrow: "Methodology",
      title: "How We Work",
      description:
        "AsinSeed starts from real Amazon search and product data, computes the keywords most strongly linked to a competitor's traffic using our own algorithm, and turns that into concrete listing and advertising actions.",
      steps: [
        { title: "Data Source", body: "Continuously synced product and keyword data across Amazon marketplaces." },
        { title: "Analysis Method", body: "Our proprietary algorithm computes the real traffic relevance between an ASIN and its keywords." },
        { title: "Actionable Insight", body: "Results are turned into keyword lists ready to use for listing optimization and ad targeting." },
      ],
      credibilityHeading: "Trusted by real users and partners",
    },
  },
};
