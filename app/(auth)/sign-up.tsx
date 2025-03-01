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

  useEffect(() => {
    if (session) {
      router.replace("/home/pass-templates");
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
          <Text className="text-sm text-destructive">
            <ErrorMessage errors={errors} name="email" />
          </Text>
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
          <Text className="text-sm text-destructive">
            <ErrorMessage errors={errors} name="password" />
          </Text>
        </View>

        <View className="flex gap-2 my-4">
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            className="flex flex-row gap-2"
          >
            {loading && <ActivityIndicator className="text-white" />}
            <Text>新規登録</Text>
          </Button>

          <Button
            variant="ghost"
            onPress={() => router.replace("/(auth)/sign-in")}
          >
            <Text>すでにアカウントをお持ちの方</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
