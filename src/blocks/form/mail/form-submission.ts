import type { JsonValue } from '../form-types'

type FormSubmissionFieldValue = JsonValue;
type FormSubmissionFields = Partial<Record<string, FormSubmissionFieldValue>>;

function escapeHtml(value: unknown): string {
  const str = String(value ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeText(value: unknown): string {
  return String(value ?? "")
    .replace(/[\r\n\t]/g, " ")
    .trim();
}

const getFormSubmissionEmailTemplate = (
  formData: FormSubmissionFields,
  additionalData: FormSubmissionFields,
  siteName: string,
  domain: string,
) => {
  const formName = escapeHtml(formData.formName || "Default form");
  const escapedSiteName = escapeHtml(siteName || domain);
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #111827; margin-bottom: 16px;">New Form Submission: ${formName}</h2>
      <p style="color: #4b5563; margin-bottom: 24px;">You have received a new form submission on your website <strong>${escapedSiteName}</strong>.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="border-bottom: 2px solid #e5e7eb;">
            <th style="text-align: left; padding: 12px 8px; color: #374151;">Field</th>
            <th style="text-align: left; padding: 12px 8px; color: #374151;">Value</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(formData)
            .filter(([key]) => key !== "formName")
            .map(
              ([key, value]) => `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 12px 8px; color: #6b7280; font-weight: 500;">${escapeHtml(key)}</td>
              <td style="padding: 12px 8px; color: #111827;">${escapeHtml(value)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
        <h3 style="font-size: 14px; color: #374151; margin-top: 0; margin-bottom: 12px;">Submission Details</h3>
        <p style="font-size: 13px; color: #6b7280; margin: 4px 0;"><strong>Page URL:</strong> ${escapeHtml(additionalData.pageUrl || "N/A")}</p>
        <p style="font-size: 13px; color: #6b7280; margin: 4px 0;"><strong>Page Title:</strong> ${escapeHtml(additionalData.pageTitle || "N/A")}</p>
        <p style="font-size: 13px; color: #6b7280; margin: 4px 0;"><strong>Referrer:</strong> ${escapeHtml(additionalData.referrer || "Direct")}</p>
      </div>
      
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 32px;">
        This is an automated notification from your website builder.
      </p>
    </div>
  `;
};

export async function notifySiteOwnerOfFormSubmission(
  domain: string,
  formData: Record<string, JsonValue>,
  additionalData: Record<string, JsonValue>,
) {
  try {
    const ownerEmail = "surajair@gmail.com";
    if (!ownerEmail) return;

    const formName = formData.formName || "Default form";
    const emailHtml = getFormSubmissionEmailTemplate(
      formData,
      additionalData,
      "www.chaibuilder.com",
      domain,
    );

  } catch (error) {
    console.error("Failed to notify site owner of form submission:", error);
  }
}
