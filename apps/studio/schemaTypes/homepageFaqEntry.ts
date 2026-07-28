import { defineField, defineType } from "sanity";
import { ACTIVE_SANITY_LOCALE_OPTIONS } from "@new-asinseed/contracts";

export const homepageFaqEntry = defineType({
  name: "homepageFaqEntry",
  title: "Homepage FAQ Entry",
  type: "document",
  fields: [
    defineField({
      name: "locale",
      type: "string",
      options: { list: [...ACTIVE_SANITY_LOCALE_OPTIONS] },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "question", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "answer", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "order", type: "number" }),
  ],
});
