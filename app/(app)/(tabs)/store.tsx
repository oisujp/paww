import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Image, ScrollView, View } from "react-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { NavigationContext } from "~/contexts/navigation-context";
import { defaultImages } from "~/lib/constants";
import { supabase } from "~/lib/supabase";
import { cn, logger, pickImage } from "~/lib/utils";

type FormData = {
  organizationName: string;
  iconBase64: string;
  logoBase64: string;
};

const signUpSchema = z.object({
  organizationName: z.string(),
  iconBase64: z.string(),
  logoBase64: z.string(),
});

export default function UserProfile() {
  const { session, setUserProfile, userProfile } = useContext(AuthContext);
  const { loading, setLoading } = useContext(NavigationContext);

  const { control, handleSubmit, watch, setValue } = useForm<
    z.infer<typeof signUpSchema>
  >({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      organizationName: userProfile?.name,
      iconBase64: userProfile?.icon ?? defaultImages.iconBase64,
      logoBase64: userProfile?.logo ?? defaultImages.logoBase64,
    },
  });
  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const { organizationName, iconBase64, logoBase64 } = formData;
    const userId = session?.user.id;
    console.log({
      session,
    });
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .upsert(
          {
            user_id: userId,
            name: organizationName,
            icon_base64: iconBase64,
            logo_base64: logoBase64,
          },
          { onConflict: "user_id" }
        )
        .select()
        .single();
      console.log(data, error);
      setUserProfile(data);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pickIcon = async () => {
    const image = await pickImage(160, 50);
    if (image?.base64) {
      setValue("iconBase64", image.base64);
    }
  };

  return (
    <ScrollView>
      <View
        className={cn(
          "flex-1 justify-center items-center gap-5 p-6 bg-secondary/30"
        )}
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>お店情報</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
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

            <Label>お店のアイコン</Label>
            <Image
              className="w-16 h-16"
              source={{ uri: `data:image/png;base64,${watch("iconBase64")}` }}
            />
            <Button variant="secondary" onPress={pickIcon}>
              <Text>画像を選択</Text>
            </Button>

            <Label>お店のロゴ</Label>
            <Image
              className="w-full h-16"
              resizeMode="contain"
              source={{ uri: `data:image/png;base64,${watch("logoBase64")}` }}
            />
            <Button variant="secondary" onPress={pickIcon}>
              <Text>画像を選択</Text>
            </Button>
          </CardContent>
        </Card>

        <View className="w-full gap-4">
          <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
            <Text>保存</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
