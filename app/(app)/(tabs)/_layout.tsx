import PassIcon from "assets/images/pass-tab.svg";
import StoreIcon from "assets/images/store-tab.svg";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { Pressable } from "react-native";
import { themeColors } from "~/lib/constants";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        headerShown: false,
      }}
    >
      {/* workaround:  */}
      {/* https://github.com/expo/router/issues/763#issuecomment-1951429388 */}
      <Tabs.Screen redirect name="index" />
      <Tabs.Screen
        name="home"
        options={{
          title: "パス",
          tabBarIcon: ({ color }) => (
            <PassIcon className="size-6" color={color} />
          ),
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={(event) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                props.onPress?.(event);
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: "お店情報",
          tabBarIcon: ({ color }) => (
            <StoreIcon className="size-6" color={color} />
          ),
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={(event) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                props.onPress?.(event);
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
