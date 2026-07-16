import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { chaiBuilderSchemaHook } from './chai-db'
import { chaiBuilderPlugin } from 'chaipro/payload'
import { Blog } from './collections/Blog'
import { Legal } from './collections/Legal'
import { BlogCategories } from './collections/BlogCategories'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Faqs } from './collections/Faqs'
import { Testimonials } from './collections/Testimonials'
import { SiteConfig } from './collections/SiteConfig'
import { FormSubmissions } from './collections/FormSubmissions'
import { seoPlugin } from '@payloadcms/plugin-seo'

import { getAdminRoute } from '@/utilities/adminRoute'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  routes: {
    admin: getAdminRoute(),
  },
  localization: {
    defaultLocale: 'en',
    locales: ['en'],
    fallback: true,
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- ChaiBuilder',
      description: 'ChaiBuilder CMS',
      icons: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/favicon.svg',
        },
      ],
      openGraph: {
        title: 'ChaiBuilder',
        siteName: 'ChaiBuilder',
        images: [
          {
            url: '/favicon.svg',
            width: 48,
            height: 48,
          },
        ],
      },
    },
    components: {
      providers: ['chaipro/payload/client#IframeBridge'],
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Icon#Icon',
      },
      views: {
        login: {
          Component: '@/components/CustomLoginView#CustomLoginView',
        },
      },
    },
    theme: 'dark',
  },
  collections: [
    Users,
    Blog,
    BlogCategories,
    Legal,
    Faqs,
    Testimonials,
    Media,
    SiteConfig,
    FormSubmissions,
  ],
  globals: [],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL!,
      authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
    },
    push: process.env.PAYLOAD_DB_PUSH === 'true',
    beforeSchemaInit: [chaiBuilderSchemaHook],
    idType: 'uuid',
    transactionOptions: {},
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['blog', 'legal', 'site-config'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => doc?.title || doc?.name || '',
      generateDescription: ({ doc }) => doc?.excerpt || doc?.tagline || doc?.title || '',
      tabbedUI: true,
    }),
    chaiBuilderPlugin({
      menus: true,
      revalidateCollections: ['blog', 'legal'],
      appCollections: [
        'blog',
        'blog-categories',
        'legal',
        'faqs',
        'testimonials',
        'media',
        'site-config',
        'form-submissions',
      ],
    }),
  ],
})
