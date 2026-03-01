import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/app/layouts";
import { VehiclesPage } from "@/pages/Vehicles";
import { VehicleDetailPage } from "@/pages/Vehicles/detail";
import { routes } from "./routes";
import { DashboardPage } from "@/pages/Dashboard";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: routes.dashboard.path,
        element: <DashboardPage />,
      },
      {
        path: routes.vehicles.path,
        element: <VehiclesPage />,
      },
      {
        path: routes.vehicles.detail.path,
        element: <VehicleDetailPage />,
      },
    ],
  },
]);
