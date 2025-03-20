import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Link } from "expo-router";
import { View } from "react-native";
import Avatar from "react-native-boring-avatars";
import PlatformBlock from "~/components/platform-block";
import StatusBlock from "~/components/status-block";
import { Text } from "~/components/ui/text";
import { Pass } from "~/types/supabase";

export function PassBlock({ pass }: { pass: Pass }) {
  return (
    <Link
      href={{
        pathname: "/home/pass",
        params: { passId: pass.id },
      }}
    >
      <View className="bg-white px-3 py-4 rounded-xl border border-border gap-3 w-full">
        <View className="flex flex-row gap-2">
          <StatusBlock redeemed={!!pass.redeemedAt} />
          <PlatformBlock platform={pass.platform} />
        </View>
        <View className="flex flex-row items-center gap-2">
          <Avatar name={pass.id} size={24} />
          <Text className="text-sm">{pass.id}</Text>
        </View>
        <Text className="text-xs text-muted-foreground">
          {formatDistanceToNow(pass.createdAt, { locale: ja })}前に配布
        </Text>
      </View>
    </Link>
  );
}
