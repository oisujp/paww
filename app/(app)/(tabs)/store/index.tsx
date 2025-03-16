import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useQuery,
  useUpsertMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import StorePlaceholder from "assets/images/store-placeholder.svg";
import { getTime } from "date-fns";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Share } from "lucide-react-native";
import { useContext, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import { z } from "zod";
import { CaveatView } from "~/components/caveat-view";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { NavigationContext } from "~/contexts/navigation-context";
import { themeColors } from "~/lib/constants";
import { supabase, uploadImage } from "~/lib/supabase";
import { logger, pickImage } from "~/lib/utils";

type FormData = {
  organizationName: string;
  logoUrl: string;
  noLogoText: boolean;
};

const storeSchema = z.object({
  organizationName: z
    .string()
    .min(1, { message: "お店の名前を入力してください。" })
    .max(20, { message: "20文字以内で入力してください" }),
  logoUrl: z.string(),
  noLogoText: z.boolean(),
});

export default function StoreIndex() {
  const { session } = useContext(AuthContext);
  const { loading, setLoading } = useContext(NavigationContext);
  const [uploading, setUploading] = useState(false);
  const userId = session?.user.id ?? "";

  const { trigger: upsert } = useUpsertMutation(
    supabase.from("users"),
    ["id"],
    "*"
  );

  const { data: userData } = useQuery(
    supabase.from("users").select().eq("id", userId).single()
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof storeSchema>>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      organizationName: userData?.name ?? "",
      logoUrl: userData?.logoUrl ?? "",
      noLogoText: !userData?.logoText,
    },
  });

  // iOS: logo.png 160x50
  // https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Creating.html
  const pickLogo = async () => {
    try {
      const logoBase64 = await pickImage(undefined, 105);
      if (logoBase64) {
        setUploading(true);

        const path = `${userId}/user/logo-${getTime(new Date())}.png`;
        await uploadImage(logoBase64, path);

        const logoUrl = supabase.storage.from("images").getPublicUrl(path)
          .data.publicUrl;
        setValue("logoUrl", logoUrl);
      }
    } catch (error) {
      logger.error(error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    setLoading(true);

    try {
      const { organizationName, logoUrl, noLogoText } = formData;
      // upsert user
      const res = await upsert([
        {
          id: userId,
          name: organizationName,
          logoUrl,
          logoText: noLogoText ? undefined : organizationName,
        },
      ]);
      if (res === null) {
        throw "";
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.navigate("/home/pass-templates");
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex flex-1">
      <ScrollView>
        <View className="gap-6 w-full my-6 bg-background p-6 flex-1">
          <View className="grid gap-2">
            <Label>お店のロゴ</Label>
            <View className="flex my-8">
              {uploading ? (
                <View className="my-5">
                  <ActivityIndicator />
                </View>
              ) : watch("logoUrl") ? (
                <Image
                  className="h-16"
                  contentFit="contain"
                  source={watch("logoUrl")}
                />
              ) : (
                <View className="flex items-center">
                  <StorePlaceholder className="size-[108px]" />
                </View>
              )}
            </View>
            <Button
              variant="outline"
              onPress={pickLogo}
              className="rounded-lg flex flex-row text-primary gap-2"
            >
              <Share width={15} height={16} color={themeColors.primary} />
              <Text>画像を選択する</Text>
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
                  placeholder="お店の名前を入力してください"
                  autoCorrect={false}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="organizationName"
            />
            {Object.keys(errors).length > 0 && (
              <Text className="text-sm text-destructive">
                <ErrorMessage errors={errors} name="organizationName" />
              </Text>
            )}
          </View>

          <View className="grid gap-2">
            <Label>パスの表示設定</Label>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-row items-center w-full justify-between">
                  <Text>ロゴのみ表示する</Text>
                  <Switch
                    checked={!!value}
                    onCheckedChange={onChange}
                    nativeID="airplane-mode"
                  />
                </View>
              )}
              name="noLogoText"
            />
          </View>
        </View>
      </ScrollView>

      <View>
        <CaveatView text="登録した情報がデジタルパスに反映されます" />
        <View className="flex p-4 bg-white">
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            className="flex flex-row gap-2"
          >
            {loading && <ActivityIndicator className="text-white" />}
            <Text>保存する</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
