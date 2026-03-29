"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { ALLERGENS, type AllergenCode } from "@/lib/allergens";
import { CategoryDialog } from "./category-dialog";
import { DishDialog } from "./dish-dialog";
import { deleteDish, toggleDishVisibility } from "./actions";

type Variant = { id: string; label: string; price: string };

type Dish = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  categoryId: string;
  allergens: string[];
  isVisible: boolean;
  imageUrl: string | null;
  variants: Variant[];
};

type Category = {
  id: string;
  name: string;
  dishes: Dish[];
};

export function SpeisekarteClient({ categories }: { categories: Category[] }) {
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const [dishDialogOpen, setDishDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [defaultCategoryId, setDefaultCategoryId] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const allCategories = categories.map((c) => ({ id: c.id, name: c.name }));

  function openNewCategory() {
    setEditingCategory(null);
    setCatDialogOpen(true);
  }

  function openEditCategory(cat: { id: string; name: string }) {
    setEditingCategory(cat);
    setCatDialogOpen(true);
  }

  function openNewDish(categoryId?: string) {
    setEditingDish(null);
    setDefaultCategoryId(categoryId);
    setDishDialogOpen(true);
  }

  function openEditDish(dish: Dish) {
    setEditingDish(dish);
    setDishDialogOpen(true);
  }

  function handleDeleteDish(dishId: string) {
    startTransition(async () => {
      await deleteDish(dishId);
    });
  }

  function handleToggleVisibility(dishId: string, current: boolean) {
    startTransition(async () => {
      await toggleDishVisibility(dishId, !current);
    });
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Speisekarte</h1>
            <p className="text-muted-foreground">
              Verwalte deine Kategorien und Gerichte.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openNewCategory}>
              <Plus className="mr-1 h-4 w-4" />
              Kategorie
            </Button>
            <Button onClick={() => openNewDish()} disabled={categories.length === 0}>
              <Plus className="mr-1 h-4 w-4" />
              Gericht
            </Button>
          </div>
        </div>

        {categories.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Noch keine Kategorien vorhanden. Erstelle zuerst eine Kategorie
              (z.B. &quot;Vorspeisen&quot;, &quot;Hauptgerichte&quot;).
            </CardContent>
          </Card>
        )}

        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {category.name}
                <Badge variant="secondary" className="text-xs font-normal">
                  {category.dishes.length}{" "}
                  {category.dishes.length === 1 ? "Gericht" : "Gerichte"}
                </Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditCategory(category)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openNewDish(category.id)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Gericht
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {category.dishes.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Keine Gerichte in dieser Kategorie.
                </p>
              ) : (
                <div className="space-y-3">
                  {category.dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className={`flex items-start justify-between rounded-lg border border-border p-4 ${
                        !dish.isVisible ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        {dish.imageUrl && (
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="h-16 w-16 rounded-md object-cover"
                          />
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{dish.name}</span>
                            {!dish.isVisible && (
                              <Badge variant="secondary">Versteckt</Badge>
                            )}
                          </div>
                          {dish.description && (
                            <p className="text-sm text-muted-foreground">
                              {dish.description}
                            </p>
                          )}
                          {dish.allergens.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {dish.allergens.map((code) => {
                                const a = ALLERGENS[code as AllergenCode];
                                if (!a) return null;
                                return (
                                  <Badge
                                    key={code}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {a.emoji} {code}
                                  </Badge>
                                );
                              })}
                            </div>
                          )}
                          {dish.variants.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {dish.variants.map((v) => (
                                <span
                                  key={v.id}
                                  className="text-xs text-muted-foreground"
                                >
                                  {v.label}: {v.price} €
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold whitespace-nowrap">
                          {dish.price} €
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDish(dish)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleVisibility(dish.id, dish.isVisible)
                              }
                            >
                              {dish.isVisible ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Verstecken
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Anzeigen
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteDish(dish.id)}
                              disabled={isPending}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Löschen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <CategoryDialog
        open={catDialogOpen}
        onOpenChange={setCatDialogOpen}
        category={editingCategory}
      />

      <DishDialog
        open={dishDialogOpen}
        onOpenChange={setDishDialogOpen}
        dish={editingDish}
        categories={allCategories}
        defaultCategoryId={defaultCategoryId}
      />
    </>
  );
}
