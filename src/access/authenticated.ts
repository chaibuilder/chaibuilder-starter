import type { Access } from 'payload'

/** Admin-only: any authenticated Payload user. Pro Licensing is global (not app-scoped). */
export const authenticated: Access = ({ req }) => Boolean(req.user)

/**
 * Staff = any authenticated user who is NOT a customer. Customers are self-service
 * portal logins created by payment webhooks; they must never see admin/global data.
 */
export const staff: Access = ({ req }) => Boolean(req.user && req.user.role !== 'customer')

/** Restricted to super-admin users. Use for collections holding secrets/PII. */
export const superAdmin: Access = ({ req }) => req.user?.role === 'super_admin'

/** Public read of anything. Used by non-draft collections (e.g. media). */
export const anyone: Access = () => true

/**
 * Role-only read for draft-enabled content collections: staff see everything,
 * public/customers see published only. App scoping is added on top by
 * `chaiBuilderPlugin`, so these stay tenant-agnostic.
 */
export const staffOrPublished: Access = ({ req }) =>
  req.user && req.user.role !== 'customer' ? true : { _status: { equals: 'published' } }

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
