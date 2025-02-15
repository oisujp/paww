import { useDeleteMutation } from "@supabase-cache-helpers/postgrest-swr";
import * as WebBrowser from "expo-web-browser";
import { useContext } from "react";
import { Text, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { PassTemplateImage } from "~/components/pass-template-image";
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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { NavigationContext } from "~/contexts/navigation-context";
import { supabase } from "~/lib/supabase";
import { logger, parseCoupon } from "~/lib/utils";
import { Pass, PassTemplate } from "~/types/supabase";

export function PassTemplateBlock({
  passTemplate,
  passes,
}: {
  passTemplate: PassTemplate;
  passes: Pass[];
}) {
  const { loading, setLoading } = useContext(NavigationContext);
  const couponPass = parseCoupon(passTemplate);

  const { trigger: doDelete } = useDeleteMutation(
    supabase.from("passTemplates"),
    ["id"]
  );

  const onPressDelete = async () => {
    try {
      setLoading(true);
      await doDelete({
        id: passTemplate.id,
      });
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onPressOpenWeb = async () => {
    const url = `${process.env.EXPO_PUBLIC_PAWW_BACKEND_URL}/p/${passTemplate.id}`;
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>{passTemplate.templateName}</CardTitle>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-24" variant="destructive">
              <Text className="text-background">削除</Text>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>削除しますか?</AlertDialogTitle>
              <AlertDialogDescription>
                発行済みのパスには影響しません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Text>キャンセル</Text>
              </AlertDialogCancel>
              <AlertDialogAction onPress={onPressDelete}>
                <Text className="text-destructive">削除</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <Text>テンプレート作成日: {passTemplate.createdAt}</Text>
        <PassTemplateImage pass={couponPass} />

        <Button
          variant="secondary"
          className="my-3"
          disabled={loading}
          onPress={onPressOpenWeb}
        >
          <Text>配布用ページを表示する</Text>
        </Button>

        <View>
          <Text>最近配布されたパス:</Text>
          {passes.map((p) => (
            <View key={uuidv4()}>
              <Text>{p.publishedAt}</Text>
            </View>
          ))}
        </View>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary">
              <Text>配布済みパス一覧を表示する</Text>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>パス一覧</AlertDialogTitle>
              <AlertDialogDescription>
                発行済みのパスには影響しません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>
                <Text>キャンセル</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
