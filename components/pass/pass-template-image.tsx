import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { useState } from "react";
import { Dimensions, Image, ImageBackground, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { v4 as uuidv4 } from "uuid";
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
  const [aspectRatio, setAspectRatio] = useState(1);

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
    logoBase64,
    stripBase64,
    logoText,
  } = passTemplate;

  const screenWidth = Dimensions.get("screen").width;
  const headerHeight = Math.round((screenWidth * 55) / 320);
  const stripHeight = Math.round((screenWidth * 123) / 320);

  return (
    <ZigZagView backgroundColor={backgroundColor} paddingX={42}>
      <View style={{ backgroundColor }}>
        <View className={`p-2 pt-0 flex flex-row gap-4 items-center`}>
          <Image
            source={{ uri: `data:image/png;base64,${logoBase64}` }}
            style={{
              height: headerHeight,
              aspectRatio,
              alignSelf: "flex-start",
            }}
            resizeMode="contain"
            onLoad={(event) => {
              const { width, height } = event.nativeEvent.source;
              setAspectRatio(width / height);
            }}
          />
          <Text style={{ color: foregroundColor }}>{logoText}</Text>
        </View>

        <View className="relative">
          {stripBase64 ? (
            <ImageBackground
              style={{ height: stripHeight }}
              resizeMode="cover"
              source={{ uri: `data:image/png;base64,${stripBase64}` }}
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

        <View className="py-1 px-3 grid gap-4">
          {secondaryFields?.map((p) => {
            return (
              <View key={uuidv4()}>
                <Text className="text-lg" style={{ color: labelColor }}>
                  {p.label}
                </Text>
                {p.value ? (
                  <Text className="text-2xl" style={{ color: foregroundColor }}>
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
