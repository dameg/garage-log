import { Center,Loader } from '@mantine/core';
import { Navigate, Outlet } from 'react-router-dom';

import { routes } from '@/app/routes';

import { useAuth } from '../../entities/auth/model/useAuth';

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
