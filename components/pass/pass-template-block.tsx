import {
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import { format } from "date-fns";
import { router } from "expo-router";
import { Trash } from "lucide-react-native";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import DeliveryPass from "~/app/(app)/(tabs)/home/delivery-pass";
import { PassTemplateImage } from "~/components/pass/pass-template-image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { NavigationContext } from "~/contexts/navigation-context";
import { supabase } from "~/lib/supabase";
import { logger } from "~/lib/utils";

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
      await doUpdate({
        id: passTemplate.id,
        deletedAt: new Date().toISOString(),
      });
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
              {format(passTemplate.createdAt, "yyyy/MM/dd")}
            </Text>
          </View>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="w-[30px]">
                <View className="rounded-full size-[30px] border border-1 items-center justify-center border-border">
                  <Trash width={11} height={11} />
                </View>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>テンプレートを削除しますか?</AlertDialogTitle>
                <AlertDialogDescription>
                  発行済みのパスには影響しません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground border-0"
                  >
                    <Text>キャンセル</Text>
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction onPress={onPressDelete} asChild>
                  <Button
                    variant="destructive"
                    className="bg-white border-destructive border"
                  >
                    <Text className="text-destructive">削除</Text>
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </View>

        <PassTemplateImage passTemplateId={passTemplate.id} />

        <DeliveryPass passTemplateId={passTemplate.id} />
      </>
    </Pressable>
  );
}
