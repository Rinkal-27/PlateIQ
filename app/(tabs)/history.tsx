import { ScrollView, Text, View } from "react-native";
import { Card, GhostButton } from "@/components/ui";
import { useStore } from "@/store/useStore";

export default function History() {
  const history = useStore((s) => s.history);
  const clear = useStore((s) => s.clearHistory);

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16 }}>
      {history.length === 0 ? (
        <Card>
          <Text className="text-muted">No scans yet.</Text>
        </Card>
      ) : (
        <>
          {history.map((h) => (
            <Card key={h.id} className="mb-2">
              <View className="flex-row justify-between">
                <Text className="text-text font-bold flex-1 pr-2">{h.title}</Text>
                {h.scorePct !== undefined && (
                  <Text className="text-brand font-bold">{Math.round(h.scorePct)}</Text>
                )}
              </View>
              {h.subtitle ? <Text className="text-muted text-xs mt-1">{h.subtitle}</Text> : null}
              <Text className="text-muted text-[10px] mt-1">
                {new Date(h.ts).toLocaleString()} · {h.kind}
              </Text>
            </Card>
          ))}
          <View className="mt-2">
            <GhostButton label="Clear history" onPress={clear} />
          </View>
        </>
      )}
    </ScrollView>
  );
}
