'use server'

import type { FormSubmissionData } from './data'

export async function formSubmit(data: FormSubmissionData) {
  try {
    const { saveFormSubmission } = await import('./data')
    const { formData, additionalData = {} } = data

    await saveFormSubmission({ formData, additionalData })

    return { success: true }
  } catch (error) {
    console.error('Form submission error:', error)
    return { success: false }
  }
}
