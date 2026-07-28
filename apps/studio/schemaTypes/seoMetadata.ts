import { defineField, defineType } from "sanity";

export const seoMetadata = defineType({
  name: "seoMetadata",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Meta Title",
      type: "string",
      validation: (rule) =>
        rule
          .min(35)
          .max(70)
          .warning("目标区间约 50-60 字符；品牌名只应出现一次，过短/过长会被 P4 验收标记"),
    }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.min(120).warning("低于 120 字符会被 P4 验收判 FAIL；目标区间约 150-160 字符"),
    }),
    defineField({
      name: "ogImage",
      title: "OG Image (1200x630)",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "canonicalOverride",
      title: "Canonical Override",
      type: "url",
      description: "留空则使用该页面的默认 canonical；仅在需要指向其他 URL 时填写",
    }),
    defineField({
      name: "noindex",
      title: "No-index",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
