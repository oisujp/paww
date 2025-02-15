import {
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useContext } from "react";
import { Text } from "react-native";
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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { NavigationContext } from "~/contexts/navigation-context";
import { supabase } from "~/lib/supabase";
import { logger } from "~/lib/utils";

export function PassTemplateBlock({
  passTemplateId,
}: {
  passTemplateId: string;
}) {
  const { loading, setLoading } = useContext(NavigationContext);
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
        <PassTemplateImage passTemplateId={passTemplate.id} />

        <Button
          variant="secondary"
          className="my-3"
          disabled={loading}
          onPress={onPressOpenWeb}
        >
          <Text>配布用ページを表示する</Text>
        </Button>

        <Link
          href={{
            pathname: "pass-templates/passes",
            params: { passTemplateId: passTemplate.id },
          }}
          asChild
        >
          <Button variant="secondary">
            <Text>配布済みパス一覧を表示する</Text>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
