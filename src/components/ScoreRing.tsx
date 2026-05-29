import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  value: number; // 0..100
  size?: number;
  label?: string;
  color?: string;
}

export function ScoreRing({ value, size = 120, label, color = "#4ADE80" }: Props) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="#243047" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View className="absolute items-center">
        <Text className="text-text text-3xl font-bold">{Math.round(pct)}</Text>
        {label ? <Text className="text-muted text-xs mt-0.5">{label}</Text> : null}
      </View>
    </View>
  );
}
