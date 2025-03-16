import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ZigZagView from "~/components/zig-zag-view";
import { defaultLabel, themeColors } from "~/lib/constants";
import { supabase } from "~/lib/supabase";
import { cn, formatDate } from "~/lib/utils";

export function PassTemplateImage({
  passTemplateId,
  passTemplateProps,
  showBarcode,
  className,
  halfSize,
}: {
  passTemplateId?: string;
  passTemplateProps?: PassTemplateProps;
  showBarcode?: boolean;
  className?: string;
  halfSize?: boolean;
}) {
  const { data: passTemplateData } = useQuery(
    passTemplateId
      ? supabase
          .from("passTemplates")
          .select(`*`)
          .eq("id", passTemplateId)
          .is("deletedAt", null)
          .single()
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const passTemplate = passTemplateData ?? passTemplateProps;

  if (!passTemplate) {
    return null;
  }

  const {
    backgroundColor,
    foregroundColor,
    logoUrl,
    stripUrl,
    logoText,
    description,
    expirationDate,
    caveats,
  } = passTemplate;

  return (
    <View className={cn(className)}>
      <ZigZagView
        backgroundColor={backgroundColor}
        position="bottom"
        color={themeColors.background}
      />

      <View style={{ backgroundColor }}>
        <View
          className={cn(`flex flex-row p-2 gap-2 items-center justify-start`)}
        >
          {logoUrl ? (
            <Image
              source={{ uri: logoUrl }}
              style={{
                height: halfSize ? 30 : 60,
                minWidth: halfSize ? 30 : 60,
              }}
              contentFit="contain"
            />
          ) : (
            <View className="h-24 bg-gray-400" />
          )}
          <Text
            style={{ color: foregroundColor }}
            className={cn(halfSize && "text-sm", "font-bold mr-8")}
          >
            {logoText}
          </Text>
        </View>

        <View className="relative">
          {stripUrl ? (
            <Image
              source={{ uri: stripUrl }}
              style={{
                minHeight: halfSize ? 30 : 60,
                height: halfSize ? 100 : 200,
                width: "100%",
              }}
              className="w-full"
              contentFit="cover"
            />
          ) : (
            <View className="h-24 bg-gray-400" />
          )}
        </View>

        <View
          className={cn(
            halfSize ? "p-2 flex-col gap-2" : "p-4 flex-row justify-between"
          )}
        >
          <View>
            <Text className="text-sm" style={{ color: foregroundColor }}>
              {defaultLabel.coupon.description}
            </Text>
            <Text
              className={cn(halfSize ? "text-sm" : "text-2xl")}
              style={{ color: foregroundColor }}
            >
              {description}
            </Text>
          </View>
          {expirationDate && (
            <View>
              <Text className="text-sm" style={{ color: foregroundColor }}>
                {defaultLabel.coupon.expirationDate}
              </Text>
              <Text
                className={cn(halfSize ? "text-sm" : "text-2xl")}
                style={{ color: foregroundColor }}
              >
                {formatDate(expirationDate)}
              </Text>
            </View>
          )}
          {halfSize && caveats && (
            <View>
              <Text className="text-sm" style={{ color: foregroundColor }}>
                {defaultLabel.coupon.caveats}
              </Text>
              <Text
                className={cn(halfSize ? "text-sm" : "text-2xl")}
                style={{ color: foregroundColor }}
              >
                {caveats}
              </Text>
            </View>
          )}
        </View>

        {/* TODO: merge size */}
        {!halfSize && caveats && (
          <View className="px-4">
            <Text className="text-sm" style={{ color: foregroundColor }}>
              {defaultLabel.coupon.caveats}
            </Text>
            <Text
              className={cn(halfSize ? "text-sm" : "text-2xl")}
              style={{ color: foregroundColor }}
            >
              {caveats}
            </Text>
          </View>
        )}

        {showBarcode && (
          <View className="my-8 items-center">
            <View className="p-2 bg-white rounded-xl">
              <QRCode value="これはプレビューです" />
            </View>
          </View>
        )}
      </View>
      <ZigZagView
        backgroundColor={backgroundColor}
        color={themeColors.background}
      />
    </View>
  );
}
