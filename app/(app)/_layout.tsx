import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { HeaderBackButton } from "~/components/header-back-button";
import { AuthContext } from "~/contexts/auth-context";
import { contentStyle, headerStyle, themeColors } from "~/lib/constants";

export default function AppLayout() {
  const { session } = useContext(AuthContext);
  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerTintColor: themeColors.foreground,
        headerBackButtonDisplayMode: "minimal",
        headerStyle,
        contentStyle,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new-pass-template"
        options={{
          title: "テンプレートを作成",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(aux)/settings"
        options={{
          title: "設定",
          headerLeft: HeaderBackButton,
        }}
      />
      <Stack.Screen
        name="(aux)/debug"
        options={{
          title: "デバッグ",
          headerLeft: HeaderBackButton,
        }}
      />
      <Stack.Screen
        name="(aux)/license"
        options={{
          title: "ライセンス情報",
          headerLeft: HeaderBackButton,
        }}
      />
    </Stack>
  );
}
