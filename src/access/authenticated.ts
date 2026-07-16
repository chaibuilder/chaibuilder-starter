import type { Access, PayloadRequest } from 'payload'
import { and, eq } from 'drizzle-orm'
import { getChaiBuilder } from 'chaipro/nextjs/server'
import type { ChaiUserPermissionOverride } from 'chaipro/types'
import chaiConfig from '@chaibuilder-config'

/**
 * App-scoped roles live in the chaipro `app_users` table (one row per user per app),
 * NOT on the Payload `users` record. `users.role` only marks the global platform owner
 * (`super_admin`) vs everyone else (`none`); real per-app authority comes from
 * `app_users.role` for the current app (`CHAIBUILDER_APP_KEY`).
 */
export type AppRole = 'superadmin' | 'editor' | 'designer' | 'viewer' | 'user'

/** The current user's membership in the current app: role plus per-user permission overrides. */
export type AppUser = {
  role: AppRole
  permissions: ChaiUserPermissionOverride
}

/** Roles allowed to create/update/delete content in this app. viewer/user are read-only. */
const WRITER_ROLES: ReadonlySet<AppRole> = new Set(['superadmin', 'editor', 'designer'])

/** Global platform owner (Payload `users.role`). Bypasses all app scoping. */
const isPlatformSuperAdmin = (req: PayloadRequest): boolean => req.user?.role === 'super_admin'

/**
 * Resolve the current user's role + permissions in the current app from `app_users`. Returns
 * null when unauthenticated, no app key, or no active membership row. `app_users` is a
 * chaipro-managed Drizzle table (not a Payload collection), so it is read through the
 * ChaiBuilder instance's `safeQuery`. Memoized on the request so repeated access/field checks
 * in one request hit the DB once.
 */
async function getAppUser(req: PayloadRequest): Promise<AppUser | null> {
  const user = req.user
  if (!user) return null

  const cache = req as PayloadRequest & { _chaiAppUser?: Promise<AppUser | null> }
  if (cache._chaiAppUser) return cache._chaiAppUser

  cache._chaiAppUser = (async () => {
    const appId = process.env.CHAIBUILDER_APP_KEY
    if (!appId) return null

    const cb = await getChaiBuilder(await chaiConfig)
    const { data, error } = await cb.safeQuery(({ db, schema }) =>
      db
        .select({ role: schema.appUsers.role, permissions: schema.appUsers.permissions })
        .from(schema.appUsers)
        .where(
          and(
            eq(schema.appUsers.user, user.id),
            eq(schema.appUsers.app, appId),
            eq(schema.appUsers.status, 'active'),
          ),
        )
        .limit(1),
    )
    if (error) throw error

    const row = data?.[0]
    if (!row?.role) return null
    return {
      role: row.role as AppRole,
      permissions: (row.permissions ?? null) as ChaiUserPermissionOverride,
    }
  })()

  return cache._chaiAppUser
}

/** Resolve just the app role (null if not an active member). */
const getAppRole = async (req: PayloadRequest): Promise<AppRole | null> =>
  (await getAppUser(req))?.role ?? null

/** Any authenticated Payload user. Gate for global, non-app-scoped admin surfaces. */
export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Platform owner, or any active member of the current app (any role). */
export const appMember = async ({ req }: { req: PayloadRequest }): Promise<boolean> => {
  if (!req.user) return false
  if (isPlatformSuperAdmin(req)) return true
  return (await getAppRole(req)) != null
}

/**
 * Write access for app-scoped content: the platform owner, or an app member whose
 * `app_users.role` is a writer role (superadmin/editor/designer).
 */
export const staff: Access = async ({ req }) => {
  if (!req.user) return false
  if (isPlatformSuperAdmin(req)) return true
  const role = await getAppRole(req)
  return role != null && WRITER_ROLES.has(role)
}

/** Restricted to the global platform owner. Use for collections holding secrets/PII. */
export const superAdmin: Access = ({ req }) => req.user?.role === 'super_admin'

/** Public read of anything. Used by non-draft collections (e.g. media). */
export const anyone: Access = () => true

/**
 * Role-only read for draft-enabled content collections: the platform owner and any active
 * app member see everything; the public (and non-members) see published only. App scoping is
 * added on top by `chaiBuilderPlugin`, so these stay tenant-agnostic.
 */
export const staffOrPublished: Access = async ({ req }) => {
  if (!req.user) return { _status: { equals: 'published' } }
  if (isPlatformSuperAdmin(req)) return true
  const role = await getAppRole(req)
  return role != null ? true : { _status: { equals: 'published' } }
}

/** Access preset for app-scoped draft content collections. */
export const staffContentAccess = {
  create: staff,
  read: staffOrPublished,
  update: staff,
  delete: staff,
}

/** Access preset for app-scoped non-draft public collections (e.g. media). */
export const mediaContentAccess = {
  create: staff,
  read: anyone,
  update: staff,
  delete: staff,
}
