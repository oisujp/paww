import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function ResetPasswordSuccess() {
  const router = useRouter();

  return (
    <View className="flex flex-1 w-full">
      <Text>パスワードリセットのメールを送信しました。</Text>
      <View>
        <Button
          onPress={() => router.replace("/(app)/home/pass-templates")}
          className="flex w-full"
        >
          <Text>戻る</Text>
        </Button>
      </View>
    </View>
  );
}
