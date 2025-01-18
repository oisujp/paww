import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "ホーム",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="coupon"
        options={{
          title: "パス",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="passport-biometric"
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: "お店情報",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="store" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
