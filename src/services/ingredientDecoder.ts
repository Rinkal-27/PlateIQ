import { INGREDIENT_DB, IngredientEntry, Severity } from "@/data/ingredients";

export interface DecoderMatch {
  entry: IngredientEntry;
  /** the raw substring as it appeared on the label */
  hit: string;
}

export interface DecoderReport {
  /** the deduplicated matched ingredients */
  matches: DecoderMatch[];
  /** 0–100 — higher = cleaner ingredients */
  cleanScore: number;
  /** human-readable verdict: "Clean", "Okay", "Highly Processed" */
  verdict: string;
  /** counts by severity for quick UI badges */
  counts: Record<Severity, number>;
}

/**
 * Scan a raw ingredients string (from OCR or OFF) against the local DB.
 * Pure, deterministic, runs on the JS thread — no network, no LLM.
 */
export function decodeIngredients(rawText: string): DecoderReport {
  const text = rawText.toLowerCase();
  const seen = new Set<string>();
  const matches: DecoderMatch[] = [];

  for (const entry of INGREDIENT_DB) {
    for (const alias of entry.aliases) {
      // word-boundary-ish guard so "soy" doesn't match "soybean oil" twice
      const idx = text.indexOf(alias);
      if (idx === -1) continue;
      if (seen.has(entry.id)) break;
      seen.add(entry.id);
      matches.push({ entry, hit: alias });
      break;
    }
  }

  const counts: Record<Severity, number> = { info: 0, caution: 0, bad: 0 };
  for (const m of matches) counts[m.entry.severity]++;

  // simple deterministic scoring — each "bad" −15, each "caution" −7, "info" 0
  const penalty = counts.bad * 15 + counts.caution * 7;
  const cleanScore = Math.max(0, Math.min(100, 100 - penalty));

  const verdict =
    cleanScore >= 80 ? "Clean" :
    cleanScore >= 55 ? "Okay" :
    cleanScore >= 30 ? "Highly Processed" : "Avoid";

  return { matches, cleanScore, verdict, counts };
}
