import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout, MainLayout } from '@/app/layouts';
import { VehiclesPage } from '@/pages/Vehicles';
import { VehicleDetailPage } from '@/pages/Vehicles/detail';
import { routes } from './routes';
import { DashboardPage } from '@/pages/Dashboard';
import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';

export const router = createBrowserRouter([
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
  {
    path: '/',
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
