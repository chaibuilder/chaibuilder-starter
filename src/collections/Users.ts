import type { CollectionConfig } from 'payload'
import { appMember, canWriteContent } from '@/access/authenticated'
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
    // Admin panel requires the platform owner or an active member of the current app.
    admin: appMember,
    // Only writer roles (or the platform owner) create users.
    create: canWriteContent,
    // Any authenticated user may read their own record; app members (or platform owner) may read all.
    read: async ({ req }) => {
      if (!req.user) return false
      return (await appMember({ req })) ? true : { id: { equals: req.user.id } }
    },
    // Any authenticated user may update their own record; app members (or platform owner) may update all.
    update: async ({ req }) => {
      if (!req.user) return false
      return (await appMember({ req })) ? true : { id: { equals: req.user.id } }
    },
    // Only the global platform owner may delete a user.
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
