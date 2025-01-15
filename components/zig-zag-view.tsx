import { Dimensions, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { useColorScheme } from "~/lib/use-color-scheme";

export function ZigZagView({
  children,
  backgroundColor,
  paddingX,
}: {
  children: React.ReactNode;
  backgroundColor: string;
  paddingX: number;
}) {
  const { isDarkColorScheme } = useColorScheme();
  const screenWidth = Dimensions.get("screen").width;
  const outsideColor = isDarkColorScheme ? "#09090A" : "#FFF";

  const renderZigZagView = () => {
    let nodes = [];
    for (var i = 0; i < 40; i++) {
      const points = `${10 * i},0 ${10 * i + 5},5 ${10 * (i + 1)},0`;
      nodes.push(<Polygon key={i} points={points} fill={outsideColor} />);
    }
    return nodes;
  };

  return (
    <View>
      <View style={{ backgroundColor }}>
        <Svg width={screenWidth - paddingX} height="10">
          {renderZigZagView()}
        </Svg>
        {children}
        <View className="rotate-180">
          <Svg width={screenWidth - paddingX} height="10">
            {renderZigZagView()}
          </Svg>
        </View>
      </View>
    </View>
  );
}
