import { describe, expect, it } from 'vitest'
import { registerProjectFonts } from '@/fonts'
import { getAllRegisteredFonts } from '~/registry'

describe('registerProjectFonts', () => {
  it('registers seven project fonts with woff2 src', () => {
    registerProjectFonts()
    const families = getAllRegisteredFonts().map((f) => f.family)
    for (const name of [
      'Inter',
      'Geist',
      'Roboto',
      'Open Sans',
      'Plus Jakarta Sans',
      'Montserrat',
      'DM Sans',
    ]) {
      expect(families).toContain(name)
    }
    const inter = getAllRegisteredFonts().find((f) => f.family === 'Inter')
    expect(inter && 'src' in inter && inter.src[0]?.format).toBe('woff2')
    expect(inter && 'src' in inter && inter.src[0]?.url).toMatch(/^\/fonts\//)
  })

  it('is idempotent', () => {
    const before = getAllRegisteredFonts().filter((f) => f.family === 'Inter').length
    registerProjectFonts()
    const after = getAllRegisteredFonts().filter((f) => f.family === 'Inter').length
    expect(after).toBe(before)
  })
})
