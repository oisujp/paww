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
  password: string;
};

const changePasswordSchema = z.object({
  password: z.string().min(6, { message: "6文字以上で入力してください。" }),
});

export default function ChangePassword() {
  const { changePassword } = useContext(AuthContext);
  const { loading, setLoading } = useContext(NavigationContext);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "pikachu",
    },
  });
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      await changePassword(data.password);
      router.navigate("/change-password-success");
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
              <Label nativeID="password">新しいパスワード</Label>
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
        <Text className="text-sm text-destructive">
          <ErrorMessage errors={errors} name="password" />
        </Text>
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className="flex flex-row gap-2"
        >
          {loading && <ActivityIndicator className="text-white" />}
          <Text>変更する</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
