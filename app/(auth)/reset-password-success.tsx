import { useRouter } from "expo-router";
import { useContext } from "react";
import { SafeAreaView, View } from "react-native";
import SuccessBlock from "~/components/success-block";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";

export default function ResetPasswordSuccess() {
  const { signOut } = useContext(AuthContext);
  const router = useRouter();

  return (
    <SafeAreaView className="flex flex-1 bg-background">
      <View className="flex flex-1 flex-col justify-center items-center p-6">
        <SuccessBlock
          caption="パスワードをリセットするためのメールを送信しました"
          description="メールに記載されているリンクをクリックしてください。"
        />
        <View className="w-full">
          <Button
            onPress={() => {
              signOut();
              router.replace("/sign-in");
            }}
          >
            <Text>ログイン画面に戻る</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
