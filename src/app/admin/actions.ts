"use server";

import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateRestaurantProfile(formData: FormData) {
  const userId = await requireUserId();
  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    return { error: "Restaurant-Name ist erforderlich." };
  }

  await db.restaurant.update({
    where: { clerkUserId: userId },
    data: { name: name.trim() },
  });

  revalidatePath("/admin");
  return { success: true };
}
