import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Pass } from "~/types/supabase";

export function PassBlock({ pass }: { pass: Pass }) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>{pass.id}</CardTitle>
      </CardHeader>
    </Card>
  );
}
