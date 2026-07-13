import { describe, it, expect } from 'vitest'
import { mapPayloadMediaToDamAsset, appendCacheBust, type PayloadMediaLike } from '~/payload'

describe('Payload Asset Mapper', () => {
  it('appends cache bust tag correctly', () => {
    const url = '/api/media/file/image.webp'
    const updatedAt = '2026-06-22T05:00:00.000Z'
    const expectedTime = new Date(updatedAt).getTime()
    const result = appendCacheBust(url, updatedAt)
    expect(result).toBe(`${url}?t=${expectedTime}`)
  })

  it('appends cache bust with & when url already has query params', () => {
    const url = '/api/media/file/image.webp?prefix=opaque-uuid%2F'
    const updatedAt = '2026-06-22T05:00:00.000Z'
    const expectedTime = new Date(updatedAt).getTime()
    const result = appendCacheBust(url, updatedAt)
    expect(result).toBe(`${url}&t=${expectedTime}`)
  })

  it('maps a full Media doc correctly', () => {
    const mockDoc: PayloadMediaLike = {
      id: 123,
      app: 'test-app',
      alt: 'Test Alt Text',
      updatedAt: '2026-06-22T05:00:00.000Z',
      createdAt: '2026-06-22T04:00:00.000Z',
      url: '/api/media/file/test.png',
      thumbnailURL: '/api/media/file/test-thumbnail.png',
      filename: 'test.png',
      mimeType: 'image/png',
      filesize: 1024,
      width: 800,
      height: 600,
    }

    const asset = mapPayloadMediaToDamAsset(mockDoc)
    const expectedTime = new Date(mockDoc.updatedAt).getTime()

    expect(asset.id).toBe('123')
    expect(asset.name).toBe('test.png')
    expect(asset.url).toBe(`/api/media/file/test.png?t=${expectedTime}`)
    expect(asset.thumbnailUrl).toBe(`/api/media/file/test-thumbnail.png?t=${expectedTime}`)
    expect(asset.type).toBe('image')
    expect(asset.size).toBe(1024)
    expect(asset.width).toBe(800)
    expect(asset.height).toBe(600)
    expect(asset.format).toBe('png')
    expect(asset.description).toEqual({ en: 'Test Alt Text' })
    expect(asset.createdAt).toBe(mockDoc.createdAt)
    expect(asset.updatedAt).toBe(mockDoc.updatedAt)
  })

  it('handles custom description mapping and fallbacks', () => {
    const mockDoc: PayloadMediaLike = {
      id: 456,
      app: 'test-app',
      alt: 'Fall back alt',
      updatedAt: '2026-06-22T05:00:00.000Z',
      createdAt: '2026-06-22T04:00:00.000Z',
    }

    // Default mapping fallback to alt
    const asset1 = mapPayloadMediaToDamAsset(mockDoc)
    expect(asset1.description).toEqual({ en: 'Fall back alt' })

    // Explicit description override passed
    const customDesc = { en: 'Custom EN', es: 'Custom ES' }
    const asset2 = mapPayloadMediaToDamAsset(mockDoc, customDesc)
    expect(asset2.description).toEqual(customDesc)

    // Localized alt object from payload
    const mockDocLocalized = {
      ...mockDoc,
      alt: { en: 'Loc EN', es: 'Loc ES' } as any
    }
    const asset3 = mapPayloadMediaToDamAsset(mockDocLocalized)
    expect(asset3.description).toEqual({ en: 'Loc EN', es: 'Loc ES' })
  })

  it('maps file type non-image mime types correctly', () => {
    const mockDoc: PayloadMediaLike = {
      id: 789,
      app: 'test-app',
      alt: 'Document',
      updatedAt: '2026-06-22T05:00:00.000Z',
      createdAt: '2026-06-22T04:00:00.000Z',
      url: '/api/media/file/doc.pdf',
      filename: 'doc.pdf',
      mimeType: 'application/pdf',
      filesize: 2048,
    }

    const asset = mapPayloadMediaToDamAsset(mockDoc)
    expect(asset.type).toBe('file')
    expect(asset.format).toBe('pdf')
  })
})
