import { Stack } from "expo-router";
import { Platform } from "react-native";
import { HeaderBackButton } from "~/components/header-back-button";
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
          title: "色を選択",
          presentation: "formSheet",
          gestureDirection: "vertical",
          animation: "slide_from_bottom",
          sheetGrabberVisible: true,
          sheetInitialDetentIndex: 0,
          sheetAllowedDetents: [0.5],
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="pick-sample-image"
        options={{
          title: "サンプル画像を選択",
          ...Platform.select({
            ios: {
              presentation: "formSheet",
              gestureDirection: "vertical",
              animation: "slide_from_bottom",
              sheetGrabberVisible: true,
              sheetInitialDetentIndex: 0,
              sheetAllowedDetents: [0.8],
              gestureEnabled: true,
            },
            android: {},
          }),
        }}
      />
    </Stack>
  );
}
