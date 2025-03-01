import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Redirect, useRouter } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { supabase } from "~/lib/supabase";

export default function ConfirmEmail() {
  const { signOut, session, createSessionFromUrl } = useContext(AuthContext);
  const router = useRouter();

  const url = Linking.useURL();
  if (url) {
    createSessionFromUrl(url);
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (session) {
    (async () => {
      const userId = session.user.id;
      await supabase.from("users").insert({ id: userId });
      return <Redirect href="/(app)/home/pass-templates" />;
    })();
  }

  return (
    <View className="flex-1 justify-center items-center p-6 gap-4">
      <Image
        source={require("assets/images/mail.svg")}
        className="w-[71px] h-[60px]"
      />
      <Text className="text-center text-xl font-bold">
        確認メールを送信しました
      </Text>
      <Text className="font-bold">まだ登録は完了しておりません。</Text>
      <Text className="text-center">
        ご入力いただいたメールアドレスにメールアドレスの認証メールを送信しました。メールに記載されている認証リンクをクリックしてください。
      </Text>
      <Button
        className="w-full my-4"
        onPress={() => {
          signOut();
          router.replace("/sign-in");
        }}
      >
        <Text>ログイン画面に戻る</Text>
      </Button>
    </View>
  );
}
