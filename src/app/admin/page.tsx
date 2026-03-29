import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UtensilsCrossed, QrCode, Eye } from "lucide-react";
import { getRestaurant } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminDashboard() {
  const restaurant = await getRestaurant();

  const [dishCount, qrCodeCount] = await Promise.all([
    db.dish.count({
      where: { restaurantId: restaurant.id, isVisible: true },
    }),
    db.qrCode.count({
      where: { restaurantId: restaurant.id },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Willkommen in deiner digitalen Speisekarten-Verwaltung.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gerichte</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{dishCount}</div>
            <CardDescription>Aktive Gerichte</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR-Codes</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{qrCodeCount}</div>
            <CardDescription>Generierte Codes</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aufrufe</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">0</div>
            <CardDescription>Diesen Monat</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
