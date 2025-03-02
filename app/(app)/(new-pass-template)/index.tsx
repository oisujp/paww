import { useActionSheet } from "@expo/react-native-action-sheet";
import { ErrorMessage } from "@hookform/error-message";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { getTime } from "date-fns";
import { useRouter } from "expo-router";
import { ExternalLink, Share } from "lucide-react-native";
import React, { useContext } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Image, SafeAreaView, ScrollView, View } from "react-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { NavigationContext } from "~/contexts/navigation-context";
import { themeColors } from "~/lib/constants";
import { supabase, uploadImage } from "~/lib/supabase";
import { cn, logger, pickImage } from "~/lib/utils";
import { passTemplateSchema } from "~/schemas";

export default function NewPassTemplateIndex() {
  const { session } = useContext(AuthContext);
  const { loading, setLoading } = useContext(NavigationContext);
  const router = useRouter();

  const userId = session?.user.id ?? "";

  const { control, watch, setValue, handleSubmit, formState } =
    useFormContext<z.infer<typeof passTemplateSchema>>();

  const { showActionSheetWithOptions } = useActionSheet();

  const onPressSelectImage = async () => {
    try {
      setLoading(true);

      const options = ["サンプルから選ぶ", "カメラロールを開く", "キャンセル"];
      const cancelButtonIndex = 2;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (selectedIndex?: number) => {
          switch (selectedIndex) {
            case 0:
              router.push({
                pathname: "/pick-sample-image",
              });
              break;
            case 1:
              await openCameraRoll();
              break;
            case cancelButtonIndex:
            // Canceled
          }
        }
      );
    } catch (error) {
      logger.error(error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const openCameraRoll = async () => {
    const stripBase64 = await pickImage(undefined, 450);

    if (stripBase64) {
      const path = `${userId}/pass-templates/${watch("id")}/strip-${getTime(
        new Date()
      )}.png`;
      await uploadImage(stripBase64, path);
      const stripUrl = supabase.storage.from("images").getPublicUrl(path)
        .data.publicUrl;
      setValue("stripUrl", stripUrl);
    }
  };

  const onChangeExpirationDate = (_: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setValue("expirationDate", date);
    }
  };

  const onPressPreview = async () => {
    if (Object.keys(formState.errors).length === 0) {
      router.push({
        pathname: "/(app)/(new-pass-template)/preview-pass-template",
      });
    }
  };

  return (
    <SafeAreaView className="flex flex-1">
      <ScrollView>
        <View
          className={cn(
            "my-6 flex-1 gap-5 p-6 bg-background border border-border"
          )}
        >
          <Label>カバー画像</Label>
          {watch("stripUrl") && (
            <Image
              className="w-full h-32"
              source={{
                uri: watch("stripUrl"),
              }}
            />
          )}

          <Button
            variant="outline"
            onPress={onPressSelectImage}
            disabled={loading}
            className="rounded-lg flex flex-row text-primary gap-2"
          >
            <Share width={15} height={16} color={themeColors.primary} />
            <Text>画像を選択する</Text>
          </Button>

          <Label>特典</Label>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="お会計から10%引き！"
                autoCorrect={false}
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="passContentValue"
          />
          {Object.keys(formState.errors).length > 0 && (
            <Text className="text-sm text-destructive">
              <ErrorMessage name="passContentValue" />
            </Text>
          )}

          <Label>有効期限</Label>
          <View
            style={{
              flex: 1,
              alignItems: "flex-start",
            }}
            className="-ml-4"
          >
            <DateTimePicker
              mode="datetime"
              locale="ja"
              onChange={onChangeExpirationDate}
              value={watch("expirationDate") ?? new Date()}
            />
          </View>

          <Label>背景色</Label>

          <Button
            variant="outline"
            size="sm"
            onPress={() => {
              router.push({
                pathname: "/pick-color",
                params: { key: "backgroundColor" },
              });
            }}
            style={{ backgroundColor: watch("backgroundColor") }}
          >
            <Text>{watch("backgroundColor")}</Text>
          </Button>

          <Label>メイン文字色</Label>
          <Button
            variant="outline"
            size="sm"
            onPress={() => {
              router.push({
                pathname: "/pick-color",
                params: { key: "foregroundColor" },
              });
            }}
            style={{ backgroundColor: watch("foregroundColor") }}
          >
            <Text>{watch("foregroundColor")}</Text>
          </Button>

          <Label>サブ文字色</Label>
          <Button
            variant="outline"
            size="sm"
            onPress={() => {
              router.push({
                pathname: "/pick-color",
                params: { key: "labelColor" },
              });
            }}
            style={{ backgroundColor: watch("labelColor") }}
          >
            <Text>{watch("labelColor")}</Text>
          </Button>
        </View>
      </ScrollView>

      <View className="flex p-4 bg-background">
        <Button
          className="flex flex-row gap-2 border border-border"
          variant="outline"
          onPress={handleSubmit(onPressPreview)}
        >
          <ExternalLink size={16} />
          <Text className="text-foreground">プレビュー</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
