import { zodResolver } from "@hookform/resolvers/zod";
import { useUpsertMutation } from "@supabase-cache-helpers/postgrest-swr";
import { getTime } from "date-fns";
import { Image } from "expo-image";
import { useContext } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, View } from "react-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { NavigationContext } from "~/contexts/navigation-context";
import { supabase, uploadImage } from "~/lib/supabase";
import { logger, pickImage } from "~/lib/utils";

type FormData = {
  organizationName: string;
  logoUrl: string;
};

const signUpSchema = z.object({
  organizationName: z.string(),
  logoUrl: z.string(),
});

export default function Store() {
  const { setUser, user } = useContext(AuthContext);
  const { loading, setLoading } = useContext(NavigationContext);

  const { trigger: upsert } = useUpsertMutation(
    supabase.from("users"),
    ["id"],
    "*"
  );

  const { control, handleSubmit, watch, setValue } = useForm<
    z.infer<typeof signUpSchema>
  >({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      organizationName: user?.name ?? "",
      logoUrl: user?.logoUrl ?? "",
    },
  });

  if (!user) {
    return null;
  }

  // iOS: logo.png 160x50
  // https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Creating.html
  const pickLogo = async () => {
    const logoBase64 = await pickImage(160, 50);
    if (logoBase64) {
      const path = `${user.id}/user/logo-${getTime(new Date())}.png`;
      await uploadImage(logoBase64, path);
      const logoUrl = supabase.storage.from("images").getPublicUrl(path)
        .data.publicUrl;
      setValue("logoUrl", logoUrl);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    setLoading(true);

    try {
      const { organizationName, logoUrl } = formData;

      // upsert user
      const res = await upsert([
        {
          id: user.id,
          name: organizationName,
          logoUrl,
        },
      ]);
      if (res === null) {
        throw "";
      } else if (res.length > 0) {
        setUser(res[0]);
      }
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerClassName="flex-1 items-center justify-between p-6 bg-background">
        <View className="grid gap-6 w-full">
          <View className="grid gap-2">
            <Label>お店のロゴ</Label>
            <Image
              className="h-16 my-8"
              contentFit="contain"
              source={watch("logoUrl")}
            />
            <Button variant="outline" onPress={pickLogo}>
              <Text>画像を選択</Text>
            </Button>
          </View>

          <View className="grid gap-2">
            <Label>お店の名前</Label>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="お店の名前"
                  autoCorrect={false}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="organizationName"
            />
          </View>
        </View>

        <View className="w-full gap-4">
          <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
            <Text>保存</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
