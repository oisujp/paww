import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ZigZagView from "~/components/zig-zag-view";
import { supabase } from "~/lib/supabase";
import { cn, parseCoupon } from "~/lib/utils";

export function PassTemplateImage({
  passTemplateId,
  passTemplateProps,
  showBarcode,
  className,
}: {
  passTemplateId?: string;
  passTemplateProps?: PassTemplateProps;
  showBarcode?: boolean;
  className?: string;
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
      <ZigZagView backgroundColor={backgroundColor} position="bottom" />

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
          <Text style={{ color: foregroundColor }} className="font-bold">
            {logoText}
          </Text>
        </View>

        <View className="relative">
          {stripUrl ? (
            <Image
              source={{ uri: stripUrl }}
              style={{
                minHeight: 60,
                width: "100%",
              }}
              className="w-full"
              contentFit="cover"
            />
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
      <ZigZagView backgroundColor={backgroundColor} />
    </View>
  );
}
