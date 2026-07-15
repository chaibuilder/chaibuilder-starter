import 'server-only'

import config from '@payload-config'
import type { FormSubmission } from '@/payload-types'
import { getPayload } from 'payload'

import type { FormSubmissionData } from './form-types'

export async function saveFormSubmission({ formData, additionalData = {} }: FormSubmissionData) {
  const formName = (formData.formName as string) || 'contact'
  const pageUrl = (additionalData.pageUrl as string) || ''

  if (typeof formName !== 'string' || formName.length > 255) {
    throw new Error('Invalid formName')
  }

  const app = process.env.CHAIBUILDER_APP_KEY
  if (!app) {
    throw new Error('CHAIBUILDER_APP_KEY not set')
  }

  const payloadConfig = await config
  const payloadCMS = await getPayload({ config: payloadConfig })

  await payloadCMS.create({
    collection: 'form-submissions',
    data: {
      app,
      formName,
      formData: formData as FormSubmission['formData'],
      additionalData: additionalData as FormSubmission['additionalData'],
      pageUrl,
    },
    overrideAccess: true,
  })
}
