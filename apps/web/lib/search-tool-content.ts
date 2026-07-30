import { z } from "zod";
import { SANITY_CONTENT_LOCALES } from "@new-asinseed/contracts";

import { getLocaleConfig, type Locale, type LocaleContentMap } from "./locales";
import { getSanityClient } from "./sanity-client";
import { readSanityWithinBudget } from "./sanity-request";

const SearchToolContentSchema = z.object({
  locale: z.enum(SANITY_CONTENT_LOCALES),
  eyebrow: z.string().min(1),
  introTitle: z.string().min(1),
  introDescription: z.string().min(1),
  methodTitle: z.string().min(1),
  methodPoints: z.array(z.object({ title: z.string().min(1), body: z.string().min(1) })).length(3),
});
export type SearchToolContent = z.infer<typeof SearchToolContentSchema>;

const SEARCH_TOOL_CONTENT_FALLBACK: LocaleContentMap<SearchToolContent> = {
  cn: {
    locale: "zh-cn",
    eyebrow: "关键词研究工具",
    introTitle: "从一个 ASIN 或关键词，开始一次可解释的研究",
    introDescription: "输入 ASIN 时查看关联关键词研究视图；输入关键词时查看关键词需求字段。当前页面已接入本地验证数据，用于确认任务流程，不代表实时查询结果。",
    methodTitle: "先明确输入，再判断下一步",
    methodPoints: [
      { title: "识别研究对象", body: "选择市场后输入一个 ASIN 或关键词，工具会明确显示当前识别的研究模式。" },
      { title: "查看对应字段", body: "ASIN 与关键词输入使用不同的结果字段，避免把两类任务混在同一张旧式结果表里。" },
      { title: "理解当前边界", body: "结果区域会标记数据来源；真实数据、账号权益、导出和历史记录仍未接入。" },
    ],
  },
  en: {
    locale: "en",
    eyebrow: "Keyword research tool",
    introTitle: "Start an explainable study from an ASIN or keyword",
    introDescription: "An ASIN opens a related-keyword view; a keyword opens a demand-field view. This page currently uses local verification data, not live query results.",
    methodTitle: "Clarify the input before choosing the next step",
    methodPoints: [
      { title: "Identify the research target", body: "Choose a marketplace and enter one ASIN or keyword." },
      { title: "Read the matching fields", body: "ASIN and keyword inputs use distinct result fields." },
      { title: "Understand the current boundary", body: "The result area identifies its data source and does not imply live access." },
    ],
  },
};

const SEARCH_TOOL_CONTENT_PROJECTION = `{
  locale,
  eyebrow,
  introTitle,
  introDescription,
  methodTitle,
  methodPoints[]{ title, body },
}`;

export async function getSearchToolContent(locale: Locale): Promise<SearchToolContent> {
  const fallback = SEARCH_TOOL_CONTENT_FALLBACK[locale];
  const client = getSanityClient();
  if (!client) return fallback;

  try {
    const document = await readSanityWithinBudget(client.fetch<unknown>(
      `*[_type == "searchToolContent" && locale == $locale][0]${SEARCH_TOOL_CONTENT_PROJECTION}`,
      { locale: getLocaleConfig(locale).sanityLocale },
    ));
    const data = document && typeof document === "object" && !Array.isArray(document) ? document : {};
    const parsed = SearchToolContentSchema.safeParse({ ...fallback, ...data });
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}
