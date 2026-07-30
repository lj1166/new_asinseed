import { ACTIVE_SANITY_LOCALE_OPTIONS } from "@new-asinseed/contracts";
import { defineArrayMember, defineField, defineType } from "sanity";

export const searchToolContent = defineType({
  name: "searchToolContent",
  title: "搜索工具内容 / Search Tool Content",
  type: "document",
  groups: [
    { name: "basics", title: "基本设置", default: true },
    { name: "intro", title: "工具介绍" },
    { name: "method", title: "方法说明" },
  ],
  fields: [
    defineField({
      name: "locale",
      title: "语言 / Locale",
      type: "string",
      group: "basics",
      options: { list: [...ACTIVE_SANITY_LOCALE_OPTIONS], layout: "radio" },
      validation: (rule) => rule.required(),
      description: "当前仅开放简体中文；每个 locale 只维护一份工具内容文档。",
    }),
    defineField({
      name: "eyebrow",
      title: "工具眉题",
      type: "string",
      group: "intro",
      validation: (rule) => rule.required(),
      description: "显示在工具 H1 上方；只表达任务定位，不承诺数据规模或效果。",
    }),
    defineField({ name: "introTitle", title: "工具 H1", type: "string", group: "intro", validation: (rule) => rule.required() }),
    defineField({
      name: "introDescription",
      title: "工具说明",
      type: "text",
      rows: 3,
      group: "intro",
      validation: (rule) => rule.required(),
      description: "说明 ASIN 与关键词输入会触发的研究视图；不填写未经接入验证的功能或数据主张。",
    }),
    defineField({ name: "methodTitle", title: "方法说明标题", type: "string", group: "method", validation: (rule) => rule.required() }),
    defineField({
      name: "methodPoints",
      title: "三个方法要点",
      type: "array",
      group: "method",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "标题", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "body", title: "说明", type: "text", rows: 2, validation: (rule) => rule.required() }),
          ],
        }),
      ],
      validation: (rule) => rule.required().length(3),
      description: "固定三条，解释输入、结果和当前数据边界；不做广告化堆砌。",
    }),
  ],
  preview: {
    select: { title: "locale", subtitle: "introTitle" },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: `搜索工具 — ${title ?? "未设置 locale"}`, subtitle: subtitle ?? "（尚未填写工具 H1）" };
    },
  },
});
