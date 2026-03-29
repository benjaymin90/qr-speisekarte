"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ALLERGENS, type AllergenCode, ALLERGEN_CODES } from "@/lib/allergens";
import { Search, Filter } from "lucide-react";

type Dish = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  allergens: string[];
  imageUrl: string | null;
};

type Category = {
  id: string;
  name: string;
  dishes: Dish[];
};

type MenuData = {
  restaurant: { name: string };
  categories: Category[];
};

export function GuestMenu({ data }: { data: MenuData }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredAllergens, setFilteredAllergens] = useState<Set<string>>(
    new Set()
  );

  const toggleAllergen = (code: string) => {
    setFilteredAllergens((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const filtered = data.categories
    .filter((cat) => !activeCategory || cat.id === activeCategory)
    .map((cat) => ({
      ...cat,
      dishes: cat.dishes.filter((dish) => {
        const matchesSearch =
          !search ||
          dish.name.toLowerCase().includes(search.toLowerCase()) ||
          dish.description?.toLowerCase().includes(search.toLowerCase());

        const matchesAllergens =
          filteredAllergens.size === 0 ||
          !dish.allergens.some((a) => filteredAllergens.has(a));

        return matchesSearch && matchesAllergens;
      }),
    }))
    .filter((cat) => cat.dishes.length > 0);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur-sm px-4 py-4">
        <h1 className="text-xl font-bold">{data.restaurant.name}</h1>

        {/* Search + Filter */}
        <div className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Gericht suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-zinc-200 text-zinc-600"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white text-zinc-900">
              <SheetHeader>
                <SheetTitle className="text-zinc-900">
                  Allergene filtern
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-2">
                {ALLERGEN_CODES.map((code) => {
                  const allergen = ALLERGENS[code];
                  const active = filteredAllergens.has(code);
                  return (
                    <button
                      key={code}
                      onClick={() => toggleAllergen(code)}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        active
                          ? "border-red-300 bg-red-50 text-red-800"
                          : "border-zinc-200 hover:bg-zinc-50"
                      }`}
                    >
                      <span>{allergen.emoji}</span>
                      <span className="font-medium">{allergen.code}</span>
                      <span className="text-zinc-500">{allergen.name}</span>
                    </button>
                  );
                })}
              </div>
              {filteredAllergens.size > 0 && (
                <Button
                  variant="outline"
                  className="mt-4 w-full border-zinc-200"
                  onClick={() => setFilteredAllergens(new Set())}
                >
                  Filter zurücksetzen
                </Button>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Category chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              !activeCategory
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            Alle
          </button>
          {data.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setActiveCategory(activeCategory === cat.id ? null : cat.id)
              }
              className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Menu content */}
      <main className="px-4 py-4 pb-20">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-zinc-400">
            <p className="text-lg font-medium">Keine Treffer</p>
            <p className="text-sm">Versuche, einen Filter zu entfernen.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((category) => (
              <section key={category.id}>
                <h2 className="mb-3 text-lg font-semibold text-zinc-800">
                  {category.name}
                </h2>
                <div className="space-y-3">
                  {category.dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="rounded-xl border border-zinc-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="font-medium">{dish.name}</h3>
                          {dish.description && (
                            <p className="text-sm text-zinc-500">
                              {dish.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {dish.allergens.map((code) => {
                              const allergen =
                                ALLERGENS[code as AllergenCode];
                              if (!allergen) return null;
                              return (
                                <Badge
                                  key={code}
                                  variant="outline"
                                  className="border-zinc-200 text-xs text-zinc-500"
                                >
                                  {allergen.emoji} {code}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                        <span className="shrink-0 font-mono font-semibold text-zinc-900">
                          {dish.price} €
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-white/95 backdrop-blur-sm px-4 py-2">
        <p className="text-center text-xs text-zinc-400">
          Powered by QR-Speisekarte
        </p>
      </footer>
    </div>
  );
}
