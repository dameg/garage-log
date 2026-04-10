import { Alert, Container } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

type Props = {
  message: string;
};

export function ErrorAlert({ message }: Props) {
  return (
    <Container size="xl">
      <Alert
        icon={<IconInfoCircle size={16} />}
        color="red"
        radius="lg"
        title="Unable to load vehicles"
      >
        {message}
      </Alert>
    </Container>
  );
}
