'use server'

// import { notifySiteOwnerOfFormSubmission } from './mail/form-submission'
import type { FormSubmissionData } from './form-types'

export async function formSubmit(data: FormSubmissionData) {
  try {
    const { saveFormSubmission } = await import('./save-form-submission')
    const { formData, additionalData = {} } = data

    await saveFormSubmission({ formData, additionalData })
    // await notifySiteOwnerOfFormSubmission('chaibuilder.com', formData, additionalData)

    return { success: true }
  } catch (error) {
    console.error('Form submission error:', error)
    return { success: false }
  }
}
