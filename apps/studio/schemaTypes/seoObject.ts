import { defineField, defineType } from "sanity";

export const seoObject = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "页面标题 / Page Title",
      type: "string",
      description: "50–60 字符最佳；不得重复拼接品牌名（AsinSeed 只能出现一次）",
    }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "硬性下限 120 字符，目标 150–160 字符；禁止堆砌关键词",
      validation: (rule) =>
        rule.custom((val: string | undefined) => {
          if (!val) return true;
          return val.length >= 120
            ? true
            : `Meta description 当前 ${val.length} 字符，不足 120（P4 验收器将判 FAIL）`;
        }),
    }),
    defineField({
      name: "ogImage",
      title: "OG Image (1200×630)",
      type: "image",
      description: "Open Graph 分享图，1200×630 px，建议 <300 KB",
      options: { hotspot: true },
    }),
    defineField({
      name: "canonicalOverride",
      title: "Canonical Override（受限，非特殊情况留空）",
      type: "url",
      description: "留空则由前端自动生成。仅在跨域合并、临时重定向等特殊场景由技术人员填写",
    }),
  ],
});
