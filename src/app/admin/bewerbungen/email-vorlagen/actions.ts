"use server";

import { db } from "@/lib/db";
import { getRestaurant } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { EmailTemplateType } from "@/generated/prisma/client";

export async function getTemplates() {
  const restaurant = await getRestaurant();
  return db.emailTemplate.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: [{ type: "asc" }, { createdAt: "desc" }],
  });
}

export async function createTemplate(formData: FormData) {
  const restaurant = await getRestaurant();

  const type = formData.get("type") as EmailTemplateType;
  const name = formData.get("name") as string;
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;
  const isDefault = formData.get("isDefault") === "on";

  if (!type || !name || !subject || !body) {
    throw new Error("Alle Pflichtfelder müssen ausgefüllt sein.");
  }

  if (isDefault) {
    await db.emailTemplate.updateMany({
      where: { restaurantId: restaurant.id, type, isDefault: true },
      data: { isDefault: false },
    });
  }

  await db.emailTemplate.create({
    data: {
      restaurantId: restaurant.id,
      type,
      name,
      subject,
      body,
      isDefault,
    },
  });

  revalidatePath("/admin/bewerbungen/email-vorlagen");
}

export async function updateTemplate(id: string, formData: FormData) {
  const restaurant = await getRestaurant();

  const existing = await db.emailTemplate.findFirst({
    where: { id, restaurantId: restaurant.id },
  });
  if (!existing) throw new Error("Vorlage nicht gefunden.");

  const name = formData.get("name") as string;
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;
  const isDefault = formData.get("isDefault") === "on";
  const isActive = formData.get("isActive") !== "off";

  if (isDefault && !existing.isDefault) {
    await db.emailTemplate.updateMany({
      where: { restaurantId: restaurant.id, type: existing.type, isDefault: true },
      data: { isDefault: false },
    });
  }

  await db.emailTemplate.update({
    where: { id },
    data: { name, subject, body, isDefault, isActive },
  });

  revalidatePath("/admin/bewerbungen/email-vorlagen");
}

export async function deleteTemplate(id: string) {
  const restaurant = await getRestaurant();

  const existing = await db.emailTemplate.findFirst({
    where: { id, restaurantId: restaurant.id },
  });
  if (!existing) throw new Error("Vorlage nicht gefunden.");

  await db.emailTemplate.delete({ where: { id } });

  revalidatePath("/admin/bewerbungen/email-vorlagen");
}
