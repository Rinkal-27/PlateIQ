import { Pressable, ScrollView, Text, View } from "react-native";
import { DIETS } from "@/data/dietaryRules";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui";

export default function Settings() {
  const diets = useStore((s) => s.diets);
  const toggle = useStore((s) => s.toggleDiet);

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-muted mb-3">
        Toggle the diets you care about. PlateIQ will flag any scanned product that conflicts.
      </Text>
      <Card>
        {DIETS.map((d, i) => {
          const on = diets.includes(d.id);
          return (
            <Pressable
              key={d.id}
              onPress={() => toggle(d.id)}
              className={`flex-row items-center py-3 ${i > 0 ? "border-t border-line" : ""}`}
            >
              <Text className="text-2xl mr-3">{d.emoji}</Text>
              <Text className="text-text font-semibold flex-1">{d.label}</Text>
              <View
                className={`w-12 h-7 rounded-full justify-center ${on ? "bg-brand" : "bg-line"}`}
              >
                <View
                  className={`w-5 h-5 bg-white rounded-full mx-1 ${on ? "self-end" : "self-start"}`}
                />
              </View>
            </Pressable>
          );
        })}
      </Card>

      <Text className="text-muted text-xs mt-6">
        PlateIQ runs 100% on-device. Barcodes are looked up against the public Open Food Facts
        database. No accounts. No tracking. No paid APIs.
      </Text>
    </ScrollView>
  );
}
