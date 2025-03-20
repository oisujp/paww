import {
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import { CopyIcon } from "lucide-react-native";
import React, { useContext } from "react";
import { Alert, ScrollView, View } from "react-native";
import Avatar from "react-native-boring-avatars";
import { PassTemplateImage } from "~/components/pass/pass-template-image";
import PlatformBlock from "~/components/platform-block";
import StatusBlock from "~/components/status-block";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/contexts/auth-context";
import { NavigationContext } from "~/contexts/navigation-context";
import { themeColors } from "~/lib/constants";
import { passQuery, supabase } from "~/lib/supabase";
import { formatDatetime, logger } from "~/lib/utils";

export default function Pass() {
  const { passId } = useLocalSearchParams();
  const { loading, setLoading } = useContext(NavigationContext);
  const { session } = useContext(AuthContext);

  if (typeof passId !== "string") {
    throw new Error("passId is required");
  }

  const { data: pass, mutate } = useQuery(passQuery(passId));

  const { trigger: insert } = useInsertMutation(
    supabase.from("passHistory"),
    ["id"],
    "id",
    {}
  );
  const { trigger: doUpdate } = useUpdateMutation(supabase.from("passes"), [
    "id",
  ]);

  if (!pass || !session) {
    return null;
  }

  const onPressUse = async (redeemedAt: string | null) => {
    try {
      setLoading(true);
      await doUpdate({
        id: pass.id,
        redeemedAt,
      });
      await insert([
        {
          passId,
          actionType: redeemedAt ? "redeem" : "cancelRedeem",
          userId: session.user.id,
        },
      ]);
      await mutate();
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex flex-1 bg-background">
      <View className="flex flex-1 my-8 border-y border-border">
        <ScrollView
          contentContainerClassName="gap-4 p-6 bg-white"
          className="bg-white"
        >
          <View className="w-1/2 self-center flex gap-8 bg-white">
            <PassTemplateImage passTemplateId={pass.passTemplateId} halfSize />
            <Button
              size="sm"
              variant="outline"
              className="flex flex-row gap-2 items-center border-border bg-white rounded-full h-10"
              onPress={async () => {
                await Clipboard.setStringAsync("");
                Alert.alert("URLをコピーしました");
              }}
            >
              <CopyIcon color={themeColors.foreground} width={16} height={16} />
              <Text className="text-sm text-foreground native:font-normal">
                URLをコピー
              </Text>
            </Button>
          </View>

          <View>
            <Separator />
            <ListItem title="ステータス">
              <View className="self-start">
                <StatusBlock redeemed={!!pass.redeemedAt} />
              </View>
            </ListItem>
            <ListItem title="プラットフォーム">
              <PlatformBlock platform={pass.platform} />
            </ListItem>
            <ListItem title="配布日時">
              <Text>{formatDatetime(pass.createdAt)}</Text>
            </ListItem>

            <ListItem title="ID">
              <View className="flex flex-row items-center gap-2">
                <Avatar name={pass.id} size={24} />
                <Text className="h-auto flex-row">{pass.id}</Text>
              </View>
            </ListItem>

            <View className="w-1/3 max-w-32 justify-center">
              <Text className="text-primary font-bold">使用履歴</Text>
            </View>

            <View>
              {pass.passHistory.map((h) => {
                let actionUser = "";
                if (h.userId) {
                  actionUser = session.user.email ?? "";
                }
                return (
                  <View key={h.id} className="flex">
                    <Text>{formatDatetime(h.createdAt)}</Text>
                    {h.actionType === "redeem" && (
                      <Text>{actionUser}さんが使用しました。</Text>
                    )}
                    {h.actionType === "cancelRedeem" && (
                      <Text>{actionUser}さんが使用をキャンセルしました。</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
      <View className="p-6 bg-white shadow-sm">
        {pass.redeemedAt ? (
          <Button
            onPress={async () => {
              onPressUse(null);
            }}
            variant="outline"
            disabled={loading || !pass.redeemedAt}
          >
            <Text>使用前に戻す</Text>
          </Button>
        ) : (
          <Button
            onPress={async () => {
              await onPressUse(new Date().toISOString());
            }}
            disabled={loading || !!pass.redeemedAt}
          >
            <Text>使用済みにする</Text>
          </Button>
        )}
      </View>
    </View>
  );
}

const ListItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <View className="flex flex-row gap-2 py-3.5">
        <View className="w-1/3 max-w-32 justify-center">
          <Text className="text-primary font-bold">{title}</Text>
        </View>
        <View className="w-2/3 justify-center">{children}</View>
      </View>
      <Separator />
    </>
  );
};
