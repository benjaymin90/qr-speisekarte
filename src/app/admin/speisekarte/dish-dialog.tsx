"use client";

import { useState, useTransition, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { ALLERGENS, ALLERGEN_CODES, type AllergenCode } from "@/lib/allergens";
import { upsertDish, type DishPayload } from "./actions";

type DishData = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  categoryId: string;
  allergens: string[];
  isVisible: boolean;
  imageUrl: string | null;
  variants: { id: string; label: string; price: string }[];
};

type Category = { id: string; name: string };

export function DishDialog({
  open,
  onOpenChange,
  dish,
  categories,
  defaultCategoryId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dish?: DishData | null;
  categories: Category[];
  defaultCategoryId?: string;
}) {
  const [name, setName] = useState(dish?.name ?? "");
  const [description, setDescription] = useState(dish?.description ?? "");
  const [price, setPrice] = useState(dish?.price ?? "");
  const [categoryId, setCategoryId] = useState(
    dish?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? "",
  );
  const [allergens, setAllergens] = useState<string[]>(dish?.allergens ?? []);
  const [isVisible, setIsVisible] = useState(dish?.isVisible ?? true);
  const [imageUrl, setImageUrl] = useState<string | null>(dish?.imageUrl ?? null);
  const [variants, setVariants] = useState<
    { id?: string; label: string; price: string }[]
  >(dish?.variants ?? []);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function toggleAllergen(code: string) {
    setAllergens((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }

  function addVariant() {
    setVariants((prev) => [...prev, { label: "", price: "" }]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  function updateVariant(index: number, field: "label" | "price", value: string) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setImageUrl(data.url);
      }
    } catch {
      setError("Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const payload: DishPayload = {
        id: dish?.id,
        categoryId,
        name,
        description: description || undefined,
        price,
        allergens,
        isVisible,
        imageUrl,
        variants: variants.filter((v) => v.label.trim() && v.price),
      };
      const result = await upsertDish(payload);
      if (result.error) {
        setError(result.error);
      } else {
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {dish ? "Gericht bearbeiten" : "Neues Gericht"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="dish-name">Name *</Label>
            <Input
              id="dish-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Spaghetti Carbonara"
              autoFocus
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Kategorie *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Kategorie wählen" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="dish-desc">Beschreibung</Label>
            <Textarea
              id="dish-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurze Beschreibung des Gerichts"
              rows={2}
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="dish-price">Grundpreis (EUR) *</Label>
            <Input
              id="dish-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="12.90"
            />
          </div>

          {/* Variants */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Varianten / Größen</Label>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="mr-1 h-3 w-3" />
                Variante
              </Button>
            </div>
            {variants.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  placeholder="z.B. Klein 0.3l"
                  value={v.label}
                  onChange={(e) => updateVariant(i, "label", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Preis"
                  value={v.price}
                  onChange={(e) => updateVariant(i, "price", e.target.value)}
                  className="w-24"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVariant(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Allergens */}
          <div className="space-y-2">
            <Label>Allergene (EU-Verordnung 1169/2011)</Label>
            <div className="flex flex-wrap gap-1.5">
              {ALLERGEN_CODES.map((code) => {
                const a = ALLERGENS[code as AllergenCode];
                const active = allergens.includes(code);
                return (
                  <Badge
                    key={code}
                    variant={active ? "default" : "outline"}
                    className="cursor-pointer select-none"
                    onClick={() => toggleAllergen(code)}
                  >
                    {a.emoji} {code} — {a.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Bild</Label>
            {imageUrl ? (
              <div className="relative inline-block">
                <img
                  src={imageUrl}
                  alt="Gericht"
                  className="h-32 w-32 rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -right-2 -top-2 h-6 w-6"
                  onClick={() => setImageUrl(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Lädt hoch..." : "Bild hochladen"}
                </Button>
              </div>
            )}
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-3">
            <Switch checked={isVisible} onCheckedChange={setIsVisible} />
            <Label>Sichtbar für Gäste</Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Abbrechen
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Speichert..." : "Speichern"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
