import { notFound } from "next/navigation";
import { GuestMenu } from "@/components/guest-menu";

// Placeholder data — will be replaced with DB query
const menuData = {
  restaurant: {
    name: "Trattoria Bella",
  },
  categories: [
    {
      id: "1",
      name: "Vorspeisen",
      dishes: [
        {
          id: "1",
          name: "Caesar Salad",
          description: "Römersalat, Parmesan, Croutons, Caesar-Dressing",
          price: "8.90",
          allergens: ["A", "C", "G"],
          imageUrl: null,
        },
        {
          id: "2",
          name: "Bruschetta Classica",
          description: "Geröstetes Brot, Tomaten, Knoblauch, Basilikum",
          price: "6.50",
          allergens: ["A"],
          imageUrl: null,
        },
      ],
    },
    {
      id: "2",
      name: "Pasta",
      dishes: [
        {
          id: "3",
          name: "Spaghetti Carbonara",
          description: "Cremig, Guanciale, Pecorino, Ei",
          price: "13.90",
          allergens: ["A", "C", "G"],
          imageUrl: null,
        },
        {
          id: "4",
          name: "Penne Arrabbiata",
          description: "Scharfe Tomatensauce, Knoblauch, Chili",
          price: "11.50",
          allergens: ["A"],
          imageUrl: null,
        },
      ],
    },
    {
      id: "3",
      name: "Desserts",
      dishes: [
        {
          id: "5",
          name: "Tiramisu",
          description: "Mascarpone, Espresso, Kakaopulver",
          price: "7.50",
          allergens: ["A", "C", "G"],
          imageUrl: null,
        },
      ],
    },
  ],
};

export default async function MenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // TODO: fetch menu from DB by slug
  if (!slug) notFound();

  return <GuestMenu data={menuData} />;
}
