/**
 * Open Nutri-Score implementation (2023 algorithm, public domain).
 * Inputs are per-100 g / 100 ml. Returns grade A → E plus the raw score.
 *
 * Reference:
 *   https://world.openfoodfacts.org/nutriscore
 *   https://en.wikipedia.org/wiki/Nutri-Score
 */
export interface NutriInput {
  kcal?: number;
  sugars?: number;       // g
  saturatedFat?: number; // g
  salt?: number;         // g (NOT sodium)
  fiber?: number;        // g
  protein?: number;      // g
  fruitVegNuts?: number; // %
  isBeverage?: boolean;
}

export type NutriGrade = "A" | "B" | "C" | "D" | "E";

export interface NutriResult {
  score: number;
  grade: NutriGrade;
}

const energyPts = (kcal: number) =>
  Math.min(10, Math.floor(kcal / 80)); // 0..10

const sugarPts = (g: number) => {
  const t = [4.5, 9, 13.5, 18, 22.5, 27, 31, 36, 40, 45];
  return t.findIndex((x) => g <= x) === -1 ? 10 : t.findIndex((x) => g <= x);
};

const satFatPts = (g: number) => Math.min(10, Math.floor(g));
const saltPts = (g: number) => Math.min(10, Math.floor(g / 0.09));
const fiberPts = (g: number) => {
  const t = [0.9, 1.9, 2.8, 3.7, 4.7];
  return t.findIndex((x) => g <= x) === -1 ? 5 : t.findIndex((x) => g <= x);
};
const proteinPts = (g: number) => {
  const t = [1.6, 3.2, 4.8, 6.4, 8.0];
  return t.findIndex((x) => g <= x) === -1 ? 5 : t.findIndex((x) => g <= x);
};
const fvnPts = (pct: number) => {
  if (pct > 80) return 5;
  if (pct > 60) return 2;
  if (pct > 40) return 1;
  return 0;
};

export function computeNutriScore(n: NutriInput): NutriResult {
  const negative =
    energyPts(n.kcal ?? 0) +
    sugarPts(n.sugars ?? 0) +
    satFatPts(n.saturatedFat ?? 0) +
    saltPts(n.salt ?? 0);

  const fvn = fvnPts(n.fruitVegNuts ?? 0);
  const positive = fiberPts(n.fiber ?? 0) + fvn +
    // protein only counts fully if negative < 11 or fvn = 5
    (negative < 11 || fvn === 5 ? proteinPts(n.protein ?? 0) : 0);

  const score = negative - positive;

  // solid-food thresholds (beverages use different cuts but we keep it simple)
  let grade: NutriGrade;
  if (n.isBeverage) {
    grade = score <= 1 ? "B" : score <= 5 ? "C" : score <= 9 ? "D" : "E";
    if ((n.kcal ?? 999) === 0) grade = "A"; // water
  } else {
    grade = score <= -1 ? "A" : score <= 2 ? "B" : score <= 10 ? "C" : score <= 18 ? "D" : "E";
  }

  return { score, grade };
}

export const GRADE_COLOR: Record<NutriGrade, string> = {
  A: "#1B873F",
  B: "#85BB2F",
  C: "#FFC734",
  D: "#EE8100",
  E: "#E63E11",
};
