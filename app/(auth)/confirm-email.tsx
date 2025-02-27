import * as Linking from "expo-linking";
import { Redirect, useRouter } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";

export default function ConfirmEmail() {
  const { session, createSessionFromUrl } = useContext(AuthContext);
  const router = useRouter();

  const url = Linking.useURL();
  if (url) {
    createSessionFromUrl(url);
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/(app)/home/pass-templates" />;
  }

  return (
    <View className="flex-1 justify-center p-6 gap-6">
      <Text className="text-center">
        メールアドレスに確認メールを送信しました。
      </Text>
      <Button onPress={() => router.replace("/sign-in")}>
        <Text>戻る</Text>
      </Button>
    </View>
  );
}
