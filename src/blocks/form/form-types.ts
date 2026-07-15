export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export interface FormSubmissionData {
  formData: Record<string, JsonValue>
  additionalData: Record<string, JsonValue>
}
