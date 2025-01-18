import { useDeleteMutation } from "@supabase-cache-helpers/postgrest-swr";
import { Text } from "react-native";
import { Pass } from "~/components/pass";
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
import { publishPass, supabase } from "~/lib/supabase";
import { logger, parseCoupon } from "~/lib/utils";
import { PassTemplate } from "~/types/supabase";

export function PassBlock({ pass }: { pass: PassTemplate }) {
  const couponPass = parseCoupon(pass);

  const { trigger: doDelete } = useDeleteMutation(
    supabase.from("passTemplates"),
    ["id"]
  );

  const onPressDelete = async () => {
    try {
      await doDelete({
        id: pass.id,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  const onPressPublish = async () => {
    await publishPass(pass.id);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>{pass.templateName}</CardTitle>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-24" variant="destructive">
              <Text>削除</Text>
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
                <Text>削除</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <Text>有効期限: {pass.expirationDate}</Text>
        <Text>作成日: {pass.createdAt}</Text>
        <Pass pass={couponPass} />
        <Button variant="secondary" className="my-3">
          <Text>バーコードを表示</Text>
        </Button>
        <Button variant="secondary" className="my-3" onPress={onPressPublish}>
          <Text>発行する</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
