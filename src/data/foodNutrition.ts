/**
 * Tiny food → per-100g nutrition lookup used by the plate-photo flow.
 * Numbers from USDA FoodData Central (public domain). Extend freely.
 */
export interface FoodMacros {
  kcal: number;
  protein: number; // g
  carbs: number;
  fat: number;
  fiber: number;
}

export const FOOD_NUTRITION: Record<string, FoodMacros> = {
  rice: { kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  "brown rice": { kcal: 123, protein: 2.7, carbs: 26, fat: 1.0, fiber: 1.8 },
  bread: { kcal: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7 },
  chapati: { kcal: 297, protein: 11, carbs: 46, fat: 7.5, fiber: 4.9 },
  roti: { kcal: 297, protein: 11, carbs: 46, fat: 7.5, fiber: 4.9 },
  pasta: { kcal: 158, protein: 5.8, carbs: 31, fat: 0.9, fiber: 1.8 },
  pizza: { kcal: 266, protein: 11, carbs: 33, fat: 10, fiber: 2.3 },
  burger: { kcal: 295, protein: 17, carbs: 24, fat: 14, fiber: 1.5 },
  cheeseburger: { kcal: 303, protein: 15, carbs: 30, fat: 14, fiber: 1.5 },
  "french fries": { kcal: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8 },
  fries: { kcal: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8 },
  egg: { kcal: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
  omelette: { kcal: 154, protein: 11, carbs: 0.6, fat: 12, fiber: 0 },
  chicken: { kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  "grilled chicken": { kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  fish: { kcal: 206, protein: 22, carbs: 0, fat: 12, fiber: 0 },
  salmon: { kcal: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
  tuna: { kcal: 132, protein: 28, carbs: 0, fat: 1.3, fiber: 0 },
  paneer: { kcal: 265, protein: 18, carbs: 1.2, fat: 21, fiber: 0 },
  tofu: { kcal: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3 },
  dal: { kcal: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 },
  lentils: { kcal: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 },
  curry: { kcal: 150, protein: 7, carbs: 12, fat: 8, fiber: 2 },
  salad: { kcal: 33, protein: 1.8, carbs: 6, fat: 0.2, fiber: 2.1 },
  broccoli: { kcal: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
  spinach: { kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
  potato: { kcal: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
  "mashed potato": { kcal: 113, protein: 2, carbs: 17, fat: 4.2, fiber: 1.5 },
  apple: { kcal: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
  banana: { kcal: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
  orange: { kcal: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 },
  yogurt: { kcal: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0 },
  cheese: { kcal: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0 },
  milk: { kcal: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0 },
  donut: { kcal: 452, protein: 5, carbs: 51, fat: 25, fiber: 1.4 },
  cookie: { kcal: 502, protein: 5.7, carbs: 64, fat: 25, fiber: 2.4 },
  cake: { kcal: 257, protein: 4, carbs: 38, fat: 11, fiber: 1 },
  chocolate: { kcal: 546, protein: 4.9, carbs: 61, fat: 31, fiber: 7 },
  "ice cream": { kcal: 207, protein: 3.5, carbs: 24, fat: 11, fiber: 0.7 },
  soup: { kcal: 60, protein: 3, carbs: 8, fat: 1.8, fiber: 0.8 },
  sushi: { kcal: 150, protein: 5.8, carbs: 30, fat: 0.7, fiber: 1.2 },
  taco: { kcal: 226, protein: 9, carbs: 20, fat: 12, fiber: 3 },
  burrito: { kcal: 206, protein: 8, carbs: 28, fat: 7, fiber: 3 },
  noodles: { kcal: 138, protein: 4.5, carbs: 25, fat: 2.1, fiber: 1.2 },
  "fried rice": { kcal: 163, protein: 4, carbs: 25, fat: 5, fiber: 0.9 },
};

/**
 * Default plate weight assumption (grams) when we can't measure.
 * Tuned to typical adult serving ≈ one cup cooked.
 */
export const DEFAULT_SERVING_G = 180;
