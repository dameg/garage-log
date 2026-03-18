import type { PropsWithChildren } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
});

export function MantineAppProvider({ children }: PropsWithChildren) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  );
}
