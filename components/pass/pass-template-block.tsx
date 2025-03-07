import {
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import { router } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { useContext } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import DeliveryPass from "~/app/(app)/(tabs)/home/delivery-pass";
import { PassTemplateImage } from "~/components/pass/pass-template-image";
import { Button } from "~/components/ui/button";
import { NavigationContext } from "~/contexts/navigation-context";
import { supabase } from "~/lib/supabase";
import { formatDate, logger } from "~/lib/utils";

export function PassTemplateBlock({
  passTemplateId,
}: {
  passTemplateId: string;
}) {
  const { setLoading } = useContext(NavigationContext);
  const { data: passTemplate } = useQuery(
    supabase
      .from("passTemplates")
      .select(`*`)
      .eq("id", passTemplateId)
      .is("deletedAt", null)
      .single(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { trigger: doUpdate } = useUpdateMutation(
    supabase.from("passTemplates"),
    ["id"]
  );
  if (!passTemplate) {
    return null;
  }

  const onPressDelete = async () => {
    try {
      setLoading(true);
      Alert.alert(
        "テンプレートを削除しますか？",
        "発行済みのパスには影響しません。",
        [
          {
            text: "削除する",
            onPress: async () => {
              await doUpdate({
                id: passTemplate.id,
                deletedAt: new Date().toISOString(),
              });
            },
            style: "destructive",
          },
          {
            text: "キャンセル",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={() => {
        router.navigate({
          pathname: "/home/passes",
          params: { passTemplateId: passTemplate.id },
        });
      }}
      className="border border-border rounded-xl p-3 flex gap-3"
    >
      <>
        <View className="flex flex-row justify-between items-center">
          <View className="flex">
            <Text className="text-sm">作成日</Text>
            <Text className="text-sm">
              {formatDate(passTemplate.createdAt)}
            </Text>
          </View>

          <Button
            variant="ghost"
            className="w-[30px]"
            onPress={() => {
              onPressDelete();
            }}
          >
            <View className="rounded-full size-[30px] border border-1 items-center justify-center border-border">
              <Trash2 width={11} height={11} />
            </View>
          </Button>
        </View>

        <PassTemplateImage passTemplateId={passTemplate.id} halfSize />

        <DeliveryPass passTemplateId={passTemplate.id} />
      </>
    </Pressable>
  );
}
