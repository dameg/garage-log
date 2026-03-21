import type { PropsWithChildren } from 'react';
import { MantineProvider, createTheme, localStorageColorSchemeManager } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
});

const colorSchemeManager = localStorageColorSchemeManager({
  key: 'garage-log-color-scheme',
});

export function MantineAppProvider({ children }: PropsWithChildren) {
  return (
    <MantineProvider
      theme={theme}
      colorSchemeManager={colorSchemeManager}
      defaultColorScheme="auto"
    >
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  );
}
