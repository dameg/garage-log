import { Alert, Container } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

type Props = {
  title: string;
  message: string;
};

export function ErrorAlert({ title, message }: Props) {
  return (
    <Container size="xl">
      <Alert icon={<IconInfoCircle size={16} />} color="red" radius="lg" title={title}>
        {message}
      </Alert>
    </Container>
  );
}
