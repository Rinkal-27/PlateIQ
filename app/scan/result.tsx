import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Card, Pill } from "@/components/ui";
import { ScoreRing } from "@/components/ScoreRing";
import { NutriGradeBadge } from "@/components/NutriGradeBadge";
import { IngredientChip } from "@/components/IngredientChip";
import { DietBadge } from "@/components/DietBadge";

import { fetchProductByBarcode, OFFProduct } from "@/services/openFoodFacts";
import { decodeIngredients, DecoderReport } from "@/services/ingredientDecoder";
import { computeNutriScore, NutriResult } from "@/services/nutriScore";
import { recognizeLabel } from "@/services/ocr";
import { analysePlate, PlateAnalysis } from "@/services/plateRecognition";
import { evaluateDiets } from "@/data/dietaryRules";
import { useStore } from "@/store/useStore";

type Mode = "barcode" | "label" | "plate";

interface State {
  loading: boolean;
  error?: string;
  product?: OFFProduct;
  decoder?: DecoderReport;
  nutri?: NutriResult;
  plate?: PlateAnalysis;
  imageUri?: string;
}

export default function Result() {
  const { mode, barcode, uri } = useLocalSearchParams<{
    mode: Mode;
    barcode?: string;
    uri?: string;
  }>();
  const diets = useStore((s) => s.diets);
  const push = useStore((s) => s.pushHistory);
  const [s, set] = useState<State>({ loading: true });

  useEffect(() => {
    (async () => {
      try {
        if (mode === "barcode" && barcode) {
          const product = await fetchProductByBarcode(barcode);
          if (!product) throw new Error("Product not found in Open Food Facts.");
          const decoder = decodeIngredients(product.ingredientsText ?? "");
          const n = product.nutriments ?? {};
          const nutri = computeNutriScore({
            kcal: n.energyKcal100g,
            sugars: n.sugars100g,
            saturatedFat: n.saturatedFat100g,
            salt: n.salt100g,
            fiber: n.fiber100g,
            protein: n.proteins100g,
            fruitVegNuts: n.fruitsVegNuts100g,
          });
          set({ loading: false, product, decoder, nutri, imageUri: product.imageUrl });
          push({
            id: `${Date.now()}`,
            ts: Date.now(),
            kind: "barcode",
            title: product.name,
            subtitle: `${product.brand ?? ""} · Nutri-Score ${nutri.grade}`,
            scorePct: decoder.cleanScore,
            imageUri: product.imageUrl,
          });
        } else if (mode === "label" && uri) {
          const text = await recognizeLabel(uri);
          const decoder = decodeIngredients(text);
          set({ loading: false, decoder, imageUri: uri });
          push({
            id: `${Date.now()}`,
            ts: Date.now(),
            kind: "label",
            title: "Scanned label",
            subtitle: `${decoder.matches.length} ingredients flagged · ${decoder.verdict}`,
            scorePct: decoder.cleanScore,
            imageUri: uri,
          });
        } else if (mode === "plate" && uri) {
          const plate = await analysePlate(uri);
          set({ loading: false, plate, imageUri: uri });
          push({
            id: `${Date.now()}`,
            ts: Date.now(),
            kind: "plate",
            title: plate.items.map((i) => i.label).join(", ") || "Plate",
            subtitle: `${plate.totalKcal} kcal · ${plate.totalProtein}g protein`,
            imageUri: uri,
          });
        } else {
          throw new Error("Missing scan input.");
        }
      } catch (e: any) {
        set({ loading: false, error: e?.message ?? "Something went wrong." });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (s.loading) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator color="#4ADE80" />
        <Text className="text-muted mt-3">Analysing on-device…</Text>
      </View>
    );
  }
  if (s.error) {
    return (
      <View className="flex-1 bg-bg items-center justify-center p-6">
        <Text className="text-bad font-bold text-lg">Could not analyse</Text>
        <Text className="text-muted text-center mt-2">{s.error}</Text>
      </View>
    );
  }

  const matchedIds = s.decoder?.matches.map((m) => m.entry.id) ?? [];
  const verdicts = evaluateDiets(matchedIds, diets);

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      {s.imageUri ? (
        <Image
          source={{ uri: s.imageUri }}
          style={{ width: "100%", height: 200, borderRadius: 16, marginBottom: 12 }}
          resizeMode="cover"
        />
      ) : null}

      {s.product && (
        <Card className="mb-3">
          <Text className="text-text text-xl font-extrabold">{s.product.name}</Text>
          {s.product.brand ? <Text className="text-muted">{s.product.brand}</Text> : null}
          <View className="flex-row mt-3">
            {typeof s.product.novaGroup === "number" && (
              <View className="mr-2">
                <Pill
                  tone={s.product.novaGroup >= 4 ? "bad" : s.product.novaGroup >= 3 ? "warn" : "good"}
                  label={`NOVA ${s.product.novaGroup} · ${
                    s.product.novaGroup === 4 ? "Ultra-processed" :
                    s.product.novaGroup === 3 ? "Processed" :
                    s.product.novaGroup === 2 ? "Culinary" : "Whole food"
                  }`}
                />
              </View>
            )}
            {s.product.ecoscoreGrade && (
              <Pill tone="info" label={`Eco ${s.product.ecoscoreGrade.toUpperCase()}`} />
            )}
          </View>
        </Card>
      )}

      {(s.decoder || s.nutri) && (
        <Card className="mb-3">
          <View className="flex-row items-center justify-around">
            {s.decoder && (
              <View className="items-center">
                <ScoreRing
                  value={s.decoder.cleanScore}
                  label="Clean"
                  color={s.decoder.cleanScore >= 70 ? "#22C55E" : s.decoder.cleanScore >= 40 ? "#F59E0B" : "#EF4444"}
                />
                <Text className="text-text mt-1 font-semibold">{s.decoder.verdict}</Text>
              </View>
            )}
            {s.nutri && (
              <View className="items-center">
                <NutriGradeBadge grade={s.nutri.grade} size={88} />
                <Text className="text-muted mt-2 text-xs">Nutri-Score</Text>
              </View>
            )}
          </View>
        </Card>
      )}

      {verdicts.length > 0 && (
        <>
          <Text className="text-text font-bold text-lg mb-2">Dietary fit</Text>
          <View className="flex-row flex-wrap mb-3">
            {verdicts.map((v) => (
              <DietBadge key={v.diet.id} v={v} />
            ))}
          </View>
        </>
      )}

      {s.decoder && s.decoder.matches.length > 0 && (
        <>
          <Text className="text-text font-bold text-lg mb-2">Decoded ingredients</Text>
          {s.decoder.matches.map((m) => (
            <IngredientChip key={m.entry.id} m={m} />
          ))}
        </>
      )}

      {s.decoder && s.decoder.matches.length === 0 && (
        <Card>
          <Text className="text-good font-bold">✓ No flagged ingredients</Text>
          <Text className="text-muted text-xs mt-1">
            Nothing in our database of additives, hidden sugars, trans-fats or allergens matched.
          </Text>
        </Card>
      )}

      {s.plate && (
        <>
          <Card className="mb-3">
            <Text className="text-text font-bold text-lg mb-2">Plate breakdown</Text>
            <Text className="text-text text-3xl font-extrabold">{s.plate.totalKcal} kcal</Text>
            <View className="flex-row justify-between mt-3">
              <Macro label="Protein" value={`${s.plate.totalProtein.toFixed(1)}g`} />
              <Macro label="Carbs" value={`${s.plate.totalCarbs.toFixed(1)}g`} />
              <Macro label="Fat" value={`${s.plate.totalFat.toFixed(1)}g`} />
              <Macro label="Fiber" value={`${s.plate.totalFiber.toFixed(1)}g`} />
            </View>
          </Card>
          <Text className="text-text font-bold text-lg mb-2">Items detected</Text>
          {s.plate.items.length === 0 ? (
            <Card>
              <Text className="text-muted">
                Couldn't confidently identify a food. Try a clearer top-down photo.
              </Text>
            </Card>
          ) : (
            s.plate.items.map((it) => (
              <Card key={it.label} className="mb-2">
                <View className="flex-row justify-between">
                  <Text className="text-text font-bold capitalize">{it.label}</Text>
                  <Text className="text-muted text-xs">
                    {Math.round(it.confidence * 100)}% match
                  </Text>
                </View>
                <Text className="text-muted text-xs mt-1">
                  ~{it.servingG}g · {it.macros.kcal} kcal · P {it.macros.protein}g · C {it.macros.carbs}g · F {it.macros.fat}g
                </Text>
              </Card>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <View className="items-center">
      <Text className="text-text font-bold">{value}</Text>
      <Text className="text-muted text-[10px] uppercase tracking-wider mt-0.5">{label}</Text>
    </View>
  );
}
