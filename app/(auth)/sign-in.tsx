import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "assets/images/logo.svg";
import { useNavigation, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, SafeAreaView, View } from "react-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { NavigationContext } from "~/contexts/navigation-context";
import { logger } from "~/lib/utils";

type FormData = {
  email: string;
  password: string;
};

const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力してください。" })
    .email("メールアドレスの形式ではありません。"),
  password: z
    .string()
    .min(6, { message: "パスワードは6文字以上で入力してください。" }),
});

export default function SignIn() {
  const navigation = useNavigation();
  const { signIn, session } = useContext(AuthContext);
  const { loading, setLoading } = useContext(NavigationContext);
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "oisuoisu@gmail.com",
      password: "pikachu",
    },
  });
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      await signIn(data.email, data.password);
    } catch (error) {
      logger.error(error);
      Alert.alert("エラー", "ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      router.replace("/(app)/(tabs)");
    }
  }, [session, router]);

  return (
    <SafeAreaView className="flex flex-1 bg-background">
      <View className="top-[55px] flex items-center">
        <Logo className="w-[167px] h-[44px]" />
      </View>

      <View className="w-full flex flex-1 justify-center p-6">
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="gap-2">
              <Label nativeID="email">メールアドレス</Label>
              <Input
                placeholder="メールアドレス"
                inputMode="email"
                autoCorrect={false}
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="email"
        />
        <View className="min-h-4">
          {errors && (
            <Text className="text-sm text-destructive">
              <ErrorMessage errors={errors} name="email" />
            </Text>
          )}
        </View>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="gap-2">
              <Label nativeID="password">パスワード</Label>
              <Input
                placeholder="パスワード"
                inputMode="text"
                secureTextEntry
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              <Text className="text-sm">半角英数字6文字以上</Text>
            </View>
          )}
          name="password"
        />
        <View className="min-h-4">
          {errors && (
            <Text className="text-sm text-destructive">
              <ErrorMessage errors={errors} name="password" />
            </Text>
          )}
        </View>

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className="flex flex-row gap-2"
        >
          {loading && <ActivityIndicator className="text-white" />}
          <Text>ログイン</Text>
        </Button>

        <View className="flex flex-row justify-center my-4 items-center">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.push({ pathname: "/(auth)/sign-up" })}
          >
            <Text>新規登録</Text>
          </Button>
          <Text>/</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.push("/(auth)/reset-password")}
          >
            <Text>ログインできないときはこちら</Text>
          </Button>
          <Text>/</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.push("/debug")}
          >
            <Text>デバッグ</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
