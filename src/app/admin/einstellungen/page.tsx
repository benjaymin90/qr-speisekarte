import { getRestaurant } from "@/lib/auth";
import { RestaurantSettingsForm } from "./restaurant-settings-form";

export default async function EinstellungenPage() {
  const restaurant = await getRestaurant();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground">
          Verwalte dein Restaurant und Konto.
        </p>
      </div>

      <RestaurantSettingsForm
        restaurantName={restaurant.name}
        currency={restaurant.currency}
      />
    </div>
  );
}
