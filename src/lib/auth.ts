import { verifySession } from "./session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

/**
 * Get the current restaurant, creating one if it doesn't exist yet.
 * Redirects to sign-in if not authenticated.
 */
export async function getRestaurant() {
  const isAuth = await verifySession();
  if (!isAuth) redirect("/sign-in");

  let restaurant = await db.restaurant.findFirst();

  if (!restaurant) {
    restaurant = await db.restaurant.create({
      data: {
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
 * Require authentication. Redirects to sign-in if not authenticated.
 * Use in server actions and server components.
 */
export async function requireAuth() {
  const isAuth = await verifySession();
  if (!isAuth) redirect("/sign-in");
}
