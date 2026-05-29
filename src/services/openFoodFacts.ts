/**
 * Open Food Facts — free, open, no API key. Used for barcode → product lookup.
 * Docs: https://world.openfoodfacts.org/data
 */
export interface OFFProduct {
  code: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  ingredientsText?: string;
  nutriments?: {
    energyKcal100g?: number;
    sugars100g?: number;
    saturatedFat100g?: number;
    salt100g?: number;
    fiber100g?: number;
    proteins100g?: number;
    fruitsVegNuts100g?: number;
  };
  novaGroup?: number; // 1 unprocessed → 4 ultra-processed
  ecoscoreGrade?: string;
}

const BASE = "https://world.openfoodfacts.org/api/v2/product";

export async function fetchProductByBarcode(barcode: string): Promise<OFFProduct | null> {
  // ask only for the fields we need — keeps payload tiny on slow networks
  const fields = [
    "code", "product_name", "brands", "image_front_small_url",
    "ingredients_text_en", "ingredients_text",
    "nutriments", "nova_group", "ecoscore_grade",
  ].join(",");

  const url = `${BASE}/${encodeURIComponent(barcode)}?fields=${fields}`;
  const res = await fetch(url, { headers: { "User-Agent": "PlateIQ/0.1 (on-device)" } });
  if (!res.ok) return null;

  const json = (await res.json()) as { status: number; product?: any };
  if (json.status !== 1 || !json.product) return null;

  const p = json.product;
  const n = p.nutriments ?? {};
  return {
    code: p.code,
    name: p.product_name || "Unknown product",
    brand: p.brands,
    imageUrl: p.image_front_small_url,
    ingredientsText: p.ingredients_text_en || p.ingredients_text,
    nutriments: {
      energyKcal100g: n["energy-kcal_100g"],
      sugars100g: n.sugars_100g,
      saturatedFat100g: n["saturated-fat_100g"],
      salt100g: n.salt_100g,
      fiber100g: n.fiber_100g,
      proteins100g: n.proteins_100g,
      fruitsVegNuts100g: n["fruits-vegetables-nuts-estimate-from-ingredients_100g"],
    },
    novaGroup: p.nova_group,
    ecoscoreGrade: p.ecoscore_grade,
  };
}
