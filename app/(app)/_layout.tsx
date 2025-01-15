import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useNavigation } from "expo-router";
import { useContext } from "react";
import { Button } from "~/components/ui/button";
import { AuthContext } from "~/contexts/auth-context";

export default function AppLayout() {
  const { session } = useContext(AuthContext);
  const navigation = useNavigation();

  if (session) {
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

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
    </Stack>
  );
}
