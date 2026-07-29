import { HomepageContentSchema, type HomepageContent } from "@new-asinseed/contracts";

import { getLocaleConfig, type Locale, type LocaleContentMap } from "./locales";
import { getSanityClient } from "./sanity-client";

/**
 * Safe, creative fallback for local development and an empty Studio. It
 * describes the known reverse-ASIN research task but makes no claim about
 * data volume, accuracy, customers, marketplace coverage, or product access.
 */
export const HOMEPAGE_CONTENT_FALLBACK: LocaleContentMap<HomepageContent> = {
  cn: {
    locale: "zh-cn",
    eyebrow: "面向亚马逊卖家的研究起点",
    primaryCtaLabel: "了解反查方法",
    secondaryCtaLabel: "查看适用场景",
    researchPanelEyebrow: "关键词研究工作台",
    researchPanelTitle: "把一个模糊问题，整理成可研究的方向",
    researchPanelDescription: "从 ASIN、商品词或竞品场景开始，先建立研究对象与判断框架。",
    researchSignals: [
      { title: "研究对象", body: "明确要分析的 ASIN、商品词或竞品场景。" },
      { title: "关联信号", body: "把商品表达、竞品线索与搜索意图放在同一视角。" },
      { title: "下一步假设", body: "沉淀值得进一步验证的关键词与行动方向。" },
    ],
    researchPanelNotice: "这是研究路径示意，不展示或承诺真实查询结果。",
    scenariosEyebrow: "从问题开始",
    scenariosTitle: "把关键词研究放回真实的业务问题里",
    scenariosDescription: "先明确要理解的竞品与用户意图，再决定下一步的研究动作，而不是从一串孤立关键词开始。",
    scenarios: [
      { title: "梳理竞品线索", body: "围绕一个具体 ASIN 或同类商品，建立可对照的研究起点。" },
      { title: "校准 Listing 方向", body: "把产品表达、用户需求和关键词研究放在同一条工作路径中审视。" },
      { title: "准备广告研究", body: "在制定投放动作前，先识别值得进一步验证的搜索意图与竞品线索。" },
    ],
    workflowEyebrow: "如何工作",
    workflowTitle: "从竞品线索到下一步研究动作",
    workflowDescription: "这是一个用于理解反查方法的清晰路径；真正的查询结果和工具任务将在结果页重构完成后独立承接。",
    workflowSteps: [
      { title: "确定研究对象", body: "选择要研究的 ASIN、关键词或竞品场景，并写清本次要解决的问题。" },
      { title: "建立对照视角", body: "从竞品、Listing 和搜索意图之间建立可解释的对照关系。" },
      { title: "形成可验证假设", body: "把下一步要验证的关键词、页面表达或投放方向整理为可执行清单。" },
    ],
    closingEyebrow: "先理解，再行动",
    closingTitle: "让每一次关键词研究都有清晰的起点",
    closingDescription: "从具体业务问题出发，建立更可解释的竞品研究路径。查询工具完成迁移后，本页将接入真实的任务入口。",
    closingCtaLabel: "回顾研究方法",
  },
  en: {
    locale: "en",
    eyebrow: "A research starting point for Amazon sellers",
    primaryCtaLabel: "See the method",
    secondaryCtaLabel: "Explore use cases",
    researchPanelEyebrow: "Keyword research workspace",
    researchPanelTitle: "Turn an open question into a research direction",
    researchPanelDescription: "Start from an ASIN, product term, or competitor context before choosing what to investigate.",
    researchSignals: [
      { title: "Research target", body: "Define the ASIN, product term, or competitor context to examine." },
      { title: "Connected signals", body: "View product context, competitor signals, and search intent together." },
      { title: "Next hypothesis", body: "Capture the keyword or action direction that deserves validation next." },
    ],
    researchPanelNotice: "This is a research-path illustration. It does not show or promise live query results.",
    scenariosEyebrow: "Start with a question",
    scenariosTitle: "Put keyword research back into the business question",
    scenariosDescription: "Start with a product, competitor, and user intent before deciding what to investigate next.",
    scenarios: [
      { title: "Frame competitor signals", body: "Use a specific ASIN or product category as a clear starting point for comparison." },
      { title: "Calibrate listing direction", body: "Review product messaging, user needs, and keyword research as one connected workflow." },
      { title: "Prepare ad research", body: "Identify search intents and competitor signals worth validating before planning an action." },
    ],
    workflowEyebrow: "How it works",
    workflowTitle: "From competitor signals to the next research step",
    workflowDescription: "This is a clear path for understanding the reverse-ASIN method. Real query results will have their own destination once the tool page is rebuilt.",
    workflowSteps: [
      { title: "Choose a research target", body: "Start from an ASIN, keyword, or competitor scenario and define the question to answer." },
      { title: "Build a comparison view", body: "Connect competitor signals, listing context, and search intent in an explainable way." },
      { title: "Create a testable hypothesis", body: "Turn the next keywords, page messaging, or campaign direction into an actionable list." },
    ],
    closingEyebrow: "Understand before acting",
    closingTitle: "Give every keyword study a clear starting point",
    closingDescription: "Start with a concrete business question and build a more explainable competitor research path.",
    closingCtaLabel: "Review the method",
  },
};

const HOMEPAGE_CONTENT_PROJECTION = `{
  locale,
  eyebrow,
  primaryCtaLabel,
  secondaryCtaLabel,
  researchPanelEyebrow,
  researchPanelTitle,
  researchPanelDescription,
  researchSignals[]{ title, body },
  researchPanelNotice,
  scenariosEyebrow,
  scenariosTitle,
  scenariosDescription,
  scenarios[]{ title, body },
  workflowEyebrow,
  workflowTitle,
  workflowDescription,
  workflowSteps[]{ title, body },
  closingEyebrow,
  closingTitle,
  closingDescription,
  closingCtaLabel,
}`;

export async function getHomepageRebuildContent(locale: Locale): Promise<HomepageContent> {
  const fallback = HOMEPAGE_CONTENT_FALLBACK[locale];
  const client = getSanityClient();
  if (!client) return fallback;

  try {
    const document = await client.fetch<unknown>(
      `*[_type == "homepageContent" && locale == $locale][0]${HOMEPAGE_CONTENT_PROJECTION}`,
      { locale: getLocaleConfig(locale).sanityLocale },
    );
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
