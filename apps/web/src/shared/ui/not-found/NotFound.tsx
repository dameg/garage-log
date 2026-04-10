import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

type Props = {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
};

export function NotFound({
  title = 'Not found',
  description = 'The requested resource could not be found.',
  backHref,
  backLabel = 'Go back',
}: Props) {
  const navigate = useNavigate();

  return (
    <Center mih="100vh">
      <Stack align="center" gap="sm">
        <Title order={2}>{title}</Title>

        <Text c="dimmed" ta="center">
          {description}
        </Text>

        {backHref && <Button onClick={() => navigate(backHref)}>{backLabel}</Button>}
      </Stack>
    </Center>
  );
}
