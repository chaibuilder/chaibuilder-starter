import type { CollectionConfig } from 'payload'
import { defaultRichTextValue } from '@payloadcms/richtext-lexical'
import { staffContentAccess } from '@/access/authenticated'
import { slugField } from '../fields/slugField'
import { sanitizeRichTextField } from '../fields/richTextFieldHooks'
import { richTextEditor } from '../fields/richTextEditor'

export const Legal: CollectionConfig = {
  slug: 'legal',
  labels: {
    singular: 'Legal Page',
    plural: 'Legal Pages',
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Collections',
  },
  versions: { drafts: true },
  access: staffContentAccess,
  fields: [
    slugField({
      localized: true,
    }),
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'content',
              type: 'richText',
              localized: true,
              editor: richTextEditor,
              defaultValue: defaultRichTextValue,
              hooks: {
                afterRead: [sanitizeRichTextField],
                beforeChange: [sanitizeRichTextField],
              },
              label: false,
              required: true,
            },
          ],
          label: 'Content',
        },
      ],
    },
  ],
  // Publish revalidation hooks are attached by chaiBuilderPlugin (payload.config.ts).
}
