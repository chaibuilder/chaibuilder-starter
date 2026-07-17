/**
 * ChaiBuilder configuration — plain data, deliberately free of framework imports
 * (`next/headers` and friends) so scripts, CI, and the Payload CLI can import it.
 * Per-request concerns — auth, tenancy, draft, site URL — live in `chaibuilder.server.ts`.
 */
import config from '@payload-config'
import { createLibsqlDB } from 'chaipro/db/libsql'
import { asChaiBuilderGlobalProvider, buildChaiBuilderConfig } from 'chaipro/payload'
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
    models: [
      {
        id: 'zai/glm-5.2',
        name: 'GLM 5.2',
        provider: 'zai',
        multiplier: 3,
        description: '3x Credits',
        // text-only model — it cannot read images/files
        allowedFileTypes: [],
      },
      {
        id: 'google/gemini-3.5-flash',
        name: 'Gemini 3.5 Flash',
        provider: 'google',
        multiplier: 3,
        description: '3x Credits',
      },
      {
        id: 'google/gemini-3-flash',
        name: 'Gemini 3 Flash',
        provider: 'google',
        multiplier: 1,
        description: '1x Credits',
      },
    ],
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
  features: {
    redirects: true,
    revisions: { enabled: true, drafts: true },
    animation: true,
    dragAndDrop:true,
    ai: true,
    trash:true
  },
  collections: [Blog, Legal, Testimonials, Faqs],
})

export default chaiConfig
