"use server";

import { db } from "@/lib/db";
import { getRestaurant } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";

// ─── Categories ──────────────────────────────────────────

export async function createCategory(formData: FormData) {
  const restaurant = await getRestaurant();
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name ist erforderlich." };

  const maxOrder = await db.category.aggregate({
    where: { restaurantId: restaurant.id },
    _max: { sortOrder: true },
  });

  await db.category.create({
    data: {
      restaurantId: restaurant.id,
      name,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath("/admin/speisekarte");
  return { success: true };
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const restaurant = await getRestaurant();
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name ist erforderlich." };

  await db.category.update({
    where: { id: categoryId, restaurantId: restaurant.id },
    data: { name },
  });

  revalidatePath("/admin/speisekarte");
  return { success: true };
}

export async function deleteCategory(categoryId: string) {
  const restaurant = await getRestaurant();

  await db.category.delete({
    where: { id: categoryId, restaurantId: restaurant.id },
  });

  revalidatePath("/admin/speisekarte");
  return { success: true };
}

// ─── Dishes ──────────────────────────────────────────────

export type DishPayload = {
  id?: string;
  categoryId: string;
  name: string;
  description?: string;
  price: string;
  allergens: string[];
  isVisible: boolean;
  imageUrl?: string | null;
  variants: { id?: string; label: string; price: string }[];
};

export async function upsertDish(payload: DishPayload) {
  const restaurant = await getRestaurant();
  const { id, categoryId, name, description, price, allergens, isVisible, imageUrl, variants } =
    payload;

  if (!name.trim()) return { error: "Gerichtname ist erforderlich." };
  if (!categoryId) return { error: "Kategorie ist erforderlich." };

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice < 0) return { error: "Ungültiger Preis." };

  const data = {
    restaurantId: restaurant.id,
    categoryId,
    name: name.trim(),
    description: description?.trim() || null,
    price: parsedPrice,
    allergens,
    isVisible,
    imageUrl: imageUrl ?? null,
  };

  if (id) {
    // Update existing dish
    await db.dish.update({
      where: { id, restaurantId: restaurant.id },
      data,
    });

    // Sync variants: delete removed, upsert existing/new
    const existingVariantIds = variants.filter((v) => v.id).map((v) => v.id!);
    await db.dishVariant.deleteMany({
      where: { dishId: id, id: { notIn: existingVariantIds } },
    });

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      const vPrice = parseFloat(v.price);
      if (isNaN(vPrice) || vPrice < 0) continue;
      if (v.id) {
        await db.dishVariant.update({
          where: { id: v.id },
          data: { label: v.label.trim(), price: vPrice, sortOrder: i },
        });
      } else {
        await db.dishVariant.create({
          data: { dishId: id, label: v.label.trim(), price: vPrice, sortOrder: i },
        });
      }
    }
  } else {
    // Create new dish
    const maxOrder = await db.dish.aggregate({
      where: { restaurantId: restaurant.id, categoryId },
      _max: { sortOrder: true },
    });

    const dish = await db.dish.create({
      data: {
        ...data,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });

    // Create variants
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      const vPrice = parseFloat(v.price);
      if (isNaN(vPrice) || vPrice < 0) continue;
      await db.dishVariant.create({
        data: { dishId: dish.id, label: v.label.trim(), price: vPrice, sortOrder: i },
      });
    }
  }

  revalidatePath("/admin/speisekarte");
  return { success: true };
}

export async function deleteDish(dishId: string) {
  const restaurant = await getRestaurant();

  // Delete blob image if present
  const dish = await db.dish.findUnique({
    where: { id: dishId, restaurantId: restaurant.id },
    select: { imageUrl: true },
  });
  if (dish?.imageUrl) {
    try {
      await del(dish.imageUrl);
    } catch {
      // Blob deletion is best-effort
    }
  }

  await db.dish.delete({
    where: { id: dishId, restaurantId: restaurant.id },
  });

  revalidatePath("/admin/speisekarte");
  return { success: true };
}

export async function toggleDishVisibility(dishId: string, isVisible: boolean) {
  const restaurant = await getRestaurant();

  await db.dish.update({
    where: { id: dishId, restaurantId: restaurant.id },
    data: { isVisible },
  });

  revalidatePath("/admin/speisekarte");
  return { success: true };
}
