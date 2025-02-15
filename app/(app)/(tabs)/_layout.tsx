import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      {/* workaround:  */}
      {/* https://github.com/expo/router/issues/763#issuecomment-1951429388 */}
      <Tabs.Screen redirect name="index" />
      <Tabs.Screen
        name="pass-templates"
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
