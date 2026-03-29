// EU-Verordnung Nr. 1169/2011 — 14 Hauptallergene
export const ALLERGENS = {
  A: { code: "A", name: "Glutenhaltiges Getreide", emoji: "🌾" },
  B: { code: "B", name: "Krebstiere", emoji: "🦀" },
  C: { code: "C", name: "Eier", emoji: "🥚" },
  D: { code: "D", name: "Fisch", emoji: "🐟" },
  E: { code: "E", name: "Erdnüsse", emoji: "🥜" },
  F: { code: "F", name: "Soja", emoji: "🫘" },
  G: { code: "G", name: "Milch/Laktose", emoji: "🥛" },
  H: { code: "H", name: "Schalenfrüchte", emoji: "🌰" },
  I: { code: "I", name: "Sellerie", emoji: "🥬" },
  J: { code: "J", name: "Senf", emoji: "🟡" },
  K: { code: "K", name: "Sesam", emoji: "⚪" },
  L: { code: "L", name: "Schwefeldioxid/Sulfite", emoji: "🍷" },
  M: { code: "M", name: "Lupinen", emoji: "🌸" },
  N: { code: "N", name: "Weichtiere", emoji: "🐚" },
} as const;

export type AllergenCode = keyof typeof ALLERGENS;
export const ALLERGEN_CODES = Object.keys(ALLERGENS) as AllergenCode[];
