import { ACTIVE_SANITY_LOCALE_OPTIONS } from "@new-asinseed/contracts";
import { defineArrayMember, defineField, defineType } from "sanity";

const cardFields = () => [
  defineField({ name: "title", title: "标题", type: "string", validation: (rule) => rule.required() }),
  defineField({ name: "body", title: "说明", type: "text", rows: 3, validation: (rule) => rule.required() }),
];

const threeCardList = (name: string, title: string, description: string, group: string) =>
  defineField({
    name,
    title,
    type: "array",
    group,
    description,
    of: [defineArrayMember({ type: "object", fields: cardFields() })],
    validation: (rule) => rule.required().length(3),
  });

/**
 * Semantic homepage content only. Metadata and visible H1/subheading remain
 * owned by `homepageSeo`, so Studio never exposes two competing sources for
 * the same page title.
 */
export const homepageContent = defineType({
  name: "homepageContent",
  title: "首页运营内容 / Homepage Content",
  type: "document",
  groups: [
    { name: "basics", title: "基本设置", default: true },
    { name: "hero", title: "首屏文案" },
    { name: "workbench", title: "研究工作台" },
    { name: "scenarios", title: "适用场景" },
    { name: "workflow", title: "研究方法" },
    { name: "closing", title: "结尾转化" },
  ],
  fields: [
    defineField({
      name: "locale",
      title: "语言 / Locale",
      type: "string",
      group: "basics",
      options: { list: [...ACTIVE_SANITY_LOCALE_OPTIONS], layout: "radio" },
      validation: (rule) => rule.required(),
      description: "当前仅开放简体中文；每个 locale 只维护一份首页内容文档。",
    }),
    defineField({
      name: "eyebrow",
      title: "Hero 眉题",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
      description: "显示在 H1 上方的简短定位，不替代 H1 或 SEO title。",
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "主 CTA 文案",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
      description: "当前固定锚定“如何工作”区块；CTA 去向由代码维护，避免指向未上线页面。",
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "次 CTA 文案",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
      description: "当前固定锚定“适用场景”区块。",
    }),
    defineField({
      name: "researchPanelEyebrow",
      title: "工作台眉题",
      type: "string",
      group: "workbench",
      validation: (rule) => rule.required(),
      description: "显示在首屏右侧研究工作台顶部。",
    }),
    defineField({
      name: "researchPanelTitle",
      title: "工作台标题",
      type: "string",
      group: "workbench",
      validation: (rule) => rule.required(),
      description: "用于解释研究工作台的任务，不承诺真实工具能力。",
    }),
    defineField({
      name: "researchPanelDescription",
      title: "工作台说明",
      type: "text",
      rows: 3,
      group: "workbench",
      validation: (rule) => rule.required(),
    }),
    threeCardList("researchSignals", "三个研究信号", "固定三条研究线索，仅描述方法与用户任务，不填写虚构的结果、数据量或效果承诺。", "workbench"),
    defineField({
      name: "researchPanelNotice",
      title: "工作台提示",
      type: "string",
      group: "workbench",
      validation: (rule) => rule.required(),
      description: "明确这是研究路径示意，避免将未接入的工具误导为可用功能。",
    }),
    defineField({ name: "scenariosEyebrow", title: "场景区眉题", type: "string", group: "scenarios", validation: (rule) => rule.required() }),
    defineField({ name: "scenariosTitle", title: "场景区标题", type: "string", group: "scenarios", validation: (rule) => rule.required() }),
    defineField({ name: "scenariosDescription", title: "场景区说明", type: "text", rows: 3, group: "scenarios", validation: (rule) => rule.required() }),
    threeCardList("scenarios", "三个适用场景", "固定三张语义卡片；只描述用户任务，不填写未经证实的数据或效果承诺。", "scenarios"),
    defineField({ name: "workflowEyebrow", title: "方法区眉题", type: "string", group: "workflow", validation: (rule) => rule.required() }),
    defineField({ name: "workflowTitle", title: "方法区标题", type: "string", group: "workflow", validation: (rule) => rule.required() }),
    defineField({ name: "workflowDescription", title: "方法区说明", type: "text", rows: 3, group: "workflow", validation: (rule) => rule.required() }),
    threeCardList("workflowSteps", "三个方法步骤", "固定三步，说明研究路径；不填写未经证实的数据规模、精度或覆盖承诺。", "workflow"),
    defineField({ name: "closingEyebrow", title: "结尾区眉题", type: "string", group: "closing", validation: (rule) => rule.required() }),
    defineField({ name: "closingTitle", title: "结尾区标题", type: "string", group: "closing", validation: (rule) => rule.required() }),
    defineField({ name: "closingDescription", title: "结尾区说明", type: "text", rows: 3, group: "closing", validation: (rule) => rule.required() }),
    defineField({
      name: "closingCtaLabel",
      title: "结尾 CTA 文案",
      type: "string",
      group: "closing",
      validation: (rule) => rule.required(),
      description: "当前固定锚定“如何工作”区块。",
    }),
  ],
  preview: {
    select: { title: "locale", subtitle: "scenariosTitle" },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: `首页内容 — ${title ?? "未设置 locale"}`, subtitle: subtitle ?? "（尚未填写场景区标题）" };
    },
  },
});
