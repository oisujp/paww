import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "~/contexts/auth-context";

export default function AppLayout() {
  const { session } = useContext(AuthContext);

  if (session === undefined) {
    return null;
  }

  if (session === null) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="new-template"
        options={{
          presentation: "modal",
          title: "新規テンプレート",
        }}
      />
      <Stack.Screen
        name="pass"
        options={{
          presentation: "modal",
          title: "パス",
        }}
      />
    </Stack>
  );
}
