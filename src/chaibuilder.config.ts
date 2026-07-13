import 'server-only'
import '@/chai-context'
import config from '@payload-config'
import { createLibsqlDB } from 'chaipro/db/libsql'
import {
  asChaiBuilderGlobalProvider,
  buildChaiBuilderConfig,
} from 'chaipro/payload'
import type { ResolvedChaiBuilderServerConfig } from 'chaipro/types'

import { Blog } from '@/collections/Blog'
import { Legal } from '@/collections/Legal'
import { Testimonials } from './collections/Testimonials'
import { Faqs } from './collections/Faqs'

const chaiConfig: Readonly<ResolvedChaiBuilderServerConfig> = buildChaiBuilderConfig({
  payloadConfig: config,
  db: createLibsqlDB({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  }),
  debugLevel: process.env.NODE_ENV === 'development' ? 1 : 0,
  ai: {
    credits: { enabled: false },
  },
  globalDataProvider: asChaiBuilderGlobalProvider({ slug: 'site-config' }),
  pageTypes: [
    {
      collection: Blog,
      helpText: 'A blog post page',
      dynamicSegments: '/[a-zA-Z0-9-]+',
      dataProviderDepth: 2,
    },
    {
      collection: Legal,
      helpText: 'A legal page',
      dynamicSegments: '/[a-zA-Z0-9-]+',
      dataProviderDepth: 2,
    },
  ],
  collections: [Blog, Legal, Testimonials, Faqs]
})

export default chaiConfig
