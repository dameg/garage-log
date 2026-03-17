import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';
import { useAuth } from '../../hooks/useAuth';
import { routes } from '@/app/routes';

export function ProtectedRoute() {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.login.build()} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
