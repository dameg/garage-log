import { Navigate, Outlet } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import { routes } from '@/app/routes';

export function PublicOnlyRoute() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={routes.vehicles.build()} replace />;
  }

  return <Outlet />;
}
