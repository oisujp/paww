import {
  useDeleteMutation,
  useInsertMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import { useRouter } from "expo-router";
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
import { AuthContext } from "~/contexts/auth-context";
import { NavigationContext } from "~/contexts/navigation-context";
import { publishPass, supabase } from "~/lib/supabase";
import { logger, parseCoupon } from "~/lib/utils";
import { Pass, PassTemplate } from "~/types/supabase";

export function PassTemplateBlock({
  passTemplate,
  passes,
}: {
  passTemplate: PassTemplate;
  passes: Pass[];
}) {
  const { session } = useContext(AuthContext);
  const { loading, setLoading } = useContext(NavigationContext);
  const router = useRouter();
  const couponPass = parseCoupon(passTemplate);

  const { trigger: doDelete } = useDeleteMutation(
    supabase.from("passTemplates"),
    ["id"]
  );
  const { trigger: insert } = useInsertMutation(
    supabase.from("passes"),
    ["id"],
    "*"
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

  const onPressPublish = async () => {
    try {
      setLoading(true);
      const result = await publishPass(passTemplate.id);

      await insert([
        {
          userId: session?.user.id,
          passTemplateId: passTemplate.id,
          publicUrl: result.publicUrl,
        },
      ]);
      router.push({
        pathname: "/(app)/pass",
        params: { publicUrl: result.publicUrl },
      });
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
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
        <Text>有効期限: {passTemplate.expirationDate}</Text>
        <Text>作成日: {passTemplate.createdAt}</Text>
        <PassTemplateImage pass={couponPass} />
        <Text>最近発行したパス:</Text>
        {passes.map((p) => (
          <View key={uuidv4()}>
            <Text>{p.publishedAt}</Text>
          </View>
        ))}
        <Button
          variant="secondary"
          className="my-3"
          disabled={loading}
          onPress={onPressPublish}
        >
          <Text>パスを発行する</Text>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary">
              <Text>パス一覧を表示する</Text>
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
