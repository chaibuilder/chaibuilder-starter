import type { CollectionConfig } from 'payload'
import { staff } from '@/access/authenticated'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: { singular: 'Form Submission', plural: 'Form Submissions' },
  admin: {
    useAsTitle: 'formName',
    group: 'Site',
    defaultColumns: ['formName', 'pageUrl', 'createdAt'],
    description: 'Submissions from ChaiBuilder forms on the live site.',
  },
  access: {
    create: () => false,
    read: staff,
    update: staff,
    delete: staff,
  },
  fields: [
    {
      name: 'formName',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'pageUrl',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'formData',
      type: 'json',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'additionalData',
      type: 'json',
      admin: { readOnly: true },
    },
  ],
}
