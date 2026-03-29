import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import type { EmailTemplateType } from "@/generated/prisma/client";

async function getRestaurantId() {
  const { userId } = await auth();
  if (!userId) return null;
  const restaurant = await db.restaurant.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });
  return restaurant?.id ?? null;
}

export async function GET() {
  const restaurantId = await getRestaurantId();
  if (!restaurantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const templates = await db.emailTemplate.findMany({
    where: { restaurantId },
    orderBy: [{ type: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const restaurantId = await getRestaurantId();
  if (!restaurantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, name, subject, body: templateBody, isDefault } = body as {
    type: EmailTemplateType;
    name: string;
    subject: string;
    body: string;
    isDefault?: boolean;
  };

  if (!type || !name || !subject || !templateBody) {
    return NextResponse.json(
      { error: "type, name, subject, and body are required" },
      { status: 400 },
    );
  }

  // If setting as default, unset other defaults of same type
  if (isDefault) {
    await db.emailTemplate.updateMany({
      where: { restaurantId, type, isDefault: true },
      data: { isDefault: false },
    });
  }

  const template = await db.emailTemplate.create({
    data: {
      restaurantId,
      type,
      name,
      subject,
      body: templateBody,
      isDefault: isDefault ?? false,
    },
  });

  return NextResponse.json(template, { status: 201 });
}
