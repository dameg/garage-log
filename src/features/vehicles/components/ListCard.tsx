import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/primitives/card";
import type { Vehicle } from "../types";
import { NavLink } from "react-router";
import { Button } from "@/shared/ui/primitives/button";
import { Badge } from "@/shared/ui/primitives/badge";

type ListCardProps = { vehicle: Pick<Vehicle, "id" | "title" | "body"> };

export function ListCard({ vehicle }: ListCardProps) {
  const { title, body } = vehicle;
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">New</Badge>
        </CardAction>
        <CardTitle>{title}</CardTitle>
        <CardDescription>-</CardDescription>

        <CardContent>
          <p>{body}</p>
        </CardContent>
      </CardHeader>
      <CardFooter>
        <Button asChild variant={"link"}>
          <NavLink to={`/vehicles/${vehicle.id}`}>Details</NavLink>
        </Button>
      </CardFooter>
    </Card>
  );
}
