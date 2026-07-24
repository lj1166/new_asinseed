import { defineField, defineType } from "sanity";

export const homepageTestimonialEntry = defineType({
  name: "homepageTestimonialEntry",
  title: "Homepage Testimonial Entry",
  type: "document",
  fields: [
    defineField({
      name: "locale",
      type: "string",
      options: { list: ["en", "zh-cn"] },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "quoteText", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "authorName", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "authorTitle", type: "string" }),
    defineField({ name: "avatar", type: "image" }),
    defineField({ name: "order", type: "number" }),
  ],
});
