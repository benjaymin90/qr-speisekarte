import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { sendNotification } from "@/lib/email";
import type { ApplicationStage, EmailTemplateType } from "@/generated/prisma/client";

async function getRestaurantId() {
  const isAuth = await verifySession();
  if (!isAuth) return null;
  const restaurant = await db.restaurant.findFirst({ select: { id: true } });
  return restaurant?.id ?? null;
}

/** Map application stage transitions to email template types */
const STAGE_TO_TEMPLATE: Partial<Record<ApplicationStage, EmailTemplateType>> =
  {
    EINGANG: "BESTAETIGUNG",
    INTERVIEW: "EINLADUNG",
    ANGEBOT: "ANGEBOT",
    ABGELEHNT: "ABSAGE",
  };

/**
 * POST /api/notifications
 * Trigger a notification email for an applicant event.
 *
 * Body: { applicantId: string, event: "stage_change" | "manual", templateType?: EmailTemplateType }
 */
export async function POST(req: NextRequest) {
  const restaurantId = await getRestaurantId();
  if (!restaurantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { applicantId, event, templateType } = body as {
    applicantId: string;
    event: "stage_change" | "manual";
    templateType?: EmailTemplateType;
  };

  if (!applicantId) {
    return NextResponse.json(
      { error: "applicantId is required" },
      { status: 400 },
    );
  }

  const applicant = await db.applicant.findFirst({
    where: { id: applicantId, restaurantId },
    include: { job: { select: { title: true } } },
  });

  if (!applicant) {
    return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
  }

  // Determine template type from event or explicit override
  let type: EmailTemplateType | undefined = templateType;
  if (!type && event === "stage_change") {
    type = STAGE_TO_TEMPLATE[applicant.stage];
  }

  if (!type) {
    return NextResponse.json(
      { error: "Could not determine notification type for this event" },
      { status: 400 },
    );
  }

  const placeholders = {
    vorname: applicant.firstName,
    nachname: applicant.lastName,
    name: `${applicant.firstName} ${applicant.lastName}`,
    email: applicant.email,
    stelle: applicant.job.title,
    status: applicant.stage,
  };

  const result = await sendNotification({
    restaurantId,
    type,
    recipientEmail: applicant.email,
    recipientName: `${applicant.firstName} ${applicant.lastName}`,
    placeholders,
  });

  if (!result) {
    return NextResponse.json(
      { sent: false, reason: "No default template configured for this type" },
      { status: 200 },
    );
  }

  return NextResponse.json({ sent: true, logId: result.logId });
}
