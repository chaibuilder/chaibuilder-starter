import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { CollectionConfig, Config } from 'payload'
import { chaiBuilderPlugin } from '../../src/pro/src/payload/plugin'
import { injectAppFilterOptions } from '../../src/pro/src/payload/app-filter-options'

const APP = 'app-123'

function baseConfig(collections: CollectionConfig[]): Config {
  return { collections } as unknown as Config
}

function media(): CollectionConfig {
  return { slug: 'media', fields: [{ name: 'alt', type: 'text' }], upload: true }
}

function blog(): CollectionConfig {
  return {
    slug: 'blog',
    // Mirrors host usage: role-only access; the plugin AND-s the app scope.
    access: { read: () => true, create: () => true, update: () => true, delete: () => true },
    fields: [
      { name: 'title', type: 'text' },
      { name: 'heroImage', type: 'upload', relationTo: 'media' },
      { name: 'authors', type: 'relationship', relationTo: 'users', hasMany: true },
    ],
  }
}

function fieldNames(fields: CollectionConfig['fields']): string[] {
  return (fields ?? []).flatMap((f) => ('name' in f && f.name ? [f.name] : []))
}

function findCollection(config: Config, slug: string): CollectionConfig {
  const c = (config.collections ?? []).find((col) => col.slug === slug)
  if (!c) throw new Error(`missing ${slug}`)
  return c
}

describe('chaiBuilderPlugin', () => {
  const env = process.env
  beforeEach(() => {
    process.env = { ...env, CHAIBUILDER_APP_KEY: APP }
  })
  afterEach(() => {
    process.env = env
  })

  it('injects the app field on appCollections', async () => {
    const plugin = chaiBuilderPlugin({ appCollections: ['blog'] })
    const out = plugin(baseConfig([media(), blog()]))
    const blogOut = findCollection(out, 'blog')
    expect(fieldNames(blogOut.fields)).toContain('app')
  })

  it('wraps access + injects filterOptions on appCollections', async () => {
    const plugin = chaiBuilderPlugin({ appCollections: ['blog', 'media'] })
    const out = plugin(baseConfig([media(), blog()]))
    const blogOut = findCollection(out, 'blog')

    expect(blogOut.access?.read).toBeTypeOf('function')

    // staff read → AND-ed app constraint
    const read = await blogOut.access!.read!({ req: { user: { id: 'u1' } } } as any)
    expect(read).toMatchObject({ app: { equals: APP } })

    // heroImage (→ media, an app collection) gets a filterOptions function
    const heroImage = (blogOut.fields ?? []).find(
      (f) => 'name' in f && f.name === 'heroImage',
    ) as any
    expect(heroImage.filterOptions).toBeTypeOf('function')
    const heroConstraint = await heroImage.filterOptions({ relationTo: 'media', req: {} })
    expect(heroConstraint).toMatchObject({ app: { equals: APP } })

    // authors (→ users, NOT an app collection) stays unfiltered
    const authors = (blogOut.fields ?? []).find(
      (f) => 'name' in f && f.name === 'authors',
    ) as any
    expect(authors.filterOptions).toBeUndefined()
  })

  it('always registers the menus collection with the app field', () => {
    const plugin = chaiBuilderPlugin({})
    const out = plugin(baseConfig([media()]))
    const menus = findCollection(out, 'menus')
    expect(fieldNames(menus.fields)).toContain('app')
  })

  it('throws when the media collection is absent', () => {
    const plugin = chaiBuilderPlugin({})
    expect(() => plugin(baseConfig([blog()]))).toThrow(/media collection/)
  })

  it('throws when an appCollections slug is missing', () => {
    const plugin = chaiBuilderPlugin({ appCollections: ['ghost'] })
    expect(() => plugin(baseConfig([media()]))).toThrow(/ghost/)
  })
})

describe('injectAppFilterOptions', () => {
  const appSlugs = new Set(['media', 'blog'])

  it('preserves and AND-composes an existing filterOptions Where', async () => {
    const existing = { published: { equals: true } }
    const collection: CollectionConfig = {
      slug: 'x',
      fields: [{ name: 'img', type: 'upload', relationTo: 'media', filterOptions: existing } as any],
    }
    const out = injectAppFilterOptions(collection, { appField: 'app', appSlugs })
    const img = (out.fields ?? [])[0] as any
    const result = await img.filterOptions({ relationTo: 'media', req: {} })
    expect(result).toEqual({ and: [{ app: { equals: APP } }, existing] })
  })

  it('walks nested tabs/rows/blocks', () => {
    const collection: CollectionConfig = {
      slug: 'x',
      fields: [
        {
          type: 'tabs',
          tabs: [
            { label: 'T', fields: [{ name: 'logo', type: 'upload', relationTo: 'media' } as any] },
          ],
        },
      ],
    }
    const out = injectAppFilterOptions(collection, { appField: 'app', appSlugs })
    const tab = (out.fields ?? [])[0] as any
    const logo = tab.tabs[0].fields[0]
    expect(logo.filterOptions).toBeTypeOf('function')
  })
})

// resolveAppId reads env at call time; the module reads CHAIBUILDER_APP_KEY via
// defaultGetAppId, set in beforeEach above and the constant here.
process.env.CHAIBUILDER_APP_KEY = APP
