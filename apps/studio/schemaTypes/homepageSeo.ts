import { defineField, defineType } from "sanity";

export const homepageSeo = defineType({
  name: "homepageSeo",
  title: "首页 SEO 配置 / Homepage SEO",
  type: "document",
  fields: [
    defineField({
      name: "locale",
      title: "语言 / Locale",
      type: "string",
      options: { list: ["en", "zh-cn"], layout: "radio" },
      validation: (rule) => rule.required(),
      description: "每个 locale 只能有一份文档",
    }),
    defineField({
      name: "seo",
      title: "SEO 配置",
      type: "seo",
    }),
    defineField({
      name: "heroHeading",
      title: "Hero 主标题覆盖（选填）",
      type: "string",
      description: "留空则使用代码内默认文案。此字段改动立即影响页面 H1，改前请确认 A/B 测试结论",
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero 副标题覆盖（选填）",
      type: "string",
      description: "留空则使用代码内默认文案。注意：SEO description 应单独在上方 SEO 配置填写，不从此字段派生",
    }),
  ],
  preview: {
    select: {
      title: "locale",
      subtitle: "seo.title",
    },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return {
        title: `首页 SEO — ${title ?? "未设置 locale"}`,
        subtitle: subtitle ?? "（title 尚未填写）",
      };
    },
  },
});
