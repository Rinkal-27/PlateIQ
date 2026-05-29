import { Tabs } from "expo-router";
import { Text } from "react-native";

function Icon({ glyph, focused }: { glyph: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{glyph}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#0B1220" },
        headerTintColor: "#E6EDF7",
        headerTitleStyle: { fontWeight: "800" },
        tabBarStyle: { backgroundColor: "#0B1220", borderTopColor: "#243047" },
        tabBarActiveTintColor: "#4ADE80",
        tabBarInactiveTintColor: "#8A97AE",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "PlateIQ",
          tabBarLabel: "Scan",
          tabBarIcon: ({ focused }) => <Icon glyph="🔍" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ focused }) => <Icon glyph="🕘" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Diet Profile",
          tabBarLabel: "Diet",
          tabBarIcon: ({ focused }) => <Icon glyph="🥗" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
