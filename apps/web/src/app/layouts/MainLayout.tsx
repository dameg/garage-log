import { Outlet } from 'react-router-dom';
import { Navbar } from '@/widgets';
import { AppShell, Burger, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function MainLayout() {
  const [mobileNavbarOpened, { toggle: toggleMobileNavbar, close: closeMobileNavbar }] =
    useDisclosure(false);

  return (
    <AppShell
      padding="md"
      header={{ height: { base: 60, sm: 0 } }}
      navbar={{
        width: { base: 250, sm: 88 },
        breakpoint: 'sm',
        collapsed: {
          mobile: !mobileNavbarOpened,
        },
      }}
      style={{ minHeight: '100dvh' }}
    >
      <AppShell.Header hiddenFrom="sm" px="md">
        <Group h="100%" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={mobileNavbarOpened}
              onClick={toggleMobileNavbar}
              size="sm"
              aria-label={mobileNavbarOpened ? 'Close navigation menu' : 'Open navigation menu'}
            />
            <Title order={4}>GarageLog</Title>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        style={{ borderRight: '1px solid var(--mantine-color-default-border)' }}
      >
        <Navbar onNavigate={closeMobileNavbar} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
