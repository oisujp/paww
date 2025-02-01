import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function ResetPasswordSuccess() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center p-6 gap-6">
      <Text>パスワードリセットのメールを送信しました。</Text>
      <Button onPress={() => router.replace("/")}>
        <Text>戻る</Text>
      </Button>
    </View>
  );
}
