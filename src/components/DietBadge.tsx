import { Pressable, Text, View } from "react-native";
import { DietVerdict } from "@/data/dietaryRules";

export function DietBadge({
  v,
  onPress,
}: {
  v: DietVerdict;
  onPress?: () => void;
}) {
  const tone = v.passes ? "bg-good/15 border-good/40" : "bg-bad/15 border-bad/40";
  const txt = v.passes ? "text-good" : "text-bad";
  return (
    <Pressable
      onPress={onPress}
      className={`${tone} border rounded-2xl px-3 py-2 mr-2 mb-2 flex-row items-center`}
    >
      <Text className="text-lg mr-1">{v.diet.emoji}</Text>
      <View>
        <Text className={`${txt} font-bold text-xs`}>{v.diet.label}</Text>
        <Text className={`${txt} text-[10px] opacity-80`}>
          {v.passes ? "Compatible" : `${v.reasons.length} conflict${v.reasons.length === 1 ? "" : "s"}`}
        </Text>
      </View>
    </Pressable>
  );
}
