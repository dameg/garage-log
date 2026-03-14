import { Outlet } from 'react-router-dom';
import { Navbar } from '@/widgets';
import { AppShell } from '@mantine/core';

export function MainLayout() {
  return (
    <AppShell
      padding="md"
      navbar={{ width: 300, breakpoint: 'sm' }}
      style={{ minHeight: '100dvh' }}
    >
      <AppShell.Navbar p="md" style={{ borderRight: '1px solid var(--mantine-color-dark-4)' }}>
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
