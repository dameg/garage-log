import { Center, Loader } from '@mantine/core';
import { Navigate } from 'react-router-dom';

import { routes } from '@/app/routes';

import { useAuth } from '../../entities/auth/model/useAuth';

export function RootRedirect() {
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

  return <Navigate to={routes.login.build()} replace />;
}
