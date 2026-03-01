import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/primitives/card";
import type { Product } from "../types";

type Props = {
  product: Product;
};

const ListItem: React.FC<Props> = ({ product }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
        <CardDescription>-</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{product.body}</p>
      </CardContent>
    </Card>
  );
};

export default ListItem;
