import { Link } from "expo-router";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>{pass.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>発行日時: {pass.publishedAt}</Text>
          {pass.usedAt && (
            <Badge>
              <Text>使用済み</Text>
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
