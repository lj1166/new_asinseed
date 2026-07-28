import { defineField, defineType } from "sanity";
import { ACTIVE_SANITY_LOCALE_OPTIONS } from "@new-asinseed/contracts";

const HOMEPAGE_SEO_LOCALE_OPTIONS = [
  ...ACTIVE_SANITY_LOCALE_OPTIONS,
  { title: "English（未启用，仅保留历史文档）", value: "en" },
];

export const homepageSeo = defineType({
  name: "homepageSeo",
  title: "首页 SEO 配置 / Homepage SEO",
  type: "document",
  fields: [
    defineField({
      name: "locale",
      title: "语言 / Locale",
      type: "string",
      options: { list: HOMEPAGE_SEO_LOCALE_OPTIONS, layout: "radio" },
      validation: (rule) =>
        rule.required().custom((value, context) => {
          if (value !== "en" || context.document?._id === "homepageSeo-en") return true;
          return "英文尚未启用；当前只允许保留既有 homepageSeo-en 历史文档。";
        }),
      description: "当前仅开放简体中文；English 仅用于保留已存在的历史文档，不产生路由、导航、sitemap 或 hreflang。",
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
