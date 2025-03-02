import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useContext } from "react";
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
};

const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "入力してください。" })
    .email("メールアドレスの形式ではありません。"),
});

export default function ResetPassword() {
  const { resetPassword } = useContext(AuthContext);
  const { loading, setLoading } = useContext(NavigationContext);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "oisuoisu@gmail.com",
    },
  });
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      await resetPassword(data.email);
      router.replace("/reset-password-success");
    } catch (error) {
      Alert.alert("error", String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex flex-1 bg-background">
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
                placeholder="例: your.email@paww.jp"
                inputMode="email"
                autoCorrect={false}
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              <Text className="text-sm">半角英数字6文字以上</Text>
            </View>
          )}
          name="email"
        />
        <Text className="text-sm text-destructive">
          <ErrorMessage errors={errors} name="email" />
        </Text>

        <View className="flex gap-2 my-4">
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            className="flex flex-row gap-2"
          >
            {loading && <ActivityIndicator className="text-white" />}
            <Text>パスワードをリセットする</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
