// @vitest-environment node
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { chaiBuilderAssets, configureChaiPayload } from '~/payload'
import type { User } from '../../src/payload-types'

let payload: Payload
let testUser: User
const testAppId = 'test-app-id'

describe('PayloadAssets Integration', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    configureChaiPayload({
      config: payloadConfig,
      getAppId: () => testAppId,
    })

    // Create a user for access control and Local API user mapping
    const email = `test-user-${Date.now()}@example.com`
    testUser = await payload.create({
      collection: 'users',
      data: {
        email,
        password: 'password123',
      },
    }) as User
  })

  afterAll(async () => {
    // Cleanup user
    if (testUser) {
      await payload.delete({
        collection: 'users',
        id: testUser.id,
      })
    }
  })

  it('performs full lifecycle of asset management', async () => {
    const payloadAssets = chaiBuilderAssets(testAppId, String(testUser.id))

    // Base64 WebP image data url fixture (a 1x1 white webp pixel)
    const base64File = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
    const name = 'pixel.webp'
    const description = { en: 'A pixel', es: 'Un pixel' }

    // 1. Create asset
    const created = await payloadAssets.create({
      name,
      file: base64File,
      description,
    })

    expect(created).toBeDefined()
    expect(created.name).toContain('pixel')
    expect(created.type).toBe('image')
    expect(created.description).toEqual(description)

    // 2. Fetch by ID
    const fetched = await payloadAssets.getById(created.id)
    expect(fetched.id).toBe(created.id)
    expect(fetched.name).toContain('pixel')

    // 3. List assets (should find the one we created)
    const listResult = await payloadAssets.list({ page: 1, limit: 10 })
    expect(listResult.assets.length).toBeGreaterThanOrEqual(1)
    const foundInList = listResult.assets.find(a => a.id === created.id)
    expect(foundInList).toBeDefined()
    expect(foundInList?.name).toContain('pixel')

    // 4. Update asset description
    const updatedDescription = { en: 'Updated pixel', es: 'Pixel actualizado' }
    const updated = await payloadAssets.update({
      id: created.id,
      description: updatedDescription,
    })
    expect(updated.description).toEqual(updatedDescription)

    // 5. Soft delete (move to trash)
    await payloadAssets.softDelete(created.id)
    
    // getById should now throw or fail (because it checks deletedAt)
    await expect(payloadAssets.getById(created.id)).rejects.toThrow()

    // list should exclude it
    const listAfterDelete = await payloadAssets.list({ page: 1, limit: 10 })
    const foundAfterDelete = listAfterDelete.assets.find(a => a.id === created.id)
    expect(foundAfterDelete).toBeUndefined()

    // 6. Restore asset
    await payloadAssets.restore(created.id)
    const restored = await payloadAssets.getById(created.id)
    expect(restored.id).toBe(created.id)

    // 7. Delete permanently
    await payloadAssets.deletePermanently(created.id)
    await expect(payloadAssets.getById(created.id)).rejects.toThrow()
  })
})
