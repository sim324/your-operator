import { Card, CardContent } from "@/components/ui/card";

// One headline number, shared by the leader pages (AI visibility, reviews)
// so their metric cards look the same.
export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-7xl leading-none font-black tabular-nums">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
