import { Group, Stack, Title } from '@mantine/core';

import classes from './Navbar.module.css';
import { navigation } from '@/app/config';
import { NavLink } from 'react-router-dom';
import { IconLogout } from '@tabler/icons-react';
import { useLogout } from '@/features/auth/hooks/useLogout';

export function Navbar() {
  const logout = useLogout();

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header}>
          <Title order={3}>
            <span>
              Garage<span className={classes.logoText}>Log</span>
            </span>
          </Title>
        </Group>
        <Stack gap="xs">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.to} to={item.to}>
                {({ isActive }) => (
                  <div className={classes.link} data-active={isActive || undefined}>
                    {Icon && <Icon className={classes.linkIcon} stroke={1.5} />}
                    <span>{item.label}</span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </Stack>
      </div>

      <div className={classes.footer}>
        <button onClick={() => logout.mutate()} className={classes.link}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
