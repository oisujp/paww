import { Stack } from "expo-router";
import { BackButton } from "~/components/back-button";
import { Settings } from "~/components/settings";

export default function PassTemplatesLayout() {
  return (
    <Stack>
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
          title: "発行済みパス詳細",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="delivery-pass"
        options={{
          title: "パスの発行",
        }}
      />
      <Stack.Screen
        name="passes"
        options={{
          title: "発行済みパス一覧",
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  );
}
