import {
  Box,
  Group,
  type MantineColorScheme,
  Menu,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { IconCheck, IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';

type ThemeSelectorOption = {
  value: MantineColorScheme;
  label: string;
  icon: typeof IconSun;
};

type Props = {
  showLabel?: boolean;
};

const options: ThemeSelectorOption[] = [
  { value: 'light', label: 'Light', icon: IconSun },
  { value: 'dark', label: 'Dark', icon: IconMoon },
  { value: 'auto', label: 'System', icon: IconDeviceDesktop },
];

export function ThemeSelector({ showLabel = false }: Props) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });

  const activeOption = options.find((option) => option.value === colorScheme) ?? options[2];
  const ActiveIcon = activeOption.icon;

  return (
    <Tooltip label={`Theme: ${activeOption.label}`} position="right" disabled={showLabel} withArrow>
      <Box>
        <Menu
          position={showLabel ? 'bottom-start' : 'right-end'}
          width={220}
          withinPortal
          shadow="md"
        >
          <Menu.Target>
            <UnstyledButton
              w="100%"
              px={showLabel ? 'sm' : 0}
              py={showLabel ? 'xs' : 'sm'}
              aria-label={`Theme: ${activeOption.label}`}
              title={showLabel ? undefined : `Theme: ${activeOption.label}`}
              style={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: showLabel ? 'flex-start' : 'center',
                borderRadius: theme.radius.sm,
                color: 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-1))',
              })}
            >
              <ThemeIcon
                size={34}
                radius="xl"
                variant="light"
                color={computedColorScheme === 'dark' ? 'yellow' : 'blue'}
                style={{ marginRight: showLabel ? 'var(--mantine-spacing-sm)' : 0 }}
              >
                <ActiveIcon stroke={1.7} size={20} />
              </ThemeIcon>

              {showLabel ? (
                <Box style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    Theme
                  </Text>
                  <Text size="xs" c="dimmed">
                    {activeOption.label}
                  </Text>
                </Box>
              ) : null}
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Appearance</Menu.Label>
            {options.map((option) => {
              const OptionIcon = option.icon;
              const isActive = option.value === colorScheme;

              return (
                <Menu.Item
                  key={option.value}
                  onClick={() => setColorScheme(option.value)}
                  leftSection={<OptionIcon size={16} stroke={1.7} />}
                  rightSection={isActive ? <IconCheck size={16} stroke={1.9} /> : undefined}
                >
                  <Group justify="space-between" gap="xs" wrap="nowrap">
                    <Text size="sm">{option.label}</Text>
                    {option.value === 'auto' ? (
                      <Text size="xs" c="dimmed">
                        {computedColorScheme === 'dark' ? 'Using dark' : 'Using light'}
                      </Text>
                    ) : null}
                  </Group>
                </Menu.Item>
              );
            })}
          </Menu.Dropdown>
        </Menu>
      </Box>
    </Tooltip>
  );
}
