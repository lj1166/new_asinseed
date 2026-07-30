import { HomepageContentSchema, type HomepageContent } from "@new-asinseed/contracts";

import { getLocaleConfig, type Locale, type LocaleContentMap } from "./locales";
import { getSanityClient } from "./sanity-client";
import { readSanityWithinBudget } from "./sanity-request";

/**
 * Safe, creative fallback for local development and an empty Studio. It
 * describes the known reverse-ASIN research task but makes no claim about
 * data volume, accuracy, customers, marketplace coverage, or product access.
 */
export const HOMEPAGE_CONTENT_FALLBACK: LocaleContentMap<HomepageContent> = {
  cn: {
    locale: "zh-cn",
    eyebrow: "面向亚马逊卖家的研究起点",
    toolSubmitLabel: "开始反查",
    toolHint: "输入一个 ASIN 或关键词，先进入可操作的研究工具；市场筛选与结果字段会在下一步展开。",
    methodTitle: "让工具回答一个明确的问题",
    methodDescription: "首页只保留开始研究所需的最小信息。更长的教程、案例和行业问题将由后续资源页承接。",
    methodPoints: [
      { title: "一个输入", body: "从 ASIN 或关键词开始，而不是从无法判断优先级的长清单开始。" },
      { title: "一个工具入口", body: "提交后进入合并后的搜索工具，按输入类型显示相应的研究字段。" },
      { title: "一个清楚边界", body: "当前工具会明确展示数据来源与未接入能力，不把验证数据包装成实时结果。" },
    ],
  },
  en: {
    locale: "en",
    eyebrow: "A research starting point for Amazon sellers",
    toolSubmitLabel: "Start a lookup",
    toolHint: "Enter one ASIN or keyword to start with the live tool entry; market selection and result fields appear next.",
    methodTitle: "Let the tool answer one clear question",
    methodDescription: "The homepage keeps only what is needed to start. Longer education will move to future resources.",
    methodPoints: [
      { title: "One input", body: "Start from one ASIN or keyword rather than an unprioritized list." },
      { title: "One tool entry", body: "Submit into the merged tool, which selects fields by input type." },
      { title: "One clear boundary", body: "The tool identifies its data source and does not present verification data as live results." },
    ],
  },
};

const HOMEPAGE_CONTENT_PROJECTION = `{
  locale,
  eyebrow,
  toolSubmitLabel,
  toolHint,
  methodTitle,
  methodDescription,
  methodPoints[]{ title, body },
}`;

export async function getHomepageRebuildContent(locale: Locale): Promise<HomepageContent> {
  const fallback = HOMEPAGE_CONTENT_FALLBACK[locale];
  const client = getSanityClient();
  if (!client) return fallback;

  try {
    const document = await readSanityWithinBudget(client.fetch<unknown>(
      `*[_type == "homepageContent" && locale == $locale][0]${HOMEPAGE_CONTENT_PROJECTION}`,
      { locale: getLocaleConfig(locale).sanityLocale },
    ));
    // A published document can predate a newly added Studio field. Merge it
    // with safe defaults so one missing presentation field never disables all
    // existing operator-maintained homepage content.
    const documentData = document && typeof document === "object" && !Array.isArray(document) ? document : {};
    const parsed = HomepageContentSchema.safeParse({ ...fallback, ...documentData });
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}
