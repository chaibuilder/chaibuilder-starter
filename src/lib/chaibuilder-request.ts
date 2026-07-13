import { draftMode } from 'next/headers'
import 'server-only'
import type { ChaiRequestContext } from 'chaipro/types'

export async function resolveChaiContext(
  overrides?: Partial<ChaiRequestContext>,
): Promise<ChaiRequestContext> {
  const { isEnabled } = await draftMode()

  return {
    appId: process.env.CHAIBUILDER_APP_KEY!,
    siteUrl: process.env.SITE_URL ?? null,
    draft: isEnabled,
    lang: 'en',
    ...overrides,
  }
}
