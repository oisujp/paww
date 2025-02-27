import {
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import { useLocalSearchParams } from "expo-router";
import { CopyIcon } from "lucide-react-native";
import React, { useContext } from "react";
import { View } from "react-native";
import { PassTemplateImage } from "~/components/pass/pass-template-image";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { NavigationContext } from "~/contexts/navigation-context";
import { supabase } from "~/lib/supabase";
import { logger } from "~/lib/utils";

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
    <React.Fragment>
      <View className="grid gap-2 w-full p-6">
        <PassTemplateImage passTemplateId={pass.passTemplateId} />
        <Text>ID: {pass.id}</Text>
        <Text>発行日時: {pass.publishedAt}</Text>
        <Text>インストール日時: {pass.addedAt}</Text>
        <View className="flex flex-row gap-2">
          <Text>URLをコピー</Text>
          <CopyIcon />
        </View>
        <Button
          onPress={async () => {
            await onPressUse(new Date().toISOString());
          }}
          disabled={loading || !!pass.usedAt}
        >
          <Text>使用済みにする</Text>
        </Button>
        <Button
          onPress={async () => {
            onPressUse(null);
          }}
          variant={"destructive"}
          disabled={loading || !pass.usedAt}
        >
          <Text>使用前に戻す</Text>
        </Button>
      </View>
    </React.Fragment>
  );
}
