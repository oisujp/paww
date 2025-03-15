import { Stack } from "expo-router";
import { HeaderBackButton } from "~/components/header-back-button";
import { HeaderCloseButton } from "~/components/header-close-button";
import { contentStyle, headerStyle } from "~/lib/constants";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle,
        contentStyle,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "テンプレートを作成",
          headerLeft: HeaderBackButton,
        }}
      />
      <Stack.Screen
        name="preview-pass-template"
        options={{
          title: "テンプレートのプレビュー",
          headerLeft: HeaderBackButton,
        }}
      />
      <Stack.Screen
        name="pick-color"
        options={{
          presentation: "modal",
          title: "色を選択",
          headerStyle: { backgroundColor: "white" },
          headerRight: HeaderCloseButton,
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="pick-sample-image"
        options={{
          presentation: "modal",
          title: "サンプル画像を選択",
          headerStyle: { backgroundColor: "white" },
          headerRight: HeaderCloseButton,
          contentStyle: { backgroundColor: "white" },
        }}
      />
    </Stack>
  );
}
