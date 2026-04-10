import { UnstyledButton, Text } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useLogout } from '../model/useLogout';
import { forwardRef } from 'react';

type Props = {
  onAction?: () => void;
  showLabel?: boolean;
};

export const LogoutUserAction = forwardRef<HTMLButtonElement, Props>(
  ({ onAction, showLabel }, ref) => {
    const { mutate } = useLogout();

    return (
      <UnstyledButton
        ref={ref}
        onClick={() => {
          onAction?.();
          mutate();
        }}
        w="100%"
        px={showLabel ? 'sm' : 0}
        py={showLabel ? 'xs' : 'sm'}
        style={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: showLabel ? 'flex-start' : 'center',
          borderRadius: theme.radius.sm,
          color: 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-1))',
        })}
      >
        <IconLogout
          stroke={1.5}
          size={25}
          style={{ marginRight: showLabel ? 'var(--mantine-spacing-sm)' : 0 }}
        />
        {showLabel ? (
          <Text size="sm" fw={500}>
            Logout
          </Text>
        ) : null}
      </UnstyledButton>
    );
  },
);
