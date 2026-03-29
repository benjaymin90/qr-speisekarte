import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { ALLERGENS, type AllergenCode } from "@/lib/allergens";

// Placeholder — will be replaced with real data fetching
const categories = [
  {
    id: "1",
    name: "Vorspeisen",
    dishes: [
      {
        id: "1",
        name: "Caesar Salad",
        price: "8.90",
        allergens: ["A", "C", "G"] as AllergenCode[],
        isVisible: true,
      },
      {
        id: "2",
        name: "Bruschetta",
        price: "6.50",
        allergens: ["A"] as AllergenCode[],
        isVisible: true,
      },
    ],
  },
  {
    id: "2",
    name: "Hauptgerichte",
    dishes: [
      {
        id: "3",
        name: "Spaghetti Carbonara",
        price: "13.90",
        allergens: ["A", "C", "G"] as AllergenCode[],
        isVisible: true,
      },
    ],
  },
];

export default function SpeisekartePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Speisekarte</h1>
          <p className="text-muted-foreground">
            Verwalte deine Kategorien und Gerichte.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Kategorie hinzufügen
        </Button>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{category.name}</CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
                Gericht hinzufügen
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{dish.name}</span>
                        {!dish.isVisible && (
                          <Badge variant="secondary">Versteckt</Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {dish.allergens.map((code) => (
                          <Badge
                            key={code}
                            variant="outline"
                            className="text-xs"
                          >
                            {ALLERGENS[code].emoji} {code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-semibold">
                        {dish.price} €
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
