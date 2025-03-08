import { Stack } from "expo-router";
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
        name="index"
        options={{
          title: "お店情報",
        }}
      />
    </Stack>
  );
}
