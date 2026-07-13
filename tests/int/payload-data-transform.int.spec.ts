import { describe, expect, it } from 'vitest'
import { sanitizePayloadData } from '~/payload'

describe('sanitizePayloadData', () => {
  it('strips underscore-prefixed keys', async () => {
    const result = await sanitizePayloadData({
      title: 'Hello',
      _status: 'published',
      _version: 1,
    })

    expect(result).toEqual({ title: 'Hello' })
  })

  it('renames meta to seo', async () => {
    const result = await sanitizePayloadData({
      title: 'Blog',
      meta: {
        title: 'SEO title',
        description: 'SEO description',
      },
    })

    expect(result).toEqual({
      title: 'Blog',
      seo: {
        title: 'SEO title',
        description: 'SEO description',
      },
    })
  })

  it('returns only allowed media fields', async () => {
    const updatedAt = '2026-01-01T00:00:00.000Z'
    const result = await sanitizePayloadData({
      heroImage: {
        id: 'media-1',
        app: 'app-1',
        alt: 'Hero',
        url: '/api/media/file/hero.png',
        thumbnailURL: '/api/media/file/hero-thumb.png',
        width: 1200,
        height: 800,
        filename: 'hero.png',
        mimeType: 'image/png',
        filesize: 12345,
        updatedAt,
        createdAt: updatedAt,
        deletedAt: null,
      },
    })

    expect(result).toEqual({
      heroImage: {
        id: 'media-1',
        alt: 'Hero',
        url: `/api/media/file/hero.png?t=${new Date(updatedAt).getTime()}`,
        thumbnailUrl: `/api/media/file/hero-thumb.png?t=${new Date(updatedAt).getTime()}`,
        width: 1200,
        height: 800,
      },
    })
  })
})
