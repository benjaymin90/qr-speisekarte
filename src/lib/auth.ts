import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

/**
 * Get the current user's restaurant, creating one if it doesn't exist yet.
 * Redirects to sign-in if not authenticated.
 */
export async function getRestaurant() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let restaurant = await db.restaurant.findUnique({
    where: { clerkUserId: userId },
  });

  if (!restaurant) {
    restaurant = await db.restaurant.create({
      data: {
        clerkUserId: userId,
        name: "Mein Restaurant",
        menus: {
          create: {
            name: "Speisekarte",
            slug: "speisekarte",
          },
        },
      },
    });
  }

  return restaurant;
}

/**
 * Get userId or redirect. Use in server actions.
 */
export async function requireUserId() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return userId;
}
