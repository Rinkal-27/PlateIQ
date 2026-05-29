import * as mobilenet from "@tensorflow-models/mobilenet";
import { loadImageTensor, ensureTf } from "./imageLoader";

import { FOOD_NUTRITION, FoodMacros, DEFAULT_SERVING_G } from "@/data/foodNutrition";

/**
 * On-device plate recognition.
 *
 * Strategy (free + offline-capable):
 *   1. MobileNet V2 (lightweight ImageNet classifier, runs in TFJS on the phone)
 *   2. Map predicted class labels → entries in our food-nutrition table
 *   3. Estimate macros for an assumed serving size
 *
 * For production accuracy you would swap MobileNet for a Food-101 / Recipe1M
 * fine-tuned model — same loader, just different weights. Kept generic so the
 * app stays 100% free with no model-licensing concerns.
 */
let modelPromise: Promise<mobilenet.MobileNet> | null = null;

async function getModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      await ensureTf();
      return mobilenet.load({ version: 2, alpha: 1.0 });
    })();
  }
  return modelPromise;
}

export interface PlateItem {
  label: string;        // the matched food name from our DB
  rawLabel: string;     // what MobileNet actually said
  confidence: number;   // 0..1
  servingG: number;
  macros: FoodMacros;   // already scaled to servingG
}

export interface PlateAnalysis {
  items: PlateItem[];
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
}

function matchToFood(rawLabel: string): { key: string; macros: FoodMacros } | null {
  const lower = rawLabel.toLowerCase();
  // exact alias hits first, then substring
  const keys = Object.keys(FOOD_NUTRITION);
  const exact = keys.find((k) => lower === k);
  if (exact) return { key: exact, macros: FOOD_NUTRITION[exact] };
  const sub = keys.find((k) => lower.includes(k) || k.includes(lower.split(",")[0].trim()));
  if (sub) return { key: sub, macros: FOOD_NUTRITION[sub] };
  return null;
}

function scaleMacros(m: FoodMacros, grams: number): FoodMacros {
  const f = grams / 100;
  return {
    kcal: Math.round(m.kcal * f),
    protein: +(m.protein * f).toFixed(1),
    carbs: +(m.carbs * f).toFixed(1),
    fat: +(m.fat * f).toFixed(1),
    fiber: +(m.fiber * f).toFixed(1),
  };
}

export async function analysePlate(imageUri: string): Promise<PlateAnalysis> {
  const model = await getModel();
  const imgTensor = await loadImageTensor(imageUri);

  try {
    const predictions = await model.classify(imgTensor, 5);
    const items: PlateItem[] = [];

    for (const p of predictions) {
      // mobilenet returns comma-separated synonyms like "cheeseburger" or "pizza, pizza pie"
      for (const part of p.className.split(",").map((s) => s.trim())) {
        const m = matchToFood(part);
        if (!m) continue;
        if (items.some((i) => i.label === m.key)) continue;
        items.push({
          label: m.key,
          rawLabel: p.className,
          confidence: p.probability,
          servingG: DEFAULT_SERVING_G,
          macros: scaleMacros(m.macros, DEFAULT_SERVING_G),
        });
        break;
      }
    }

    const totals = items.reduce(
      (acc, it) => {
        acc.totalKcal += it.macros.kcal;
        acc.totalProtein += it.macros.protein;
        acc.totalCarbs += it.macros.carbs;
        acc.totalFat += it.macros.fat;
        acc.totalFiber += it.macros.fiber;
        return acc;
      },
      { totalKcal: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, totalFiber: 0 },
    );

    return { items, ...totals };
  } finally {
    imgTensor.dispose();
  }
}
