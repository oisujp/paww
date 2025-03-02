import { Stack, useRouter } from "expo-router";
import React from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function AuxLayout() {
  const router = useRouter();
  return (
    <Stack screenOptions={{ headerBackTitle: "戻る" }}>
      <Stack.Screen
        name="debug"
        options={{
          headerLeft: () => (
            <Button variant="link" onPress={() => router.back()}>
              <Text>戻る</Text>
            </Button>
          ),
        }}
      />
      <Stack.Screen name="license" />
    </Stack>
  );
}
