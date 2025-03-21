import { Stack } from "expo-router";
import { HeaderBackButton } from "~/components/header-back-button";
import { Settings } from "~/components/settings";
import { contentStyle, headerStyle } from "~/lib/constants";

export default function PassTemplatesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle,
        contentStyle,
      }}
    >
      <Stack.Screen
        name="pass-templates"
        options={{
          title: "テンプレート一覧",
          headerRight: () => <Settings />,
        }}
      />
      <Stack.Screen
        name="pass"
        options={{
          title: "配布済みパス詳細",
          headerLeft: HeaderBackButton,
        }}
      />
      <Stack.Screen
        name="delivery-pass"
        options={{
          title: "パスの配布",
        }}
      />
      <Stack.Screen
        name="passes"
        options={{
          title: "配布済みパス一覧",
          headerLeft: HeaderBackButton,
        }}
      />
    </Stack>
  );
}
