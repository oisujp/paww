import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, View } from "react-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { NavigationContext } from "~/contexts/navigation-context";
import { cn } from "~/lib/utils";

type FormData = {
  email: string;
  password: string;
};

const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "入力してください。" })
    .email("メールアドレスの形式ではありません。"),
  password: z.string().min(6, { message: "6文字以上で入力してください。" }),
});

export default function SignUp() {
  const navigation = useNavigation();
  const { signUp, session } = useContext(AuthContext);
  const { loading, setLoading } = useContext(NavigationContext);
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "oisuoisu@gmail.com",
      password: "pikachu",
    },
  });
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      await signUp(data.email, data.password);
      router.replace("/confirm-email");
    } catch (error) {
      Alert.alert("error", String(error));
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    router.replace("/(tabs)");
    return null;
  }

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Card className="w-full max-w-sm p-6 rounded-2xl">
        <CardTitle className="pb-2 text-center">新規登録</CardTitle>
        <CardContent>
          <View className="flex gap-2 py-6">
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
            <Text className="text-sm text-destructive">
              <ErrorMessage errors={errors} name="email" />
            </Text>

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
            <Text className="text-sm text-destructive">
              <ErrorMessage errors={errors} name="password" />
            </Text>
          </View>
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            className="flex flex-row gap-2"
          >
            {loading && (
              <ActivityIndicator className={cn(!loading && "hidden")} />
            )}
            <Text>新規登録</Text>
          </Button>

          <View className="my-4">
            <Button
              variant="ghost"
              onPress={() => router.replace("/(auth)/sign-in")}
            >
              <Text>すでにアカウントをお持ちの方はこちら</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
