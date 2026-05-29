import { INGREDIENT_DB } from "./ingredients";

export type DietId =
  | "vegan"
  | "vegetarian"
  | "gluten-free"
  | "dairy-free"
  | "nut-free"
  | "jain"
  | "halal"
  | "keto";

export interface DietDefinition {
  id: DietId;
  label: string;
  emoji: string;
  /** Ingredient tags that DISQUALIFY the food from this diet. */
  forbiddenTags: string[];
}

export const DIETS: DietDefinition[] = [
  { id: "vegan",        label: "Vegan",        emoji: "🌱", forbiddenTags: ["dairy", "egg", "meat", "fish", "non-vegan"] },
  { id: "vegetarian",   label: "Vegetarian",   emoji: "🥦", forbiddenTags: ["meat", "fish", "non-veg"] },
  { id: "gluten-free",  label: "Gluten-Free",  emoji: "🌾", forbiddenTags: ["gluten"] },
  { id: "dairy-free",   label: "Dairy-Free",   emoji: "🥛", forbiddenTags: ["dairy"] },
  { id: "nut-free",     label: "Nut-Free",     emoji: "🥜", forbiddenTags: ["peanut", "tree-nut"] },
  { id: "jain",         label: "Jain",         emoji: "🪷", forbiddenTags: ["meat", "fish", "egg", "non-veg", "root", "non-jain", "alcohol"] },
  { id: "halal",        label: "Halal",        emoji: "☪️", forbiddenTags: ["alcohol", "non-halal"] },
  { id: "keto",         label: "Keto",         emoji: "🥑", forbiddenTags: ["hidden-sugar"] },
];

export interface DietVerdict {
  diet: DietDefinition;
  passes: boolean;
  reasons: string[]; // matched ingredient display names
}

/**
 * Returns a verdict for every enabled diet by checking the decoded-ingredient
 * tags against forbidden tags. Pure function — easy to unit-test.
 */
export function evaluateDiets(matchedIngredientIds: string[], enabled: DietId[]): DietVerdict[] {
  const matched = matchedIngredientIds
    .map((id) => INGREDIENT_DB.find((i) => i.id === id))
    .filter(Boolean) as typeof INGREDIENT_DB;

  return DIETS.filter((d) => enabled.includes(d.id)).map((diet) => {
    const offenders = matched.filter((ing) =>
      ing.tags.some((t) => diet.forbiddenTags.includes(t)),
    );
    return {
      diet,
      passes: offenders.length === 0,
      reasons: offenders.map((o) => o.display),
    };
  });
}
