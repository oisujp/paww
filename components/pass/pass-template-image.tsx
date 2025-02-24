import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Image } from "expo-image";
import { Dimensions, ImageBackground, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { ZigZagView } from "~/components/zig-zag-view";
import { supabase } from "~/lib/supabase";
import { parseCoupon } from "~/lib/utils";

export function PassTemplateImage({
  passTemplateId,
  passTemplateProps,
  showBarcode,
}: {
  passTemplateId?: string;
  passTemplateProps?: PassTemplateProps;
  showBarcode?: boolean;
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
    coupon: { primaryFields, secondaryFields },
    backgroundColor,
    labelColor,
    foregroundColor,
    logoUrl,
    stripUrl,
    logoText,
  } = passTemplate;

  const screenWidth = Dimensions.get("screen").width;
  const stripHeight = Math.round((screenWidth * 123) / 320);

  return (
    <ZigZagView backgroundColor={backgroundColor} paddingX={42}>
      <View style={{ backgroundColor }}>
        <View
          className={`pr-2 pt-0 flex flex-row gap-2 items-center justify-start`}
        >
          {logoUrl ? (
            <Image
              source={{ uri: logoUrl }}
              style={{
                height: 60,
                minWidth: 60,
              }}
              contentFit="contain"
            />
          ) : (
            <View className="h-24 bg-gray-400" />
          )}
          <Text
            style={{ color: foregroundColor }}
            className="font-bold text-base"
          >
            {logoText}
          </Text>
        </View>

        <View className="relative">
          {stripUrl ? (
            <ImageBackground
              style={{ height: stripHeight }}
              resizeMode="cover"
              source={{ uri: stripUrl }}
            >
              {primaryFields.map(() => {
                // no text for now
                return null;
              })}
            </ImageBackground>
          ) : (
            <View className="h-24 bg-gray-400" />
          )}
        </View>

        <View className="py-1 px-3 grid gap-2">
          {secondaryFields?.map((p) => {
            return (
              <View key={p.key}>
                <Text className="text-sm" style={{ color: labelColor }}>
                  {p.label}
                </Text>
                {p.value ? (
                  <Text
                    className="text-base"
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
            <QRCode value="http://awesome.link.qr" />
          </View>
        )}
      </View>
    </ZigZagView>
  );
}
