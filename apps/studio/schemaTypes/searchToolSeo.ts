import { ACTIVE_SANITY_LOCALE_OPTIONS } from "@new-asinseed/contracts";
import { defineField, defineType } from "sanity";

export const searchToolSeo = defineType({
  name: "searchToolSeo",
  title: "搜索工具 SEO 配置 / Search Tool SEO",
  type: "document",
  fields: [
    defineField({
      name: "locale",
      title: "语言 / Locale",
      type: "string",
      options: { list: [...ACTIVE_SANITY_LOCALE_OPTIONS], layout: "radio" },
      validation: (rule) => rule.required(),
      description: "当前仅开放简体中文；配置仅作用于稳定、无 q 的工具入口。",
    }),
    defineField({ name: "seo", title: "SEO 配置", type: "seo" }),
  ],
  preview: {
    select: { title: "locale", subtitle: "seo.title" },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: `搜索工具 SEO — ${title ?? "未设置 locale"}`, subtitle: subtitle ?? "（title 尚未填写）" };
    },
  },
});
