import { Center,Loader } from '@mantine/core';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { routes } from '@/app/routes';

import { useAuth } from '../../entities/auth/model/useAuth';

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
