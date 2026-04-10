import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout, MainLayout } from '@/app/layouts';
import { VehicleDetailPage, VehiclesPage } from '@/pages/Vehicles';

import { routes } from './routes';

import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { RootRedirect } from './guards/RootRedirect';
import { PublicOnlyRoute } from './guards/PublicOnlyRoute';
import { ProtectedRoute } from './guards/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
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
          // {
          //   path: routes.vehicles.detail.path,
          //   element: <VehicleDetailPage />,
          // },
        ],
      },
    ],
  },
]);
