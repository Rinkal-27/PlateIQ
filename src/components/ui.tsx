import { Pressable, Text, View } from "react-native";
import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <View className={`bg-card rounded-2xl p-4 border border-line ${className}`}>{children}</View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
}: {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-brand active:opacity-80 rounded-2xl px-5 py-4 flex-row items-center justify-center"
    >
      {icon}
      <Text className="text-bg font-bold text-base ml-2">{label}</Text>
    </Pressable>
  );
}

export function GhostButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="border border-line rounded-2xl px-5 py-4 items-center justify-center active:opacity-70"
    >
      <Text className="text-text font-medium">{label}</Text>
    </Pressable>
  );
}

export function Pill({
  label,
  tone = "info",
}: {
  label: string;
  tone?: "info" | "good" | "warn" | "bad";
}) {
  const map = {
    info: "bg-info/20 text-info",
    good: "bg-good/20 text-good",
    warn: "bg-warn/20 text-warn",
    bad: "bg-bad/20 text-bad",
  };
  return (
    <View className={`${map[tone].split(" ")[0]} rounded-full px-3 py-1 self-start`}>
      <Text className={`${map[tone].split(" ")[1]} text-xs font-semibold`}>{label}</Text>
    </View>
  );
}
