import { useActionSheet } from "@expo/react-native-action-sheet";
import { ErrorMessage } from "@hookform/error-message";
import { getTime, setDate, setMonth, setYear } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Share } from "lucide-react-native";
import React, { useContext, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { AuthContext } from "~/contexts/auth-context";
import { NavigationContext } from "~/contexts/navigation-context";
import { themeColors } from "~/lib/constants";
import { supabase, uploadImage } from "~/lib/supabase";
import { cn, formatDate, logger, pickImage } from "~/lib/utils";
import { passTemplateSchema } from "~/schemas";

export default function NewPassTemplateIndex() {
  const { session } = useContext(AuthContext);
  const { loading, setLoading } = useContext(NavigationContext);
  const router = useRouter();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const userId = session?.user.id ?? "";

  const { control, watch, setValue, handleSubmit, formState } =
    useFormContext<z.infer<typeof passTemplateSchema>>();

  const { showActionSheetWithOptions } = useActionSheet();

  const onPressSelectImage = async () => {
    try {
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
                pathname: "/home/new-pass-template/pick-sample-image",
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
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.granted === false) {
        Alert.alert(
          "カメラロールへのアクセス許可が必要です。",
          "設定アプリからアクセスを許可してください。",
          [
            {
              text: "設定アプリを開く",
              onPress: () => Linking.openSettings(),
              style: "default",
            },
            { text: "キャンセル", style: "cancel" },
          ]
        );
        throw new Error("Permission to access camera roll is required!");
      }
      const stripBase64 = await pickImage(1171, 450);

      setLoading(true);

      if (stripBase64) {
        const path = `${userId}/pass-templates/${watch("id")}/strip-${getTime(
          new Date()
        )}.png`;
        await uploadImage(stripBase64, path);
        const stripUrl = supabase.storage.from("images").getPublicUrl(path)
          .data.publicUrl;
        setValue("stripUrl", stripUrl);
      }
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (date: Date) => {
    const currentDate = watch("expirationDate");
    if (!currentDate) {
      return;
    }
    const newDate = setDate(
      setMonth(setYear(currentDate, date.getFullYear()), date.getMonth()),
      date.getDate()
    );
    setValue("expirationDate", newDate);
  };

  const onPressPreview = async () => {
    if (Object.keys(formState.errors).length === 0) {
      router.push({
        pathname: "/home/new-pass-template/preview-pass-template",
      });
    } else {
      logger.error(formState.errors);
    }
  };

  return (
    <SafeAreaView className="flex flex-1">
      <ScrollView>
        <View
          className={cn(
            "my-6 flex-1 gap-6 p-6 bg-background border border-border"
          )}
        >
          <View className="gap-2">
            <Label>カバー画像</Label>
            {watch("stripUrl") && !loading ? (
              <Image
                className="w-full h-48 border border-border"
                source={{
                  uri: watch("stripUrl"),
                }}
              />
            ) : (
              <ActivityIndicator className="h-48 w-full" />
            )}
          </View>

          {loading || (
            <Button
              variant="outline"
              onPress={onPressSelectImage}
              disabled={loading}
              className="rounded-lg flex flex-row text-primary gap-2"
            >
              <Share width={15} height={16} color={themeColors.primary} />
              <Text>画像を選択する</Text>
            </Button>
          )}

          <View className="gap-2">
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
              name="description"
            />
            {Object.keys(formState.errors).length > 0 && (
              <Text className="text-sm text-destructive">
                <ErrorMessage name="description" />
              </Text>
            )}
          </View>

          <View className="gap-2">
            <Label>有効期限</Label>
            <View className="flex flex-row gap-4 justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={watch("noExpirationDate")}
                onPress={() => setDatePickerVisibility(true)}
                className="flex flex-row flex-grow justify-start gap-2 h-[50px] border-border border"
              >
                <Text className="text-foreground native:font-normal">
                  {formatDate(watch("expirationDate"))}
                </Text>
              </Button>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <View className="flex flex-row items-center justify-end gap-2">
                    <Text>有効期限なし</Text>
                    <Switch
                      checked={!!value}
                      onCheckedChange={onChange}
                      nativeID="airplane-mode"
                    />
                  </View>
                )}
                name="noExpirationDate"
              />
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            locale="ja"
            confirmTextIOS="選択する"
            cancelTextIOS="キャンセル"
            onConfirm={(date) => {
              onChangeDate(date);
              setDatePickerVisibility(false);
            }}
            onCancel={() => setDatePickerVisibility(false)}
            pickerContainerStyleIOS={{
              display: "flex",
              alignItems: "center",
            }}
          />

          <View className="gap-2">
            <Label>注意事項</Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  placeholder={`他のクーポン・割引券との併用はできません。`}
                  value={value ?? undefined}
                  onChangeText={onChange}
                  aria-labelledby="textareaLabel"
                />
              )}
              name="caveats"
            />
          </View>

          <View className="gap-2">
            <Label>背景色</Label>
            <ColorPickerButton keyName="backgroundColor" />
          </View>
          <View className="gap-2">
            <Label>文字色</Label>
            <ColorPickerButton keyName="foregroundColor" />
          </View>
        </View>
      </ScrollView>

      <View className="flex p-4 bg-background">
        <Button onPress={handleSubmit(onPressPreview)}>
          <Text>プレビューを確認する</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const ColorPickerButton = ({ keyName }: { keyName: string }) => {
  const router = useRouter();
  const { watch } = useFormContext();

  return (
    <Button
      variant="outline"
      size="sm"
      onPress={() => {
        router.push({
          pathname: "/home/new-pass-template/pick-color",
          params: { key: keyName },
        });
      }}
      className="flex flex-row justify-start gap-2 h-[50px] border-border border"
    >
      <View
        className="rounded-full size-[18px] border border-border"
        style={{ backgroundColor: watch(keyName) }}
      />
      <Text className="text-left text-foreground native:font-normal">
        {watch(keyName)?.toUpperCase()}
      </Text>
    </Button>
  );
};
