import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useNavigation, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, SafeAreaView, View } from "react-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { NavigationContext } from "~/contexts/navigation-context";
import { cn } from "~/lib/utils";

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
      Alert.alert("error", String(error));
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
        <Image
          source={require("../../assets/images/logo.svg")}
          className="w-[167px] h-[44px]"
        />
      </View>

      <View className="w-full flex flex-1 justify-center p-6">
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="メールアドレス"
              inputMode="email"
              autoCorrect={false}
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
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
            <Input
              placeholder="パスワード"
              inputMode="text"
              secureTextEntry
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
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
          {loading && (
            <ActivityIndicator className={cn(!loading && "hidden")} />
          )}
          <Text>ログイン</Text>
        </Button>

        <View className="my-4">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.replace("/(auth)/sign-up")}
          >
            <Text>新規登録はこちら</Text>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.push("/(auth)/reset-password")}
          >
            <Text>ログインできないときはこちら</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
