import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/app/layouts";
import HomePage from "@/pages/Home";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);
