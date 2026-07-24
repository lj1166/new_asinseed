import { defineField, defineType } from "sanity";

export const homepageFaqEntry = defineType({
  name: "homepageFaqEntry",
  title: "Homepage FAQ Entry",
  type: "document",
  fields: [
    defineField({
      name: "locale",
      type: "string",
      options: { list: ["en", "zh-cn"] },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "question", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "answer", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "order", type: "number" }),
  ],
});
