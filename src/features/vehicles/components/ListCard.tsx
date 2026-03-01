import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/primitives/card";
import type { Vehicle } from "../types";

type ListCardProps = { vehicle: Pick<Vehicle, "title" | "body"> };

export function ListCard({ vehicle }: ListCardProps) {
  const { title, body } = vehicle;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>-</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
