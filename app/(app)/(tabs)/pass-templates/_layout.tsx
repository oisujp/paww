import { Stack } from "expo-router";
import { Menu } from "~/components/menu";

export default function PassTemplatesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: "テンプレート一覧",
          headerRight: () => {
            return <Menu />;
          },
        }}
      />
      <Stack.Screen
        name="new-template"
        options={{
          title: "テンプレートを作成",
        }}
      />
      <Stack.Screen
        name="passes"
        options={{
          title: "発行済みパス一覧",
        }}
      />
      <Stack.Screen
        name="pass"
        options={{
          title: "発行済みパス詳細",
        }}
      />
    </Stack>
  );
}
