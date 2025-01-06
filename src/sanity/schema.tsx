import { type SchemaTypeDefinition } from "sanity";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    {
      name: "blog",
      type: "document",
      title: "Blog",

      fields: [
        {
          name: "title",
          type: "string",
          title: "Title",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "subtitle",
          type: "string",
          title: "Subtitle",
        },
        {
          name: "slug",
          type: "slug",
          title: "Slug",
          options: {
            source: "title",
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: "image",
          type: "image",
          title: "Image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
          validation: (Rule) => Rule.required(),
        },
        {
          name: "content",
          type: "array",
          title: "Content",

          of: [
            {
              type: "block",
              marks: {
                annotations: [
                  {
                    name: "link",
                    type: "object",
                    title: "Link",
                    fields: [
                      {
                        name: "href",
                        type: "url",
                        title: "URL",
                      },
                    ],
                  },
                ],
              },
            },
            {
              name: "Image",
              type: "image",
              title: "Image",
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: "caption",
                  type: "string",
                  title: "Caption",
                },
              ],
            },
          ],
        },
        {
          name: "author",
          type: "string",
          title: "Author",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "publishDate",
          type: "datetime",
          title: "Publish Date",
          options: {
            default: new Date().toISOString(),
          },
        },
      ],
    },
  ],
};
