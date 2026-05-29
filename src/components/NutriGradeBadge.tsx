import { Text, View } from "react-native";
import { NutriGrade, GRADE_COLOR } from "@/services/nutriScore";

export function NutriGradeBadge({ grade, size = 56 }: { grade: NutriGrade; size?: number }) {
  return (
    <View
      style={{ width: size, height: size, backgroundColor: GRADE_COLOR[grade] }}
      className="rounded-full items-center justify-center"
    >
      <Text className="text-white font-extrabold" style={{ fontSize: size * 0.5 }}>
        {grade}
      </Text>
    </View>
  );
}
