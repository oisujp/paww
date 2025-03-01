import { Stack } from "expo-router";

export default function PassTemplatesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "お店情報",
        }}
      />
    </Stack>
  );
}
