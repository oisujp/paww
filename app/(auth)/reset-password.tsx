import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useContext } from "react";
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
      router.navigate("/reset-password-success");
    } catch (error) {
      Alert.alert("error", String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Card className="w-full max-w-sm p-6 rounded-2xl">
        <CardTitle className="pb-2 text-center">パスワードをリセット</CardTitle>
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
          </View>
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            className="flex flex-row gap-2"
          >
            {loading && (
              <ActivityIndicator className={cn(!loading && "hidden")} />
            )}
            <Text>リセットする</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
