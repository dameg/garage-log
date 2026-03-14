import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout, MainLayout } from '@/app/layouts';
import { VehiclesPage } from '@/pages/Vehicles';
import { VehicleDetailPage } from '@/pages/Vehicles/detail';
import { routes } from './routes';

import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { ProtectedRoute, PublicOnlyRoute } from '@/features/auth';

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: routes.login.path,
            element: <LoginPage />,
          },
          {
            path: routes.register.path,
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
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
    ],
  },
]);
