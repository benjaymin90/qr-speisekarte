import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";

async function getRestaurantId() {
  const isAuth = await verifySession();
  if (!isAuth) return null;
  const restaurant = await db.restaurant.findFirst({ select: { id: true } });
  return restaurant?.id ?? null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const restaurantId = await getRestaurantId();
  if (!restaurantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const template = await db.emailTemplate.findFirst({
    where: { id, restaurantId },
  });

  if (!template) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(template);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const restaurantId = await getRestaurantId();
  if (!restaurantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await db.emailTemplate.findFirst({
    where: { id, restaurantId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, subject, body: templateBody, isDefault, isActive } = body;

  // If setting as default, unset other defaults of same type
  if (isDefault && !existing.isDefault) {
    await db.emailTemplate.updateMany({
      where: { restaurantId, type: existing.type, isDefault: true },
      data: { isDefault: false },
    });
  }

  const template = await db.emailTemplate.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(subject !== undefined && { subject }),
      ...(templateBody !== undefined && { body: templateBody }),
      ...(isDefault !== undefined && { isDefault }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json(template);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const restaurantId = await getRestaurantId();
  if (!restaurantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await db.emailTemplate.findFirst({
    where: { id, restaurantId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.emailTemplate.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
