import CopyIcon from "assets/images/copy.svg";
import PassDeliveryImage from "assets/images/pass-delivery.svg";
import QRIcon from "assets/images/qr.svg";
import * as Clipboard from "expo-clipboard";
import * as WebBrowser from "expo-web-browser";
import { useContext, useState } from "react";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { NavigationContext } from "~/contexts/navigation-context";
import { fetchWithToken } from "~/lib/supabase";
import { logger } from "~/lib/utils";

export default function DeliveryPass({
  passTemplateId,
}: {
  passTemplateId: string;
}) {
  const [shortenUrl, setShortenUrl] = useState("");
  const { loading, setLoading } = useContext(NavigationContext);

  const publicUrl = `${process.env.EXPO_PUBLIC_PAWW_BASE_URL}/p/${passTemplateId}`;

  const onPressOpenWeb = async () => {
    await WebBrowser.openBrowserAsync(publicUrl);
  };
  const onPressShortenUrl = async () => {
    try {
      setLoading(true);
      const url = process.env.EXPO_PUBLIC_PAWW_BASE_URL + "/api/shorten-url";
      const res = await fetchWithToken(url, { originalUrl: publicUrl });
      const newShortenUrl = (res as unknown as { shortenUrl?: string })
        .shortenUrl;
      if (newShortenUrl) {
        setShortenUrl(newShortenUrl);
      }
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border-foreground rounded-lg native:h-10"
        >
          <View className="flex flex-row gap-2.5">
            <QRIcon />
            <Text className="text-foreground">表示する</Text>
          </View>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex items-center w-full rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary text-center">
            パスの配布方法
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            QRコードやURLを印刷物・ポスター・店内POP・Eメールなどで配布します
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!shortenUrl && <PassDeliveryImage className="h-[148px] w-[234px]" />}
        {shortenUrl && (
          <View className="gap-4 items-center p-4">
            <View>
              <QRCode value={shortenUrl} size={240} />
            </View>
            <View className="flex flex-row gap-2 items-center">
              <Text className="text-blue-800" onPress={onPressOpenWeb}>
                {shortenUrl}
              </Text>
              <Pressable
                className="rounded-full border border-border size-9 items-center justify-center"
                onPress={async () => {
                  await Clipboard.setStringAsync(shortenUrl);
                  Alert.alert("URLをコピーしました");
                }}
              >
                <CopyIcon width={16} height={16} />
              </Pressable>
            </View>
          </View>
        )}
        <Button
          onPress={onPressShortenUrl}
          disabled={!!shortenUrl || loading}
          className="flex flex-row gap-2 w-full"
        >
          {loading && <ActivityIndicator className="text-white" />}
          <Text>QRコードとURLを作成する</Text>
        </Button>
        <AlertDialogCancel className="border-0">
          <Text className="text-muted-foreground">閉じる</Text>
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
