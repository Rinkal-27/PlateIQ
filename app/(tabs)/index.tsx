import { ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Card, GhostButton, PrimaryButton } from "@/components/ui";
import { useStore } from "@/store/useStore";
import { DIETS } from "@/data/dietaryRules";

export default function Home() {
  const router = useRouter();
  const diets = useStore((s) => s.diets);
  const history = useStore((s) => s.history);

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <LinearGradient
        colors={["#16A34A", "#0B1220"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-5 mb-5"
        style={{ borderRadius: 24 }}
      >
        <Text className="text-text/80 font-semibold">Welcome to</Text>
        <Text className="text-text text-3xl font-extrabold mt-1">PlateIQ</Text>
        <Text className="text-text/80 mt-2">
          Demystify any food label or plate — on your phone, in seconds, with zero data leaving your device.
        </Text>
      </LinearGradient>

      <Text className="text-text text-lg font-bold mb-3">Scan something</Text>

      <View className="gap-3">
        <PrimaryButton
          label="📷  Scan barcode"
          onPress={() => router.push({ pathname: "/scan/camera", params: { mode: "barcode" } })}
        />
        <GhostButton
          label="🧾  OCR an ingredient label"
          onPress={() => router.push({ pathname: "/scan/camera", params: { mode: "label" } })}
        />
        <GhostButton
          label="🍽️  Analyse my plate"
          onPress={() => router.push({ pathname: "/scan/camera", params: { mode: "plate" } })}
        />
      </View>

      <Text className="text-text text-lg font-bold mt-6 mb-3">Active dietary filters</Text>
      <Card>
        <View className="flex-row flex-wrap">
          {DIETS.filter((d) => diets.includes(d.id)).map((d) => (
            <View key={d.id} className="bg-brand/15 rounded-full px-3 py-1.5 mr-2 mb-2 flex-row items-center">
              <Text className="mr-1">{d.emoji}</Text>
              <Text className="text-brand text-xs font-semibold">{d.label}</Text>
            </View>
          ))}
          {diets.length === 0 && (
            <Text className="text-muted">No filters — set them in the Diet tab.</Text>
          )}
        </View>
      </Card>

      <Text className="text-text text-lg font-bold mt-6 mb-3">Recent scans</Text>
      {history.length === 0 ? (
        <Card>
          <Text className="text-muted">Nothing yet. Scan your first product or plate above.</Text>
        </Card>
      ) : (
        history.slice(0, 3).map((h) => (
          <Card key={h.id} className="mb-2">
            <Text className="text-text font-semibold">{h.title}</Text>
            {h.subtitle ? <Text className="text-muted text-xs mt-0.5">{h.subtitle}</Text> : null}
          </Card>
        ))
      )}
    </ScrollView>
  );
}
