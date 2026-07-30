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
    { name: "entry", title: "工具入口" },
    { name: "method", title: "最小方法说明" },
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
      title: "首页眉题",
      type: "string",
      group: "entry",
      validation: (rule) => rule.required(),
      description: "显示在 H1 上方的简短定位，不替代 H1 或 SEO title。",
    }),
    defineField({
      name: "toolSubmitLabel",
      title: "工具提交文案",
      type: "string",
      group: "entry",
      validation: (rule) => rule.required(),
      description: "首页真实表单的提交按钮。提交后进入已存在的搜索工具路由。",
    }),
    defineField({
      name: "toolHint",
      title: "工具入口提示",
      type: "text",
      rows: 2,
      group: "entry",
      validation: (rule) => rule.required(),
      description: "显示在表单附近，说明用户可以输入什么；不得承诺实时数据或结果。",
    }),
    defineField({
      name: "methodTitle",
      title: "方法说明标题",
      type: "string",
      group: "method",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "methodDescription",
      title: "方法说明摘要",
      type: "text",
      rows: 2,
      group: "method",
      validation: (rule) => rule.required(),
      description: "只解释当前工具路径，不重复 meta description，也不填写未经验证的成效。",
    }),
    threeCardList("methodPoints", "三个方法要点", "固定三条，帮助用户理解输入、市场选择和当前数据边界。", "method"),
  ],
  preview: {
    select: { title: "locale", subtitle: "methodTitle" },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: `首页内容 — ${title ?? "未设置 locale"}`, subtitle: subtitle ?? "（尚未填写方法说明）" };
    },
  },
});
