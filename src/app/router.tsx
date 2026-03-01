import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/app/layouts";
import { VehiclesPage } from "@/pages/Vehicles";
import { VehicleDetailPage } from "@/pages/Vehicles/detail";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/vehicles",
        element: <VehiclesPage />,
      },
      {
        path: "/vehicles/:id",
        element: <VehicleDetailPage />,
      },
    ],
  },
]);
