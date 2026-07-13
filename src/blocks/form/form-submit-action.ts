'use server'

import { getChaiBuilder } from 'chaipro/nextjs/server'
import { notifySiteOwnerOfFormSubmission } from './mail/form-submission'
import chaiConfig from '@chaibuilder-config'

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

interface FormSubmissionData {
  formData: Record<string, JsonValue>
  additionalData: Record<string, JsonValue>
}

export async function formSubmit(data: FormSubmissionData) {
  try {
    const appKey = process.env.CHAIBUILDER_APP_KEY

    if (!appKey) {
      console.error('CHAIBUILDER_APP_KEY not set')
      return { success: false }
    }

    const { formData, additionalData = {} } = data as {
      formData: Record<string, JsonValue>
      additionalData: Record<string, JsonValue>
    }

    const formName = (additionalData.formName as string) || 'contact'
    const pageUrl = (additionalData.pageUrl as string) || ''

    if (typeof formName !== 'string' || formName.length > 255) {
      console.error('Invalid formName')
      return { success: false }
    }

    const formSubmission = {
      app: appKey,
      formName,
      formData,
      additionalData,
      pageUrl,
    }

    const cb = await getChaiBuilder(chaiConfig)
    const { error } = await cb.safeQuery(({ db, schema }) =>
      db.insert(schema.appFormSubmissions).values(formSubmission),
    )
    if (error) return { success: false }

    await notifySiteOwnerOfFormSubmission('chaibuilder.com', formData, additionalData)

    return { success: true }
  } catch (error) {
    console.error('Form submission error:', error)
    return { success: false }
  }
}
