"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateRestaurantProfile(formData: FormData) {
  await requireAuth();
  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    return { error: "Restaurant-Name ist erforderlich." };
  }

  const restaurant = await db.restaurant.findFirst({ select: { id: true } });
  if (!restaurant) return { error: "Restaurant nicht gefunden." };

  await db.restaurant.update({
    where: { id: restaurant.id },
    data: { name: name.trim() },
  });

  revalidatePath("/admin");
  return { success: true };
}
