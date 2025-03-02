import { Stack } from "expo-router";
import { BackButton } from "~/components/back-button";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "テンプレート一覧",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="preview-pass-template"
        options={{
          title: "テンプレートのプレビュー",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="pick-color"
        options={{
          presentation: "formSheet",
          gestureDirection: "vertical",
          animation: "slide_from_bottom",
          sheetGrabberVisible: true,
          sheetInitialDetentIndex: 0,
          sheetAllowedDetents: [0.5],
          headerTitle: "色を選択",
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
