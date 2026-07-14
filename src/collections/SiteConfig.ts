import { revalidateTag } from 'next/cache'
import { staff, staffOrPublished } from '@/access/authenticated'
import { createAppScopedSingletonCreate } from 'chaipro/payload'
import type { CollectionConfig } from 'payload'

export const SiteConfig: CollectionConfig = {
  slug: 'site-config',
  labels: {
    singular: 'Config',
    plural: 'Config',
  },
  admin: {
    group: 'Site',
    description:
      'This is site config data available on all pages. To be used with data binding.',
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  disableDuplicate: true,
  // One config row per app. Plugin AND-s app scope on read/update/delete.
  access: {
    create: createAppScopedSingletonCreate('site-config', { roleAccess: staff }),
    read: staffOrPublished,
    update: staff,
    delete: staff,
  },
  hooks: {
    // The `app` field (injected by chaiBuilderPlugin) stamps the app id; use it
    // here instead of re-resolving.
    afterChange: [
      async ({ doc }) => {
        if (!doc?._status || doc?._status === 'published') {
          // Only bust the per-app cache tag — the unscoped `global:site-config`
          // tag would invalidate every tenant's cached global data.
          if (doc?.app) revalidateTag(`global:site-config:${doc.app}`, 'max')
        }
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'tagline',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Business',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'contactEmail',
                  type: 'text',
                },
                {
                  name: 'contactPhone',
                  type: 'text',
                },
              ],
            },
            {
              name: 'physicalAddress',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'addressLine1',
                      type: 'text',
                      localized: true,
                    },
                    {
                      name: 'addressLine2',
                      type: 'text',
                      localized: true,
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'city',
                      type: 'text',
                      localized: true,
                    },
                    {
                      name: 'state',
                      type: 'text',
                      localized: true,
                    },
                    {
                      name: 'zip',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'location',
                  type: 'point',
                },
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Legal & Compliance',
          fields: [
            {
              name: 'privacyPolicyPage',
              type: 'text',
              localized: true,
            },
            {
              name: 'termsOfServicesPage',
              type: 'text',
              localized: true,
            },
          ],
        },
        {
          label: 'Custom HTML',
          fields: [
            {
              name: 'headHTML',
              type: 'textarea',
              label: 'Header',
              admin: {
                description:
                  'Custom HTML injected into the page <head> (meta tags, scripts, etc.).',
              },
            },
            {
              name: 'footerHTML',
              type: 'textarea',
              label: 'Footer',
              admin: {
                description: 'Custom HTML injected before the closing </body> tag.',
              },
            },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            {
              name: 'googleTagManagerId',
              type: 'text',
              label: 'Google Tag Manager ID',
              admin: {
                placeholder: 'GTM-XXXXXXX',
              },
            },
            {
              name: 'googleAnalyticsId',
              type: 'text',
              label: 'Google Analytics ID',
              admin: {
                placeholder: 'G-XXXXXXXXXX',
              },
            },
            {
              name: 'metaPixelId',
              type: 'text',
              label: 'Facebook Pixel ID',
            },
            {
              name: 'clarityProjectId',
              type: 'text',
              label: 'Microsoft Clarity Project ID',
              admin: {
                placeholder: 'XXXXXXXXXX',
              },
            },
          ],
        },
      ],
    },
  ],
}
