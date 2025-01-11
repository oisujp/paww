import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";

type FormData = {
  email: string;
  password: string;
};

const signUpSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export default function SignIn() {
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);

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
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await signIn(data.email, data.password);
  };

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Card className="w-full max-w-sm p-6 rounded-2xl">
        <CardTitle className="pb-2 text-center">ログイン</CardTitle>
        <CardContent>
          <View className="flex gap-3 py-6">
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
          </View>
          <Button onPress={handleSubmit(onSubmit)}>
            <Text>ログイン</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
