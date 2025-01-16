import AntDesign from "@expo/vector-icons/AntDesign";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { Button } from "~/components/ui/button";
import { AuthContext } from "~/contexts/auth-context";

export default function AppLayout() {
  const { session } = useContext(AuthContext);
  if (!session) {
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
          headerRight: () => (
            <Button variant="ghost" onPress={() => {}} className="-mr-4">
              <AntDesign name="close" size={18} color="black" />
            </Button>
          ),
        }}
      />
    </Stack>
  );
}
