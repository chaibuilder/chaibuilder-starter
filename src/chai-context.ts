import payloadConfig from '@payload-config'
import { cookies, draftMode, headers } from 'next/headers'
import { getPayload } from 'payload'
import {
  setChaiContextResolver,
  type ChaiContextResolver,
  type ChaiIncomingRequest,
} from 'chaipro/nextjs/server'
import { createPayloadUserResolver } from 'chaipro/payload'

const appId = () => process.env.CHAIBUILDER_APP_KEY ?? ''

const { userIdFromToken, userIdFromRequest, cookieName } = createPayloadUserResolver({
  getPayload: () => getPayload({ config: payloadConfig }),
})

/** Absolute origin from Host header — no SITE_URL env. */
function siteUrlFromHost(host: string | null | undefined): string | null {
  const value = host?.split(',')[0]?.trim()
  return value ? `https://${value}` : null
}

async function resolveSiteUrl(request?: ChaiIncomingRequest): Promise<string | null> {
  if (request) {
    const fromHost = siteUrlFromHost(request.headers.get('host'))
    if (fromHost) return fromHost
    try {
      return new URL(request.url).origin
    } catch {
      return null
    }
  }
  return siteUrlFromHost((await headers()).get('host'))
}

/** Server Components and Server Actions: identity from Payload auth cookies. */
async function userIdFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  return userIdFromToken(cookieStore.get(cookieName)?.value)
}

/**
 * Single, process-wide ChaiBuilder context resolver. Owns all Next.js + Payload
 * coupling so `chaibuilder.config.ts` stays environment-agnostic.
 */
export const chaiContextResolver: ChaiContextResolver = async ({ request }) => {
  // draftMode()/cookies()/headers() throw outside a Next.js request scope
  // (e.g. CLI seeding, scripts). Degrade to a static, request-free context there.
  try {
    const { isEnabled } = await draftMode()
    const [userId, siteUrl] = await Promise.all([
      request ? userIdFromRequest(request) : userIdFromCookies(),
      resolveSiteUrl(request),
    ])

    return {
      appId: appId(),
      siteUrl,
      draft: isEnabled,
      userId,
    }
  } catch {
    return { appId: appId(), siteUrl: null, draft: false, userId: null }
  }
}

setChaiContextResolver(chaiContextResolver)
