import type { CollectionConfig } from 'payload'
import { defaultRichTextValue } from '@payloadcms/richtext-lexical'
import { contentAccess } from '@/access/authenticated'
import { sanitizeRichTextField } from '../fields/richTextFieldHooks'
import { richTextEditor } from '../fields/richTextEditor'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    useAsTitle: 'question',
    group: 'Collections',
  },
  versions: { drafts: true },
  access: contentAccess,
  fields: [
    { name: 'question', type: 'text', required: true, localized: true },
    {
      name: 'answer',
      type: 'richText',
      localized: true,
      editor: richTextEditor,
      defaultValue: defaultRichTextValue,
      hooks: {
        afterRead: [sanitizeRichTextField],
        beforeChange: [sanitizeRichTextField],
      },
    },
  ],
}
