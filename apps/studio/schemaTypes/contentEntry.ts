import { defineField, defineType } from "sanity";

export const contentEntry = defineType({
  name: "contentEntry",
  title: "Content Entry",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "viewCount", type: "number" }),
    defineField({ name: "author", type: "string" }),
    defineField({ name: "sourceCitations", type: "array", of: [{ type: "url" }] }),
    defineField({ name: "methodology", type: "text" }),
    defineField({
      name: "generatedBy",
      type: "string",
      options: { list: ["agent", "manual"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "workflowState",
      type: "string",
      options: { list: ["draft", "in_review", "approved"] },
      initialValue: "draft",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO 配置",
      type: "seo",
    }),
    defineField({
      name: "noindex",
      title: "noindex（阻止搜索引擎收录）",
      type: "boolean",
      initialValue: false,
      description: "仅在明确不希望该文章被收录时勾选。默认 false（允许收录）",
    }),
  ],
});
