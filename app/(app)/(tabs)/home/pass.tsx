import {
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import { CopyIcon } from "lucide-react-native";
import React, { useContext } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
import { PassTemplateImage } from "~/components/pass/pass-template-image";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { NavigationContext } from "~/contexts/navigation-context";
import { themeColors } from "~/lib/constants";
import { supabase } from "~/lib/supabase";
import { formatDatetime, logger } from "~/lib/utils";

export default function Pass() {
  const { passId } = useLocalSearchParams();
  const { loading, setLoading } = useContext(NavigationContext);

  if (typeof passId !== "string") {
    throw new Error("passId is required");
  }

  const { data: pass } = useQuery(
    supabase
      .from("passes")
      .select(`*, passTemplates( id )`)
      .eq("id", passId)
      .single()
  );

  const { trigger: doUpdate } = useUpdateMutation(supabase.from("passes"), [
    "id",
  ]);

  if (!pass) {
    return null;
  }

  const onPressUse = async (usedAt: string | null) => {
    try {
      setLoading(true);
      await doUpdate({
        id: pass.id,
        usedAt,
      });
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex flex-1">
      <ScrollView contentContainerClassName="gap-4 p-6 my-6 bg-white">
        <View className="w-1/2 self-center flex gap-8">
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
              URLをコピーする
            </Text>
          </Button>
        </View>

        <View>
          <Separator />
          <ListItem title="発行日時" value={formatDatetime(pass.publishedAt)} />
          <ListItem title="ID" value={pass.id} />
          <ListItem
            title="インストール日時"
            value={formatDatetime(pass.addedAt)}
          />
          <ListItem title="最終使用日時" value={formatDatetime(pass.usedAt)} />
          <ListItem title="最終取消日時" value={formatDatetime(pass.usedAt)} />
        </View>
      </ScrollView>
      <View className="p-6 bg-white">
        {pass.usedAt ? (
          <Button
            onPress={async () => {
              onPressUse(null);
            }}
            variant="outline"
            disabled={loading || !pass.usedAt}
          >
            <Text>使用前に戻す</Text>
          </Button>
        ) : (
          <Button
            onPress={async () => {
              await onPressUse(new Date().toISOString());
            }}
            disabled={loading || !!pass.usedAt}
          >
            <Text>使用済みにする</Text>
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const ListItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <>
      <View className="flex flex-row gap-2 py-3.5">
        <View className="flex-1">
          <Text className="text-primary font-bold">{title}</Text>
        </View>
        <View className="flex-2">
          <Text>{value}</Text>
        </View>
      </View>
      <Separator />
    </>
  );
};
