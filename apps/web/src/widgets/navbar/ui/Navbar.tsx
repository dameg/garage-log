import { Box, Group, Stack, Text, ThemeIcon, Tooltip, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { NavLink } from 'react-router-dom';

import { navigation } from '@/app/config';

import { LogoutUserAction } from '@/features/auth/logout-user';
import { ThemeSelector } from '@/shared/ui';

type Props = {
  onNavigate?: () => void;
};

export function Navbar({ onNavigate }: Props) {
  const isMobile = useMediaQuery('(max-width: 48em)');
  const showLabels = !!isMobile;

  return (
    <Box component="nav" h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Box style={{ flex: 1 }}>
        <Group justify={showLabels ? 'flex-start' : 'center'} mb={showLabels ? 'md' : 'xl'}>
          <Tooltip label="GarageLog" position="right" disabled={showLabels}>
            <Box>
              {showLabels ? (
                <Group gap="sm" align="center">
                  <ThemeIcon size={38} radius="xl" color="blue" variant="filled" fw={800}>
                    GL
                  </ThemeIcon>
                  <Text fw={700} fz="xl" lh={1}>
                    Garage
                    <Text span c="blue.4" inherit>
                      Log
                    </Text>
                  </Text>
                </Group>
              ) : (
                <ThemeIcon size={44} radius="xl" color="blue" variant="filled" fw={800}>
                  GL
                </ThemeIcon>
              )}
            </Box>
          </Tooltip>
        </Group>

        <Stack gap="xs">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Tooltip key={item.to} label={item.label} position="right" disabled={showLabels}>
                <NavLink
                  to={item.to}
                  onClick={() => {
                    onNavigate?.();
                  }}
                >
                  {({ isActive }) => (
                    <UnstyledButton
                      w="100%"
                      px={showLabels ? 'sm' : 0}
                      py={showLabels ? 'xs' : 'sm'}
                      style={(theme) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: showLabels ? 'flex-start' : 'center',
                        borderRadius: theme.radius.sm,
                        color: isActive
                          ? 'var(--mantine-color-blue-light-color)'
                          : 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-1))',
                        backgroundColor: isActive
                          ? 'var(--mantine-color-blue-light)'
                          : 'transparent',
                      })}
                    >
                      {Icon ? (
                        <Icon
                          stroke={1.5}
                          size={25}
                          style={{
                            marginRight: showLabels ? 'var(--mantine-spacing-sm)' : 0,
                          }}
                        />
                      ) : null}
                      {showLabels ? (
                        <Text size="sm" fw={500}>
                          {item.label}
                        </Text>
                      ) : null}
                    </UnstyledButton>
                  )}
                </NavLink>
              </Tooltip>
            );
          })}
        </Stack>
      </Box>

      <Box pt="md" mt="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
        <Box mb="xs">
          <ThemeSelector showLabel={showLabels} />
        </Box>

        <Tooltip label="Logout" position="right" disabled={showLabels}>
          <LogoutUserAction showLabel={showLabels} onAction={onNavigate} />
        </Tooltip>
      </Box>
    </Box>
  );
}
