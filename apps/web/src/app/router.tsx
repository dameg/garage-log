import { createBrowserRouter } from 'react-router-dom';

import { LoginPage, RegisterPage, VehicleDetailPage, VehiclesPage } from '@/pages';

import { AuthLayout, MainLayout } from '@/app/layouts';

import { ProtectedRoute, PublicOnlyRoute, RootRedirect } from './guards';
import { routes } from './routes';

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
          {
            path: routes.vehicles.detail.path,
            element: <VehicleDetailPage />,
          },
        ],
      },
    ],
  },
]);
