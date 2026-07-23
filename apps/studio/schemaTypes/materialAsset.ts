import { defineField, defineType } from "sanity";

export const materialAsset = defineType({
  name: "materialAsset",
  title: "Material Asset",
  type: "document",
  fields: [
    defineField({ name: "type", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "sourceUrl", type: "url" }),
    defineField({ name: "relatedKeywords", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "status", type: "string" }),
  ],
});
