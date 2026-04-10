import { Box, Group, Paper, Text, ThemeIcon } from '@mantine/core';
import type { Icon } from '@tabler/icons-react';

type Props = {
  label: string;
  value: string | number;
  description: string;
  icon: Icon;
};

export function DetailStat({ label, value, description, icon: Icon }: Props) {
  return (
    <Paper p="lg" radius="lg" withBorder>
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Box>
          <Text size="sm" c="dimmed">
            {label}
          </Text>
          <Text fz="xl" fw={700} mt={6}>
            {value}
          </Text>
          <Text size="sm" c="dimmed" mt="xs">
            {description}
          </Text>
        </Box>

        <ThemeIcon size={40} radius="lg" variant="light" color="blue">
          <Icon size={22} stroke={1.8} />
        </ThemeIcon>
      </Group>
    </Paper>
  );
}
