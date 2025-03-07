import AndroidIcon from "assets/images/android.svg";
import AppleIcon from "assets/images/apple.svg";
import { Link } from "expo-router";
import { View } from "react-native";
import { Badge } from "~/components/ui/badge";
import { Text } from "~/components/ui/text";
import { formatDatetime } from "~/lib/utils";
import { Pass } from "~/types/supabase";

export function PassBlock({ pass }: { pass: Pass }) {
  return (
    <Link
      href={{
        pathname: "/home/pass",
        params: { passId: pass.id },
      }}
    >
      <View className="bg-white px-3 py-4 rounded-xl border border-border gap-2 w-full">
        <View className="flex flex-row gap-2">
          {!pass.usedAt ? (
            <Badge>
              <Text>未使用</Text>
            </Badge>
          ) : (
            <Badge variant="secondary">
              <Text>使用済み</Text>
            </Badge>
          )}
          <View className="flex flex-row items-center gap-1">
            {pass.platform === "android" ? (
              <>
                <AppleIcon className="size-[20px]" />
                <Text className="text-xs">iOS</Text>
              </>
            ) : (
              <>
                <AndroidIcon className="size-[20px]" />
                <Text className="text-xs">Android </Text>
              </>
            )}
          </View>
        </View>
        <Text className="text-sm">{pass.id}</Text>
        <Text className="text-xs text-muted-foreground">
          発行日時: {formatDatetime(pass.publishedAt)}
        </Text>
      </View>
    </Link>
  );
}
