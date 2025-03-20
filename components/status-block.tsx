import { Badge } from "~/components/ui/badge";
import { Text } from "~/components/ui/text";

export default function StatusBlock({ redeemed }: { redeemed: boolean }) {
  return !redeemed ? (
    <Badge>
      <Text>未使用</Text>
    </Badge>
  ) : (
    <Badge variant="secondary">
      <Text>使用済み</Text>
    </Badge>
  );
}
