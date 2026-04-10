import { Center, Stack, Text, Title } from '@mantine/core';

type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
};

export function EmptyState({ title, description, action, icon }: Props) {
  return (
    <Center mih="60vh">
      <Stack align="center" gap="sm">
        {icon}

        <Title order={3} ta="center">
          {title}
        </Title>

        {description && (
          <Text c="dimmed" ta="center">
            {description}
          </Text>
        )}

        {action}
      </Stack>
    </Center>
  );
}
