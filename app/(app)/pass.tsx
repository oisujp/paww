import { useLocalSearchParams } from "expo-router/build/hooks";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function Pass() {
  const { publicUrl } = useLocalSearchParams<{ publicUrl: string }>();
  return (
    <View className="p-6">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>{"ssss"}</CardTitle>
        </CardHeader>
        <CardContent>
          <QRCode value={publicUrl} />
        </CardContent>
      </Card>
    </View>
  );
}
