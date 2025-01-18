import { Dimensions, Image, ImageBackground, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { v4 as uuidv4 } from "uuid";
import { Label } from "~/components/ui/label";
import { ZigZagView } from "~/components/zig-zag-view";

export function Pass({
  pass,
  showBarcode,
}: {
  pass: PassProps;
  showBarcode?: boolean;
}) {
  const {
    coupon: { headerFields, primaryFields, secondaryFields },
    backgroundColor,
    labelColor,
    foregroundColor,
    logoBase64,
    stripBase64,
  } = pass;
  const screenWidth = Dimensions.get("screen").width;
  const headerHeight = Math.round((screenWidth * 55) / 320);
  const stripHeight = Math.round((screenWidth * 123) / 320);

  return (
    <ZigZagView backgroundColor={backgroundColor} paddingX={42}>
      <View style={{ backgroundColor }}>
        <View className={`px-2 pb-2 w-1/2`}>
          <Image
            source={{ uri: `data:image/png;base64,${logoBase64}` }}
            style={{ height: headerHeight }}
            resizeMode="contain"
          />
        </View>

        <View>
          {headerFields?.map((h) => {
            return (
              <View className="flex flex-col">
                <Label style={{ color: foregroundColor }}>{h.label}</Label>
                <Label style={{ color: labelColor }}>{h.value}</Label>
              </View>
            );
          })}
        </View>

        <View className="relative">
          <ImageBackground
            style={{ height: stripHeight }}
            resizeMode="cover"
            source={{ uri: `data:image/png;base64,${stripBase64}` }}
          >
            {primaryFields.map((p, index) => {
              if (index !== 0) return null;
              return (
                <View
                  key={uuidv4()}
                  className="flex items-start justify-center h-full p-3"
                >
                  <Text className="text-6xl" style={{ color: foregroundColor }}>
                    {p.value}
                  </Text>
                  <Text className="text-2xl" style={{ color: labelColor }}>
                    {p.label}
                  </Text>
                </View>
              );
            })}
          </ImageBackground>
        </View>

        <View className="py-1 px-3">
          {secondaryFields?.map((p, index) => {
            if (index !== 0) return null;
            return (
              <View key={uuidv4()}>
                <Text className="text-lg" style={{ color: labelColor }}>
                  {p.label}
                </Text>
                <Text className="text-2xl" style={{ color: foregroundColor }}>
                  {p.value}
                </Text>
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
