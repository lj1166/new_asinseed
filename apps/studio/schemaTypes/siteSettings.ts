import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "网站全局设置 / Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteUrl",
      title: "网站 URL（含协议，无末尾斜杠）",
      type: "url",
      description: "例：https://asinseed.com",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brandName",
      title: "品牌名称",
      type: "string",
      description: "用于 JSON-LD Organization.name 与 og:site_name",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sameAs",
      title: "sameAs（官方社交/外部身份 URL）",
      type: "array",
      of: [{ type: "url" }],
      description: "JSON-LD Organization.sameAs；填写可验证的官方账号页面 URL，不得编造",
    }),
    defineField({
      name: "defaultSeo",
      title: "全站默认 SEO 兜底",
      type: "seo",
      description: "当具体页面的 SEO 字段未填写时使用。不建议让 description 兜底（各页描述应独立）",
    }),
  ],
  preview: {
    select: { title: "brandName", subtitle: "siteUrl" },
  },
});
