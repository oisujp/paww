import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ZigZagView from "~/components/zig-zag-view";
import { themeColors } from "~/lib/constants";
import { supabase } from "~/lib/supabase";
import { cn, parseCoupon } from "~/lib/utils";

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
  const passTemplate = passTemplateData
    ? parseCoupon(passTemplateData)
    : passTemplateProps;

  if (!passTemplate) {
    return null;
  }

  const {
    coupon: { secondaryFields },
    backgroundColor,
    labelColor,
    foregroundColor,
    logoUrl,
    stripUrl,
    logoText,
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
          <Text style={{ color: foregroundColor }} className="font-bold mr-8">
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
          {secondaryFields?.map((p) => {
            return (
              <View key={p.key}>
                <Text className="text-sm" style={{ color: labelColor }}>
                  {p.label}
                </Text>
                {p.value ? (
                  <Text
                    className={cn(halfSize ? "text-sm" : "text-2xl")}
                    style={{ color: foregroundColor }}
                  >
                    {p.value}
                  </Text>
                ) : (
                  <View className="rounded-full w-1/2 h-6 bg-gray-400" />
                )}
              </View>
            );
          })}
        </View>

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
