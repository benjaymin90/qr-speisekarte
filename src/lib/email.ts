import { Resend } from "resend";
import { db } from "@/lib/db";
import type { EmailTemplateType } from "@/generated/prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

import { renderTemplate } from "@/lib/email-preview";

const FROM_EMAIL = process.env.EMAIL_FROM ?? "noreply@bewerbungsboard.de";

type TemplatePlaceholders = Record<string, string>;

export { renderTemplate };

/**
 * Send an email using a stored template, log the result.
 */
export async function sendTemplateEmail({
  templateId,
  restaurantId,
  recipientEmail,
  recipientName,
  placeholders,
}: {
  templateId: string;
  restaurantId: string;
  recipientEmail: string;
  recipientName?: string;
  placeholders: TemplatePlaceholders;
}) {
  const template = await db.emailTemplate.findFirst({
    where: { id: templateId, restaurantId, isActive: true },
  });

  if (!template) {
    throw new Error(`Template ${templateId} not found or inactive`);
  }

  const subject = renderTemplate(template.subject, placeholders);
  const body = renderTemplate(template.body, placeholders);

  const log = await db.emailLog.create({
    data: {
      restaurantId,
      templateId,
      recipientEmail,
      recipientName,
      subject,
      body,
      status: "pending",
    },
  });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject,
      html: body,
    });

    if (error) {
      await db.emailLog.update({
        where: { id: log.id },
        data: { status: "failed", errorMessage: error.message },
      });
      throw new Error(error.message);
    }

    await db.emailLog.update({
      where: { id: log.id },
      data: {
        status: "sent",
        resendId: data?.id,
        sentAt: new Date(),
      },
    });

    return { logId: log.id, resendId: data?.id };
  } catch (err) {
    await db.emailLog.update({
      where: { id: log.id },
      data: {
        status: "failed",
        errorMessage: err instanceof Error ? err.message : "Unknown error",
      },
    });
    throw err;
  }
}

/**
 * Send a notification email triggered by a status change or application event.
 * Finds the default template for the given type and sends it.
 */
export async function sendNotification({
  restaurantId,
  type,
  recipientEmail,
  recipientName,
  placeholders,
}: {
  restaurantId: string;
  type: EmailTemplateType;
  recipientEmail: string;
  recipientName?: string;
  placeholders: TemplatePlaceholders;
}) {
  const template = await db.emailTemplate.findFirst({
    where: {
      restaurantId,
      type,
      isDefault: true,
      isActive: true,
    },
  });

  if (!template) {
    // No default template configured — skip silently
    return null;
  }

  return sendTemplateEmail({
    templateId: template.id,
    restaurantId,
    recipientEmail,
    recipientName,
    placeholders,
  });
}
