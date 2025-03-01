import * as Clipboard from "expo-clipboard";
import { useContext } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { AuthContext } from "~/contexts/auth-context";

export default function Debug() {
  const { session } = useContext(AuthContext);

  return (
    <ScrollView className="flex flex-1 p-6">
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>🛠 Debug Screen</Text>

      {/* 環境変数の表示 */}
      <View className="flex gap-2">
        <Text style={{ marginTop: 10, fontWeight: "bold" }}>
          🌍 process.env
        </Text>

        <Text>{process.env.NODE_ENV}</Text>
        <Text>{process.env.EXPO_PUBLIC_SUPABASE_URL}</Text>
        <Text>{process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}</Text>
        <Text>{process.env.EXPO_PUBLIC_PAWW_BASE_URL}</Text>
      </View>

      <Button
        className="my-4"
        onPress={async () => {
          await Clipboard.setStringAsync(session?.access_token ?? "");
        }}
      >
        <Text>supabase token copy to clipboard</Text>
      </Button>

      {/* Supabase認証情報 */}
      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        🔑 Supabase Auth
      </Text>
      <Text>User: {JSON.stringify(session?.user, null, 2)}</Text>
      <Text>Session: {JSON.stringify(session, null, 2)}</Text>
    </ScrollView>
  );
}
