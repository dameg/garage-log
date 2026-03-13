import { Center, Container, Paper } from '@mantine/core';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <Center mih="100vh" p="md">
      <Container size={420} w="100%">
        <Paper withBorder shadow="md" radius="md" p="xl">
          <Outlet />
        </Paper>
      </Container>
    </Center>
  );
}
