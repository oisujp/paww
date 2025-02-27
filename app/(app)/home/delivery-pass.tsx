import * as WebBrowser from "expo-web-browser";
import { Copy } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { fetchWithToken } from "~/lib/supabase";

export default function DeliveryPass({
  passTemplateId,
}: {
  passTemplateId: string;
}) {
  const [shortenUrl, setShortenUrl] = useState("");
  const publicUrl = `${process.env.EXPO_PUBLIC_PAWW_BASE_URL}/p/${passTemplateId}`;

  const onPressOpenWeb = async () => {
    await WebBrowser.openBrowserAsync(publicUrl);
  };
  const onPressShortenUrl = async () => {
    const url = process.env.EXPO_PUBLIC_PAWW_BASE_URL + "/api/shorten-url";
    const res = await fetchWithToken(url, { originalUrl: publicUrl });
    const newShortenUrl = (res as unknown as { shortenUrl?: string })
      .shortenUrl;
    if (newShortenUrl) {
      setShortenUrl(newShortenUrl);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Text>このテンプレートでパスを配布する</Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex items-center">
        <AlertDialogHeader>
          <AlertDialogTitle>パスの配布方法</AlertDialogTitle>
          <AlertDialogDescription>
            QRコードやURLを印刷物・ポスター・店内POP・Eメールなどで配布します
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Text>[説明のグラフィックなど]</Text>
        {shortenUrl && (
          <View className="gap-4 items-center">
            <QRCode value={shortenUrl} size={160} />
            <View className="flex flex-row gap-2">
              <Text className="text-blue-800" onPress={onPressOpenWeb}>
                {shortenUrl}
              </Text>
              <Copy />
            </View>
          </View>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>閉じる</Text>
          </AlertDialogCancel>
          <Button onPress={onPressShortenUrl} disabled={!!shortenUrl}>
            <Text>QRコードとURLを作成する</Text>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
