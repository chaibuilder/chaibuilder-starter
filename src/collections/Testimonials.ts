import type { CollectionConfig } from 'payload'
import { contentAccess } from '@/access/authenticated'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  admin: {
    useAsTitle: 'name',
    group: 'Collections',
  },
  versions: { drafts: true },
  access: contentAccess,
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'designation', type: 'text', localized: true },
    { name: 'company', type: 'text', localized: true },
    { name: 'message', type: 'textarea', required: true, localized: true },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'rating', type: 'number', min: 1, max: 5 },
    { name: 'socialLink', type: 'text' },
  ],
}
