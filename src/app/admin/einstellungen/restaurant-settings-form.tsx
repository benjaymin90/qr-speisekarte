"use client";

import { useActionState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateRestaurantProfile } from "../actions";

type State = { error?: string; success?: boolean } | null;

export function RestaurantSettingsForm({
  restaurantName,
  currency,
}: {
  restaurantName: string;
  currency: string;
}) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: State, formData: FormData) => {
      return updateRestaurantProfile(formData);
    },
    null,
  );

  return (
    <Tabs defaultValue="restaurant">
      <TabsList>
        <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
        <TabsTrigger value="konto">Konto</TabsTrigger>
      </TabsList>

      <TabsContent value="restaurant" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Restaurantdaten</CardTitle>
            <CardDescription>
              Grundeinstellungen deines Restaurants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant-Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={restaurantName}
                  placeholder="z.B. Trattoria Bella"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Wahrung</Label>
                <Input id="currency" defaultValue={currency} disabled />
              </div>
              {state?.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
              {state?.success && (
                <p className="text-sm text-green-500">Gespeichert!</p>
              )}
              <Button type="submit" disabled={isPending}>
                {isPending ? "Speichert..." : "Speichern"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="konto" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Konto</CardTitle>
            <CardDescription>
              Kontoverwaltung und Abonnement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Free-Plan: 1 Speisekarte, 10 Gerichte
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
