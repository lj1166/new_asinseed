import { defineField, defineType } from "sanity";

export const keywordEntry = defineType({
  name: "keywordEntry",
  title: "Keyword Entry",
  type: "document",
  fields: [
    defineField({ name: "keyword", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "searchIntent", type: "string" }),
    defineField({ name: "priority", type: "number" }),
    defineField({ name: "status", type: "string" }),
    defineField({
      name: "relatedArticles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "contentEntry" }] }],
    }),
  ],
});
