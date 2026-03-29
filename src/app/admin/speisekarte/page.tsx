import { db } from "@/lib/db";
import { getRestaurant } from "@/lib/auth";
import { SpeisekarteClient } from "./speisekarte-client";

export default async function SpeisekartePage() {
  const restaurant = await getRestaurant();

  const categories = await db.category.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { sortOrder: "asc" },
    include: {
      dishes: {
        orderBy: { sortOrder: "asc" },
        include: { variants: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  // Serialize Decimal → string for client component
  const serialized = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    dishes: cat.dishes.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      price: d.price.toString(),
      categoryId: d.categoryId,
      allergens: d.allergens,
      isVisible: d.isVisible,
      imageUrl: d.imageUrl,
      variants: d.variants.map((v) => ({
        id: v.id,
        label: v.label,
        price: v.price.toString(),
      })),
    })),
  }));

  return <SpeisekarteClient categories={serialized} />;
}
