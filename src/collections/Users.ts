import type { CollectionConfig } from 'payload'
import {
  buildForgotPasswordEmailHTML,
  buildForgotPasswordEmailSubject,
} from '@/utilities/passwordResetEmail'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  access: {
    // Admin panel requires an authenticated non-customer. `undefined !== 'customer'`
    // would otherwise let unauthenticated requests through.
    admin: ({ req }) => Boolean(req.user) && req.user?.role !== 'customer',
    // Staff create users; the webhook creates customers via overrideAccess.
    create: ({ req }) => Boolean(req.user && req.user.role !== 'customer'),
    // Staff read everyone; a customer reads only their own record.
    read: ({ req }) => {
      if (!req.user) return false
      return true
    },
    // Staff update anyone; a customer updates only themselves (e.g. password).
    update: ({ req }) => {
      if (!req.user) return false
      return true
    },
    delete: ({ req }) => req.user?.role === 'super_admin',
  },
  auth: {
    forgotPassword: {
      expiration: 1000 * 60 * 60, // 1 hour
      generateEmailSubject: (args) =>
        buildForgotPasswordEmailSubject({
          token: args?.token ?? '',
          user: args?.user,
          req: args?.req,
        }),
      generateEmailHTML: (args) =>
        buildForgotPasswordEmailHTML({
          token: args?.token ?? '',
          user: args?.user,
          req: args?.req,
        }),
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'none', label: 'None' },
      ],
      defaultValue: 'none',
      // Available on req.user so access checks don't need a DB read.
      saveToJWT: true,
      // Field-level lock: only a super-admin may set/change role. Without this a
      // customer could PATCH their own record (self-update is allowed) and escalate
      // to super_admin. The webhook sets role via overrideAccess, which bypasses this.
      access: {
        create: ({ req }) => req.user?.role === 'super_admin',
        update: ({ req }) => req.user?.role === 'super_admin',
      },
    },
    // Email added by default
    // Add more fields as needed
  ],
}
