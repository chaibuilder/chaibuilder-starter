import config from '@/chaibuilder.config'
// Side-effect import: registers the Next.js framework adapter (unstable_cache,
// revalidatePath, revalidateTag). Without it the adapter stays a noop and
// publish-time cache revalidation silently does nothing in production builds.
import 'chaipro/nextjs/server'
import { createPayloadChaiBuilder } from 'chaipro/payload'

/**
 * The ChaiBuilder server handle for this app. Every server entry point imports `getChaiBuilder`
 * from here; creating the handle is what registers the request context, so there is no
 * separate registration step to forget.
 *
 * Everything the context needs comes from Payload: identity from the auth cookie or
 * `Authorization` header, tenant from `CHAIBUILDER_APP_KEY`, draft state, and the site origin.
 * What a user may do comes from their `app_users` membership — a Payload login by itself grants
 * no builder access.
 */
export const { getChaiBuilder } = createPayloadChaiBuilder(config)
