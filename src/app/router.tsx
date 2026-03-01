import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/app/layouts";
import Products from "@/pages/Products";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/products",
        element: <Products />,
      },
    ],
  },
]);
