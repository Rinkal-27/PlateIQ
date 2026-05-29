import { Text, View } from "react-native";
import { DecoderMatch } from "@/services/ingredientDecoder";

const TONE = {
  info: { bg: "bg-info/15", dot: "bg-info", text: "text-info" },
  caution: { bg: "bg-warn/15", dot: "bg-warn", text: "text-warn" },
  bad: { bg: "bg-bad/15", dot: "bg-bad", text: "text-bad" },
};

export function IngredientChip({ m }: { m: DecoderMatch }) {
  const t = TONE[m.entry.severity];
  return (
    <View className={`${t.bg} rounded-xl p-3 mb-2`}>
      <View className="flex-row items-center">
        <View className={`${t.dot} w-2 h-2 rounded-full mr-2`} />
        <Text className={`${t.text} font-bold flex-1`}>{m.entry.display}</Text>
      </View>
      <Text className="text-muted text-xs mt-1">{m.entry.explain}</Text>
    </View>
  );
}
